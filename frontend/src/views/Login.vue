<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const email = ref('')
const password = ref('')
const router = useRouter()

async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert(error.message)
  } else {
    router.push('/home')
  }
}
</script>

<template>
  <div class="login-page">
    <main class="login-card">
      <div class="logo-container">
        <img src="@/assets/Ramakrishna_Math-Logo.jpg" alt="Ramakrishna Math Logo" class="logo" />
      </div>

      <h1>Welcome Back</h1>
      <p class="subtitle">Sign in to continue</p>

      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email Address" />

        <input v-model="password" type="password" placeholder="Password" />
      </div>

      <button @click="signIn">
        Sign In
      </button>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background:
    radial-gradient(circle at top left, #ffb347, transparent 40%),
    radial-gradient(circle at bottom right, #ff7b00, transparent 40%),
    linear-gradient(135deg, #fff7f0, #ffe8d1);

  font-family: Inter, sans-serif;
}

.login-card {
  width: 380px;
  padding: 3rem;
  border-radius: 24px;

  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);

  box-shadow:
    0 15px 40px rgba(255, 123, 0, 0.15);

  text-align: center;
}

.logo-circle {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;

  border-radius: 50%;
  background: linear-gradient(135deg, #ffb347, #ff7b00);

  box-shadow: 0 8px 20px rgba(255, 123, 0, 0.3);
}

h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.subtitle {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  color: #777;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 1rem;
  border: 2px solid #ffd2ad;
  border-radius: 14px;

  font-size: 1rem;
  outline: none;

  transition: all 0.2s ease;
}

input:focus {
  border-color: #ff8c1a;
  box-shadow: 0 0 0 4px rgba(255, 140, 26, 0.15);
}

button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem;

  border: none;
  border-radius: 14px;

  background: linear-gradient(135deg,
      #ffb347,
      #ff7b00);

  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 123, 0, 0.35);
}

button:active {
  transform: translateY(0);
}
</style>