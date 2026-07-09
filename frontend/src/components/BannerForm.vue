<template>
    <form class="form-grid" @submit.prevent="handleSubmit">
        <h2 class="form-title">
            {{ bannerToEdit ? 'Edit banner' : 'Add banner' }}
        </h2>

        <label class="full-width" for="imagePath">
            Image URL:
            <input v-model="imageUrl" id="imagePath" name="imagePath" type="text" />
        </label>

        <label class="horizontal-flow full-width">
            Active
            <input v-model="isActive" type="checkbox" />
        </label>

        <button type="submit">Save</button>
        <button type="button" @click="handleCancel">Cancel</button>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isActive = ref(true);
const imageUrl = ref('');

const props = defineProps({
    bannerToEdit: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['save', 'close']);

onMounted(() => {
    if (!props.bannerToEdit) return;

    isActive.value = props.bannerToEdit.is_active;
    imageUrl.value = props.bannerToEdit.image_url;
});

function handleSubmit() {
    emit('save', {
        id: props.bannerToEdit?.id,
        image_url: imageUrl.value,
        is_active: isActive.value,
    });
}

function handleCancel() {
    emit('close');
}
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
