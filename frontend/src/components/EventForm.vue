<template>
  <form class="form-grid" @submit.prevent="handleSubmit">
    <h2 class="form-title">
      {{ eventToEdit ? 'Edit Event' : 'Add Event' }}
    </h2>

    <label for="venue">
      Venue:
      <input v-model="venue" id="venue" name="venue" type="text" />
    </label>

    <label for="date">
      Date:
      <input v-model="date" id="date" name="date" type="date" />
    </label>

    <label for="eventName">
      Name:
      <input v-model="eventName" id="eventName" name="eventName" type="text" />
    </label>

    <label for="imageUrl">
      Image URL:
      <input v-model="imageUrl" id="imageUrl" name="imageUrl" type="text" />
    </label>

    <label class="full-width" for="eventUrl">
      Event URL:
      <input v-model="eventUrl" id="eventUrl" name="eventUrl" type="text" />
    </label>
    <button type="submit">Save</button>
    <button @click="handleCancel">Cancel</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const venue = ref("");
const date = ref("");
const eventName = ref("");
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
    image_url: imageUrl.value,
    date: date.value,
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
  imageUrl.value = props.eventToEdit.image_url;
  date.value = props.eventToEdit.date?.slice(0, 10) || '';
  eventUrl.value = props.eventToEdit.event_url;
})
</script>

<style scoped>
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
