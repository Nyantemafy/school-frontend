<template>
    <div class="app-layout">
        <!-- Navbar -->
        <Navbar />
        
        <!-- Contenu principal -->
        <div class="main-content">
            <!-- Sidebar -->
            <Sidebar :class="{ 'show': sidebarOpen }" />
            
            <!-- Zone de contenu -->
            <div class="content-area" :class="{ 'with-sidebar': !isMobile, 'full-width': isMobile && !sidebarOpen }">
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
    isMobile.value = window.innerWidth < 992 // Bootstrap lg breakpoint pour plus de flexibilité
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
    background-color: #f8f9fa;
}

.main-content {
    display: flex;
    flex: 1;
    margin-top: 56px; /* Hauteur de la navbar */
    position: relative;
}

.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    transition: all 0.3s ease;
    min-height: calc(100vh - 56px);
    background-color: #f8f9fa;
}

.content-area.with-sidebar {
    margin-left: 260px; /* Largeur du sidebar légèrement augmentée */
    width: calc(100% - 260px);
}

.content-area.full-width {
    width: 100%;
    margin-left: 0;
}

/* Sidebar responsive */
@media (max-width: 991.98px) {
    .sidebar {
        position: fixed;
        left: -280px; /* Largeur augmentée pour tablette */
        top: 56px;
        z-index: 1040;
        height: calc(100vh - 56px);
        transition: left 0.3s ease;
        box-shadow: 2px 0 15px rgba(0, 0, 0, 0.15);
        width: 280px; /* Largeur fixe pour mobile/tablette */
    }
    
    .sidebar.show {
        left: 0;
    }
    
    .content-area {
        padding: 1.25rem 1.5rem;
        width: 100%;
    }
    
    .content-area.with-sidebar {
        margin-left: 0;
    }
}

/* Optimisation pour très petits écrans */
@media (max-width: 576px) {
    .content-area {
        padding: 1rem 1.25rem;
    }
}

/* Bouton toggle sidebar mobile */
.sidebar-toggle-btn {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 1050;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.25rem;
}

.sidebar-toggle-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

@media (min-width: 992px) {
    .sidebar-toggle-btn {
        display: none;
    }
}

/* Animation pour le contenu */
.content-area {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0.8;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>