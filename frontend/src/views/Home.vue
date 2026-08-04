// @ts-ignore
<script setup lang="ts">
import { supabase } from '@/lib/supabase';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import Events from '@/views/Events.vue';
import Notifications from '@/views/Notifications.vue';
import Banners from '@/views/Banners.vue';
import AppLogo from '@/assets/Ramakrishna_Math-Logo.jpg';

const router = useRouter();

let user = ref<any>(null);
let activeTab = ref("events");
onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null;

  const lastActiveTab = localStorage.getItem("lastActiveTab");
  if (lastActiveTab) {
    activeTab.value = lastActiveTab;
  }
})

async function signOut() {
  supabase.auth.signOut();

  router.push('/login');
}

function handleTabClick(tabName: string) {
  activeTab.value = tabName;
  localStorage.setItem("lastActiveTab", tabName);
}

</script>

<template>
  <header class="app-header">
    <section class="app-navigation">
      <strong class="app-title">Admin Portal </strong>
      <nav class="app-tabs">
        <button :class="{ active: activeTab === 'events' }" @click="handleTabClick('events')">Events</button>
        <button :class="{ active: activeTab === 'notifications' }"
          @click="handleTabClick('notifications')">Notifications</button>
        <button :class="{ active: activeTab === 'banners' }" @click="handleTabClick('banners')">Banners</button>
      </nav>
      <span class="app-user">
        {{ user?.email }}
        <button type="button" class="app-signout" @click="signOut">Sign Out </button>
      </span>
    </section>
  </header>
  <hr>
  <main class="page">
    <Events v-if="activeTab === 'events'" />
    <Notifications v-if="activeTab === 'notifications'" />
    <Banners v-if="activeTab === 'banners'" />
  </main>

</template>

<style scoped>
.app-header {
  >* {
    margin-block: 8px;
  }
}

.user-info {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.app-branding {
  display: flex;
  justify-content: space-between;
  align-items: center;

  >* {
    margin-inline: 4px;
  }
}

.app-navigation {
  display: flex;

  >.app-title {
    margin-inline-start: 4px;
    margin-inline-end: 16px;
  }

  >.app-tabs>* {
    margin-inline: 4px;
    background: none;
    border: 2px solid transparent;
    border-top: none;
    border-bottom: none;

    &:hover,
    &.active {
      border-left: 2px solid black;
      border-right: 2px solid black;
      background: lightgrey;

    }
  }

  >.app-user {
    margin-left: auto;
  }

}
</style>
