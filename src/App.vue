<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <div class="container-fluid">
      <div class="row">
        <Sidebar v-if="isAuthenticated" class="col-md-2" />
        <main :class="isAuthenticated ? 'col-md-10' : 'col-12'">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUser()
  }
})
</script>