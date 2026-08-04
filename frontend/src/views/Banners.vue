<script setup>
import { ref, onMounted } from 'vue';
import BannerForm from '@/components/BannerForm.vue';
import { supabase } from '@/lib/supabase';

const loading = ref(true);
const error = ref('');
const selectedBanner = ref(null);
const banners = ref([]);
const isModalOpen = ref(false);
const isSaving = ref(false);

onMounted(async () => {
    await fetchBanners();
});

async function fetchBanners() {
    loading.value = true;

    const { data, error: fetchError } = await supabase
        .from('Banners')
        .select('id, is_active, image_url, launch_url, title, description')
        .order('id', { ascending: false });

    if (fetchError) {
        error.value = fetchError.message;
        console.error(fetchError.message);
    } else {
        banners.value = data ?? [];
    }

    loading.value = false;
}

function openCreateModal() {
    selectedBanner.value = null;
    isModalOpen.value = true;
}

function handleEditClick(banner) {
    selectedBanner.value = banner;
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    selectedBanner.value = null;
}

async function createBanner(bannerData) {
    isSaving.value = true;
    const { data, error } = await supabase
        .from('Banners')
        .insert({
            is_active: bannerData.is_active,
            image_url: bannerData.image_url,
            launch_url: bannerData.launch_url,
            title: bannerData.title,
            description: bannerData.description,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to create banner:', error.message);
        return;
    }

    banners.value.unshift(data);
    closeModal();
    isSaving.value = false;
}

async function updateBanner(bannerData) {
    isSaving.value = true;
    const { data, error } = await supabase
        .from('Banners')
        .update({
            is_active: bannerData.is_active,
            image_url: bannerData.image_url,
            launch_url: bannerData.launch_url,
            title: bannerData.title,
            description: bannerData.description,
        })
        .eq('id', bannerData.id)
        .select()
        .single();

    if (error) {
        console.error('Failed to update banner:', error.message);
        return;
    }

    banners.value = banners.value.map((banner) =>
        banner.id === data.id ? data : banner
    );

    closeModal();
    isSaving.value = false;
}

async function createOrUpdateBanner(bannerData) {
    if (bannerData.id) {
        await updateBanner(bannerData);
    } else {
        await createBanner(bannerData);
    }
}

async function deleteBanner(bannerId) {
    const confirmed = confirm('Delete this banner?');
    if (!confirmed) return;

    const { error } = await supabase
        .from('Banners')
        .delete()
        .eq('id', bannerId);

    if (error) {
        console.error('Banner could not be deleted:', error.message);
        return;
    }

    banners.value = banners.value.filter((banner) => banner.id !== bannerId);
}
</script>

<template>
    <section class="header">
        <h1>Banners</h1>
        <button class="add-banner" @click="openCreateModal">+</button>
    </section>

    <main>
        <p v-if="loading">Loading...</p>
        <p v-else-if="error">{{ error }}</p>

        <section v-else class="banner-card-layout">

            <section class="banner-card" v-for="banner in banners" :key="banner.id">

                <div class="banner-actions">
                    <button type="button" @click="handleEditClick(banner)">✏️</button>
                    <button type="button" @click="deleteBanner(banner.id)">🗑️</button>
                </div>
                <div class="banner-header">
                    <strong>Title: {{ banner.title }}</strong>
                    <strong>Status: {{ banner.is_active ? "Active" : "Inactive" }} </strong>

                </div>

                <a :href="'https://' + banner.launch_url">
                    <article>
                        <img :src="banner.image_url" />
                    </article>
                </a>
            </section>

        </section>
    </main>

    <section v-if="isModalOpen" class="modal-backdrop">
        <BannerForm class="modal-content" :banner-to-edit="selectedBanner" @save="createOrUpdateBanner"
            @close="closeModal" />
    </section>

    <section v-if="isSaving" class="modal-backdrop">
        <div class="spinner"></div>
    </section>
</template>

<style scoped>
.banner-header {
    display: flex;
    flex-direction: column;
}

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

.banner-actions {
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

.banner-card-layout {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}


.banner-card {
    flex-basis: 40%;

    gap: 16px;
    margin-block-end: 8px;
    padding: 20px;
    border: 2px solid #d97706;
    border-radius: 16px;

    background: linear-gradient(135deg, #fff7ed, #fed7aa);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    transition: transform 0.2s ease, box-shadow 0.2s ease;

    & img {
        max-width: 100%;
        height: auto;
    }
}

.banner-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>