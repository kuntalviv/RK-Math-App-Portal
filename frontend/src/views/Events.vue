//@ts-nocheck
<template>
  <main class="page">
    <section class="header">
      <h1> Events </h1>
      <button class="add-event-btn" @click="selectedEvent = null; isModalOpen = true">
        Add Event
      </button>
    </section>
    <p v-if="loading">Loading events...</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else class="event-list">
      <article v-for="event in events" :key="event.id" class="event-item">
        <div class="event-actions">
          <button type="button" @click="handleEditClick(event)">✏️</button>
          <button type="button" @click="deleteEvent(event.id)">🗑️</button>
        </div>

        <EventCard :event-date="event.date" :venue="event.venue" :image-url="event.image_url"
          :external-url="event.event_url" />
      </article>
    </section>
    <section v-if="isModalOpen" class="modal-backdrop">
      <EventForm class="modal-content" :event-to-edit="selectedEvent" @save="createOrUpdateEvent"
        @close="isModalOpen = false" />
    </section>
  </main>
</template>

<script setup lang="js">
import { supabase } from '@/lib/supabase'
import { ref, onMounted } from 'vue'
import EventCard from '@/components/EventCard.vue';
import EventForm from '@/components/EventForm.vue';

const isModalOpen = ref(false);
const events = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedEvent = ref(null);

onMounted(async () => {
  const { data, error: supabaseError } = await supabase
    .from('Events')
    .select('id, name, date, venue, image_url, event_url')

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
  const dbEvent = {
    name: eventData.name,
    date: eventData.date,
    image_url: eventData.image_url,
    venue: eventData.venue,
    event_url: eventData.event_url,
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
    return data.id === eventData.id ? data : event;
  })

  isModalOpen.value = false;
  selectedEvent.value = null;

}

function createOrUpdateEvent(eventData) {
  if (selectedEvent.value) {
    editEvent(eventData)
  } else {
    createEvent(eventData)
  }
}

async function createEvent(eventData) {
  console.log("Event Data: " + JSON.stringify(eventData));
  const dbEvent = {
    name: eventData.name,
    date: eventData.date,
    image_url: eventData.image_url,
    venue: eventData.venue,
    event_url: eventData.event_url,
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
  justify-content: space-between;
  align-items: center;
}

.event-item {
  width: 400px;
}

.event-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 6px;
}

.event-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
