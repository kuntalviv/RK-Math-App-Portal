<template>
    <form class="form-grid" @submit.prevent="handleSubmit">
        <h2 class="form-title">
            {{ quoteToEdit ? 'Edit quote' : 'Add quote' }}
        </h2>

        <label for="quoteText">
            Text:
            <input v-model="quoteText" id="quoteText" name="quoteText" type="text" />
        </label>

        <label for="quoteAuthor">
            Author:
            <input v-model="quoteAuthor" id="quoteAuthor" name="quoteAuthor" type="quoteAuthor" />
        </label>

        <label class="full-width" for="imagePath">
            Image URL:
            <input v-model="imagePath" id="imagePath" name="imagePath" type="text" />
        </label>

        <label class="full-width" for="flutterImagePath">
            Flutter Image URL:
            <input v-model="flutterImagePath" id="flutterImagePath" name="flutterImagePath" type="text" />
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
