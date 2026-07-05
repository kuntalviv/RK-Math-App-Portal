<template>
  <form class="form-grid" @submit.prevent="handleSubmit">
    <h2 class="form-title">
      {{ notificationToEdit ? 'Edit Notification' : 'Add Notification' }}
    </h2>

    <label class="full-width">
      Title:
      <input v-model="title" type="text" required />
    </label>

    <label class="full-width">
      Body:
      <textarea v-model="body" rows="4" required></textarea>
    </label>

    <label>
      Scheduled At:
      <input v-model="scheduledAt" type="datetime-local" required />
    </label>

    <label class="horizontal-flow">
      Active
      <input v-model="isActive" type="checkbox" />
    </label>

    <section class="actions">
      <button type="submit">Save</button>
      <button type="button" @click="emit('close')">Cancel</button>
    </section>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  notificationToEdit: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['save', 'close'])

const title = ref('')
const body = ref('')
const scheduledAt = ref('')
const isActive = ref(false);

onMounted(() => {
  if (!props.notificationToEdit) return

  title.value = props.notificationToEdit.title
  body.value = props.notificationToEdit.body
  scheduledAt.value = props.notificationToEdit.scheduled_at?.slice(0, 16) || ''
  isActive.value = props.notificationToEdit.is_active
})

function handleSubmit() {
  emit('save', {
    id: props.notificationToEdit?.id,
    title: title.value,
    body: body.value,
    scheduled_at: scheduledAt.value,
    is_active: isActive.value,
  })
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background: white;
  width: 600px;
}

.form-title,
.full-width,
.actions {
  grid-column: span 2;
}

.form-title {
  text-align: center;
  margin: 0;
}

label {
  display: flex;
  flex-direction: column;

  &.horizontal-flow {
    flex-direction: row;
    justify-content: center;
    align-items: end;
    gap: 10px;
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
