<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
const email = ref('')
const password = ref('')
const router = useRouter();
async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert(error.message);
  } else {
    router.push('/home');
  }
}
</script>

<template>
  <main class="card">
    <h2>Login</h2>

    <div class="form">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
    </div>

    <button @click="signIn">Sign in</button>
  </main>
</template>
