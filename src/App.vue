<template>
  <div id="app">
    <!-- Layout pour les pages authentifiées -->
    <Layout v-if="isAuthenticated" />
    
    <!-- Pages sans layout (login, etc.) -->
    <div v-else class="auth-pages">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Layout from './components/Layout.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUser()
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}

.auth-pages {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>