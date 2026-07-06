// @ts-nocheck
// @ts-ignore
<script setup lang="ts">

const props = defineProps({
  eventDate: String,
  venue: String,
  imageUrl: String,
  externalUrl: String,
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  )
}
</script>

<template>

  <a class="event-card" :href="externalUrl" target="_blank" rel="noopener noreferrer">
    <img class="event-image" :src="imageUrl" alt="Event Image" />
    <div class="event-info">
      <p>Date: {{ formatDate(eventDate) }}</p>
      <h4>Venue: {{ venue }}</h4>
    </div>
  </a>
</template>


<style scoped>
.event-info {
  padding: 12px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.event-card {
  width: 400px;
  border: 2px solid black;
  border-radius: 8px;
  display: block;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.event-info p,
.event-info h4 {
  margin: 0;
}
</style>
