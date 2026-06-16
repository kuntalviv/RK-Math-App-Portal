//@ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Notifications from '@/views/Notifications.vue'

const routes = [
  { path: '/', redirect: '/home' },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🔒 AUTH GUARD
router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  const requiresAuth = to.meta.requiresAuth

  // not logged in → block protected pages
  if (requiresAuth && !user) {
    return '/login'
  }

  // logged in → block login page
  if (to.path === '/login' && user) {
    return '/home'
  }

  return true;
})

export default router
