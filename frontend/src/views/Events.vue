//@ts-nocheck
<template>
  <main class="page">
    <section class="header">
      <h1> Events </h1>
      <button class="add-event-btn" @click="selectedEvent = null; isModalOpen = true">
        +
      </button>
    </section>
    <p v-if="loading">Loading events...</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else class="event-list">
      <article v-for="event in events" :key="event.id" class="event-item">
        <div class="event-actions">
          <button type="button" @click="handleEditClick(event)">✏️</button>
          <button type="button" @click="handleDelete(event.id)">🗑️</button>
        </div>
        <div class="event-header">
          <strong>Title: {{ event.name }}</strong>
          <strong>Status: {{ event.is_active ? "Active" : "Inactive" }} </strong>

        </div>
        <EventCard :event-date="event.date" :event-end-date="event.end_date" :venue="event.venue"
          :image-url="event.image_url" :external-url="event.event_url" />
      </article>
    </section>
    <section v-if="isModalOpen" class="modal-backdrop">
      <EventForm class="modal-content" :event-to-edit="selectedEvent" @save="handleSave" @close="isModalOpen = false" />
    </section>
  </main>

  <section v-if="isSaving" class="modal-backdrop">
    <div class="spinner"></div>
  </section>
</template>

<script setup lang="js">
import { supabase } from '@/lib/supabase'
import { ref, onMounted } from 'vue'
import EventCard from '@/components/EventCard.vue';
import EventForm from '@/components/EventForm.vue';
import { createNotification, deleteChildNotifications } from '@/utilities/db.js';

const isModalOpen = ref(false);
const events = ref([]);
const loading = ref(true);
const isSaving = ref(false);
const error = ref(null);
const selectedEvent = ref(null);

onMounted(async () => {
  const { data, error: supabaseError } = await supabase
    .from('Events')
    .select('*')

  if (supabaseError) {
    error.value = supabaseError.message
  } else {
    events.value = data
  }

  loading.value = false
}
)

function handleEditClick(event) {
  selectedEvent.value = event
  isModalOpen.value = true;
}

async function editEvent(eventData) {
  isSaving.value = true;
  const dbEvent = {
    name: eventData.name,
    is_active: eventData.is_active,
    date: eventData.date,
    end_date: eventData.end_date,
    image_url: eventData.image_url,
    venue: eventData.venue,
    event_url: eventData.event_url,
    description: eventData.description,
    auto_create_notification: eventData.auto_create_notification,
  }
  const { data, error } = await supabase
    .from('Events')
    .update(dbEvent)
    .eq('id', eventData.id)
    .select()
    .single()

  if (error) {
    console.error(error.message); return;
  }
  events.value = events.value.map(event => {
    return event.id === eventData.id ? data : event;
  })

  isModalOpen.value = false;
  selectedEvent.value = null;
  isSaving.value = false;

  return data;

}

async function handleSave(eventData) {
  const updatedEvent = await createOrUpdateEvent(eventData);

  if (eventData.auto_create_notification) {
    const notificationDate = new Date(eventData.date);
    notificationDate.setDate(notificationDate.getDate() - 1);

    const data = {
      title: eventData.name,
      body: eventData.description,
      scheduled_at: notificationDate.toISOString(),
      status: "pending",
      is_active: true,
      launch_url: eventData.launch_url,
      event_id: updatedEvent.id,
    }
    if (eventData.id) {
      console.log(eventData.id);
      //TODO: Make the following atomic later
      await deleteChildNotifications(eventData.id);
      await createNotification(data);

    } else {
      await createNotification(data);
    }
  }

}

async function handleDelete(eventId) {
  loading.value = true;
  await deleteEvent(eventId);
  await deleteChildNotifications(eventId);

  loading.value = false
}

async function createOrUpdateEvent(eventData) {
  if (selectedEvent.value) {
    return await editEvent(eventData)
  } else {
    return await createEvent(eventData)
  }
}

async function createEvent(eventData) {
  isSaving.value = true;
  const dbEvent = {
    name: eventData.name,
    is_active: eventData.is_active,
    date: eventData.date,
    end_date: eventData.end_date,
    image_url: eventData.image_url,
    venue: eventData.venue,
    event_url: eventData.event_url,
    description: eventData.description,
    auto_create_notification: eventData.auto_create_notification,
  }
  const { data, error } = await supabase
    .from('Events')
    .insert(dbEvent)
    .select()
    .single()

  if (error) {
    console.error(error.message); return;
  }

  events.value.push(data);
  isModalOpen.value = false;
  isSaving.value = false;

  return data;
}

async function deleteEvent(id) {
  const confirmed = confirm('Delete this event?');
  if (!confirmed) return;
  const { error } = await supabase
    .from('Events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error)
    return
  }

  events.value = events.value.filter(event => event.id !== id)
}

</script>

<style scoped>
.event-header {
  display: flex;
  flex-direction: column;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #eee;
  border-top: 5px solid #ff9800;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.add-event-btn {
  height: 30px;
}

.header {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.event-item {
  align-self: center;
}

.event-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 6px;
}

.event-list {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
}
</style>
