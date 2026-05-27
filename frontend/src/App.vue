<script setup lang="ts">
  // @ts-nocheck
  import { ref, onMounted } from 'vue'
  import { supabase } from './lib/supabase'

  const email = ref('')
  const password = ref('')
  const user = ref(null)

  const items = ref([])
  const newItem = ref('')

  onMounted(async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (user.value) loadItems()
      else items.value = []
    })

    if (user.value) loadItems()
  })

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) alert(error.message)
    else alert('Check your email to confirm signup')
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) alert(error.message)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function loadItems() {
    const { data, error } = await supabase
      .from('Events')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    items.value = data
  }

  onMounted(loadItems)
</script>

<template>
  <main>
    <section v-if="!user">
      <h2>Login</h2>

      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="signIn">Sign in</button>
      <button @click="signUp">Sign up</button>
    </section>

    <section v-else>
      <h2>Hello, {{ user.email }}</h2>
      <button @click="signOut">Sign out</button>

      <hr />

      <input v-model="newItem" placeholder="New item" />
      <button @click="addItem">Add</button>

      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped></style>
