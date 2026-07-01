<script setup>
import { ref } from 'vue';
import QuotationForm from '@/components/QuotationForm.vue';

const loading = ref(true);
const error = ref(null);
const selectedQuotation = ref(null);
const quotationsList = ref([
    {
        "text": "As one can reach the roof of a house by means of a ladder or a bamboo or a rope or a stairs, so diverse are the ways and means to approach God, and every religion in the world shows one of these ways.",
        "author": "Sri Ramakrishna",
        "image": "./src/assets/sri_ramakrishna.jpg",
        "flutterPath": ""
    },
    {
        "text": "Take up one idea. Make that one idea your life; dream of it; think of it; live on that idea. Let the brain, the body, muscles, nerves, every part of your body be full of that idea, and just leave every other idea alone. This is the way to success, and this is the way great spiritual giants are produced.",
        "author": "Swami Vivekananda",
        "image": "./src/assets/swami_vivekananda.jpg",
        "flutterPath": ""
    },
    {
        "text": "My child, if you want peace of mind, do not find fault with others. See your own faults. Learn to make the whole world your own. No one is a stranger, my child; the whole world is your own.",
        "author": "Ma Sarada",
        "image": "./src/assets/ma_sarada.jpg",
        "flutterPath": ""
    },
])
const isModalOpen = ref(false);

</script>

<template>
    <section class="header">
        <h1>Banners</h1>
        <button class="add-banner" @click="selectedEvent = null; isModalOpen = true">+</button>
    </section>

    <section class="quotation-card-layout" v-for="quotation in quotationsList" :key="quotation.text">
        <div class="event-actions">
            <button type="button" @click="handleEditClick(event)">✏️</button>
            <button type="button" @click="deleteEvent(event.id)">🗑️</button>
        </div>
        <article class="quotation-card">

            <img width="100" :src="quotation.image" />
            <p> {{ quotation.text }} <em class="quotation-card-author"> - {{ quotation.author }}</em></p>

        </article>
    </section>

    <section v-if="isModalOpen" class="modal-backdrop">
        <QuotationForm class="modal-content" :event-to-edit="selectedEvent" @save="createOrUpdateEvent"
            @close="isModalOpen = false" />
    </section>

</template>

<style scoped>
.event-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 6px;
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

.header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-block: 20px;

    >* {
        padding-inline: 20px;
    }
}

.add-banner {
    height: 30px;
}

.quotation-card {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-block-end: 8px;
    padding: 20px;
    border: 2px solid #d97706;
    border-radius: 16px;

    background: linear-gradient(135deg, #fff7ed, #fed7aa);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.quotation-card-layout:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.quotation-card img {
    border-radius: 12px;
    border: 2px solid white;
    background: white;
    padding: 6px;
    flex-shrink: 0;
}

.quotation-card p {
    font-size: x-large;
    line-height: 1.6;
    color: #7c2d12;
    margin: 0;
    font-style: italic;
}
</style>