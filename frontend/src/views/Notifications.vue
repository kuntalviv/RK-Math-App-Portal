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
          <th>Launch URL</th>
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
          <td>{{ notification.launch_url }}</td>
          <td>{{ formatDateTime(notification.scheduled_at) }}</td>
          <td>{{ notification.status }}</td>
          <td>{{ formatDateTime(notification.created_at) }}</td>
          <td>{{ notification.sent_at ? formatDateTime(notification.sent_at) : '-' }}</td>
          <td>{{ notification.is_active }}</td>
          <td>
            <button type="button" @click="openEditModal(notification)">✏️</button>
            <button type="button" @click="handleDelete(notification.id)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <section v-if="isModalOpen" class="modal-backdrop">
      <NotificationForm :notification-to-edit="selectedNotification" @save="createOrUpdateNotification"
        @close="closeModal" />
    </section>
  </main>

  <section v-if="isSaving" class="modal-backdrop">
    <div class="spinner"></div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NotificationForm from '@/components/NotificationForm.vue'
import { fetchNotifications, createNotification, updateNotification, deleteNotification, formatDateTime } from '@/utilities/db.js';

const notifications = ref([])
const loading = ref(true)
const isSaving = ref(false)
const error = ref(null)
const isModalOpen = ref(false)
const selectedNotification = ref(null)

onMounted(async () => {
  loading.value = true;
  notifications.value = await fetchNotifications()
  loading.value = false;
})

async function createOrUpdateNotification(notificationData) {
  isSaving.value = true;

  let data;

  if (selectedNotification.value) {
    data = await updateNotification(notificationData)
    notifications.value = notifications.value.map(notification =>
      notification.id === data.id ? data : notification
    )
  } else {
    data = await createNotification(notificationData)
    notifications.value.unshift(data)
  }

  closeModal()
  isSaving.value = false;

}

async function handleDelete(notificationId) {
  const confirmed = confirm('Delete this notification?')
  if (!confirmed) return;

  await deleteNotification(notificationId);

  notifications.value = notifications.value.filter(notification => notification.id !== notificationId);
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

</script>

<style scoped>
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
