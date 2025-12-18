<template>
    <div class="app-layout">
        <!-- Navbar -->
        <Navbar />
        
        <!-- Contenu principal -->
        <div class="main-content">
            <!-- Sidebar -->
            <Sidebar :class="{ 'show': sidebarOpen }" />
            
            <!-- Zone de contenu -->
            <div class="content-area" :class="{ 'with-sidebar': !isMobile }">
                <router-view />
            </div>
        </div>
        
        <!-- Bouton toggle pour mobile -->
        <button v-if="isMobile" 
                class="sidebar-toggle-btn" 
                @click="toggleSidebar">
            <i class="bi" :class="sidebarOpen ? 'bi-x-lg' : 'bi-list'"></i>
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const sidebarOpen = ref(false)
const isMobile = ref(false)

// Vérifier si on est sur mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768 // Bootstrap md breakpoint
}

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

// Fermer sidebar en cliquant à l'extérieur (mobile)
const handleClickOutside = (event) => {
    const sidebar = document.querySelector('.sidebar')
    const toggleBtn = document.querySelector('.sidebar-toggle-btn')
    
    if (isMobile.value && 
        sidebar && 
        !sidebar.contains(event.target) && 
        !toggleBtn?.contains(event.target) && 
        sidebarOpen.value) {
        sidebarOpen.value = false
    }
}

// Fermer sidebar quand on change de page (mobile)
watch(() => route.path, () => {
    if (isMobile.value) {
        sidebarOpen.value = false
    }
})

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    display: flex;
    flex: 1;
    margin-top: 56px; /* Hauteur de la navbar */
}

.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.content-area.with-sidebar {
    margin-left: 250px; /* Largeur du sidebar */
}

/* Responsive - Mobile */
@media (max-width: 767.98px) {
    .sidebar {
        position: fixed;
        left: -250px;
        top: 56px;
        z-index: 1040;
        height: calc(100vh - 56px);
        transition: left 0.3s ease;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .sidebar.show {
        left: 0;
    }
    
    .content-area.with-sidebar {
        margin-left: 0;
        width: 100%;
    }
}

/* Bouton toggle sidebar mobile */
.sidebar-toggle-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1050;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.sidebar-toggle-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

@media (min-width: 768px) {
    .sidebar-toggle-btn {
        display: none;
    }
}
</style>