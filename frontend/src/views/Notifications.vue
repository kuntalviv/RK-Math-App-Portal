<template>
  <main>
    <section class="header">
      <h1>Notifications</h1>
      <button @click="openAddModal">+</button>
    </section>

    <p v-if="loading">Loading notifications...</p>
    <p v-else-if="error">{{ error }}</p>

    <table v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Scheduled At</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Sent At</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(notification, index) in notifications" :key="notification.id">
          <td>{{ index + 1 }}</td>
          <td>{{ notification.title }}</td>
          <td>{{ formatDateTime(notification.scheduled_at) }}</td>
          <td>{{ notification.status }}</td>
          <td>{{ formatDateTime(notification.created_at) }}</td>
          <td>{{ notification.sent_at ? formatDateTime(notification.sent_at) : '-' }}</td>
          <td>{{ notification.is_active }}</td>
          <td>
            <button type="button" @click="openEditModal(notification)">✏️</button>
            <button type="button" @click="deleteNotification(notification.id)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <section v-if="isModalOpen" class="modal-backdrop">
      <NotificationForm :notification-to-edit="selectedNotification" @save="createOrUpdateNotification"
        @close="closeModal" />
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import NotificationForm from '@/components/NotificationForm.vue'

const notifications = ref([])
const loading = ref(true)
const error = ref(null)
const isModalOpen = ref(false)
const selectedNotification = ref(null)

onMounted(fetchNotifications)

async function fetchNotifications() {
  const { data, error: supabaseError } = await supabase
    .from('scheduled_notifications')
    .select('id, title, body, scheduled_at, status, is_active, created_at, sent_at')
    .order('scheduled_at', { ascending: false })


  if (supabaseError) {
    error.value = supabaseError.message
  } else {
    notifications.value = data
  }
  loading.value = false
}

function openAddModal() {
  selectedNotification.value = null
  isModalOpen.value = true
}

function openEditModal(notification) {
  selectedNotification.value = notification
  isModalOpen.value = true
}

function closeModal() {
  selectedNotification.value = null
  isModalOpen.value = false
}

function createOrUpdateNotification(notificationData) {
  if (selectedNotification.value) {
    updateNotification(notificationData)
  } else {
    createNotification(notificationData)
  }
}

async function createNotification(notificationData) {
  console.log(notificationData.scheduled_at);
  const { data, error } = await supabase
    .from('scheduled_notifications')
    .insert({
      title: notificationData.title,
      body: notificationData.body,
      scheduled_at: new Date(notificationData.scheduled_at).toISOString(),
      status: "pending",
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error(error.message)
    return
  }

  notifications.value.unshift(data)
  closeModal()
}

async function updateNotification(notificationData) {

  const { data, error } = await supabase
    .from('scheduled_notifications')
    .update({
      title: notificationData.title,
      body: notificationData.body,
      scheduled_at: new Date(notificationData.scheduled_at).toISOString(),
      is_active: notificationData.is_active,
    })
    .eq('id', notificationData.id)
    .select()
    .single()

  if (error) {
    console.error(error.message)
    return
  }

  notifications.value = notifications.value.map(notification =>
    notification.id === data.id ? data : notification
  )

  closeModal()
}

async function deleteNotification(id) {
  const confirmed = confirm('Delete this notification?')
  if (!confirmed) return

  const { error } = await supabase
    .from('scheduled_notifications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error.message)
    return
  }

  notifications.value = notifications.value.filter(notification => notification.id !== id)
}

function formatDateTime(value) {
  if (!value) return '-'

  return new Date(value).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block: 20px;

  >* {
    padding-inline: 20px;
  }
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  vertical-align: top;
}

td:last-child {
  white-space: nowrap;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
