<template>
  <form class="form-grid" @submit.prevent="handleSubmit">
    <h2 class="form-title">
      {{ eventToEdit ? 'Edit Event' : 'Add Event' }}
    </h2>

    <label for="eventName">
      Name:
      <input v-model="eventName" id="eventName" name="eventName" type="text" />
    </label>

    <label for="venue">
      Venue:
      <input v-model="venue" id="venue" name="venue" type="text" />
    </label>

    <label for="date">
      Start Date:
      <input v-model="date" id="date" name="date" type="date" />
    </label>

    <label for="date">
      End Date:
      <input v-model="endDate" id="endDate" name="endDate" type="date" />
    </label>

    <label class="full-width">
      Description:
      <textarea v-model="description" rows="4" required></textarea>
    </label>

    <label class="full-width" for="imageUrl">
      Image URL:
      <input v-model="imageUrl" id="imageUrl" name="imageUrl" type="text" />
    </label>

    <label class="full-width" for="eventUrl">
      Event URL:
      <input v-model="eventUrl" id="eventUrl" name="eventUrl" type="text" />
    </label>
    <label class="horizontal-flow">
      Active
      <input v-model="isActive" type="checkbox" />
    </label>
    <label class="horizontal-flow">
      Auto Create Notification
      <input v-model="auto_create_notification" type="checkbox" checked />
    </label>
    <button type="submit">Save</button>
    <button @click="handleCancel">Cancel</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const venue = ref("");
const date = ref("");
const endDate = ref("");
const eventName = ref("");
const isActive = ref(true);
const autoCreateNotification = ref(true);
const description = ref("");
const imageUrl = ref("");
const eventUrl = ref("");

const props = defineProps({
  "eventToEdit": {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['save', 'close']);

function handleSubmit() {
  const formData =
  {
    id: props.eventToEdit?.id,
    venue: venue.value,
    name: eventName.value,
    is_active: isActive.value,
    auto_create_notification: autoCreateNotification.value,
    description: description.value,
    image_url: imageUrl.value,
    date: date.value,
    end_date: endDate.value,
    event_url: eventUrl.value,
  };

  emit('save', formData);
}

function handleCancel() {
  emit('close');
}

onMounted(() => {
  if (!props.eventToEdit) return;

  console.log(props.eventToEdit)
  console.log(props.eventToEdit?.date)

  venue.value = props.eventToEdit.venue;
  eventName.value = props.eventToEdit.name;
  isActive.value = props.eventToEdit.is_active;
  autoCreateNotification.value = props.eventToEdit.auto_create_notification;
  description.value = props.eventToEdit.description;
  imageUrl.value = props.eventToEdit.image_url;
  date.value = props.eventToEdit.date?.slice(0, 10) || '';
  endDate.value = props.eventToEdit.end_date?.slice(0, 10) || '';
  eventUrl.value = props.eventToEdit.event_url;
})
</script>

<style scoped>
label {
  display: flex;
  flex-direction: column;

  &.horizontal-flow {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

.form-title {
  grid-column: span 2;
  text-align: center;
  margin: 0;
}

.form-grid label {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}
</style>
