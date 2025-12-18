<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div class="container-fluid px-4">
            <!-- Logo et nom -->
            <a class="navbar-brand d-flex align-items-center" href="/">
                <div class="logo-container me-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L1 7L12 12L23 7L12 2Z" fill="#3B82F6"/>
                        <path d="M1 17L12 22L23 17" stroke="#3B82F6" stroke-width="2"/>
                        <path d="M1 12L12 17L23 12" stroke="#3B82F6" stroke-width="2"/>
                    </svg>
                </div>
                <div class="d-flex flex-column">
                    <span class="fw-bold fs-5 text-dark">ÉcoleSupérieure</span>
                    <span class="text-muted fs-7">Gestion académique</span>
                </div>
            </a>

            <!-- Toggle pour mobile -->
            <button 
                class="navbar-toggler border-0" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarContent"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Contenu navbar -->
            <div class="collapse navbar-collapse" id="navbarContent">
                <!-- Navigation principale -->
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item mx-1">
                        <router-link to="/" class="nav-link d-flex align-items-center px-3">
                            <div class="nav-icon me-2">
                                <i class="bi bi-house"></i>
                            </div>
                            <span>Accueil</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mx-1" v-if="isAdmin || isTeacher">
                        <router-link to="/students" class="nav-link d-flex align-items-center px-3">
                            <div class="nav-icon me-2">
                                <i class="bi bi-people"></i>
                            </div>
                            <span>Étudiants</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mx-1">
                        <router-link to="/schedule" class="nav-link d-flex align-items-center px-3">
                            <div class="nav-icon me-2">
                                <i class="bi bi-calendar-week"></i>
                            </div>
                            <span>Emploi du temps</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mx-1" v-if="isAdmin || isTeacher">
                        <router-link to="/courses" class="nav-link d-flex align-items-center px-3">
                            <div class="nav-icon me-2">
                                <i class="bi bi-journal-text"></i>
                            </div>
                            <span>Cours</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mx-1" v-if="isAdmin">
                        <router-link to="/reports" class="nav-link d-flex align-items-center px-3">
                            <div class="nav-icon me-2">
                                <i class="bi bi-bar-chart"></i>
                            </div>
                            <span>Rapports</span>
                        </router-link>
                    </li>
                </ul>

                <!-- Section utilisateur -->
                <div class="d-flex align-items-center">
                    <!-- Notifications -->
                    <div class="dropdown me-3">
                        <button class="btn btn-outline-secondary btn-sm rounded-circle p-2" type="button">
                            <i class="bi bi-bell"></i>
                        </button>
                    </div>

                    <!-- Profil utilisateur -->
                    <div class="dropdown">
                        <button 
                            class="btn border-0 p-0 d-flex align-items-center bg-transparent dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <div class="user-avatar d-flex align-items-center justify-content-center rounded-circle me-2"
                                :class="getAvatarClass()">
                                {{ getAvatarInitials() }}
                            </div>
                            <div class="d-none d-md-flex flex-column align-items-start me-2">
                                <span class="fw-medium text-dark">{{ user?.name }}</span>
                                <small class="text-muted">{{ getRoleLabel(user?.role) }}</small>
                            </div>
                            <i class="bi bi-chevron-down text-muted"></i>
                        </button>
                        
                        <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2" style="min-width: 280px">
                            <!-- En-tête profil -->
                            <li class="px-3 py-4 bg-light rounded-top">
                                <div class="d-flex align-items-center">
                                    <div class="user-avatar-lg d-flex align-items-center justify-content-center rounded-circle me-3"
                                        :class="getAvatarClass()">
                                        {{ getAvatarInitials() }}
                                    </div>
                                    <div>
                                        <h6 class="mb-1 fw-semibold">{{ user?.name }}</h6>
                                        <p class="text-muted mb-1 small">{{ user?.email }}</p>
                                        <span :class="'badge ' + getRoleBadgeClass()">
                                            {{ getRoleLabel(user?.role) }}
                                        </span>
                                    </div>
                                </div>
                            </li>
                            
                            <li><hr class="dropdown-divider my-2"></li>
                            
                            <!-- Menu navigation -->
                            <li>
                                <router-link to="/profile" class="dropdown-item py-3">
                                    <i class="bi bi-person me-3 text-primary"></i>
                                    <span>Mon profil</span>
                                </router-link>
                            </li>
                            
                            <li v-if="isStudent && user?.student">
                                <router-link :to="`/students/${user.student.id}/grades`" class="dropdown-item py-3">
                                    <i class="bi bi-graph-up me-3 text-primary"></i>
                                    <span>Mes notes</span>
                                </router-link>
                            </li>
                            
                            <li v-if="isAdmin || isTeacher">
                                <router-link to="/dashboard" class="dropdown-item py-3">
                                    <i class="bi bi-speedometer2 me-3 text-primary"></i>
                                    <span>Tableau de bord</span>
                                </router-link>
                            </li>
                            
                            <li v-if="isAdmin">
                                <router-link to="/admin/settings" class="dropdown-item py-3">
                                    <i class="bi bi-gear me-3 text-primary"></i>
                                    <span>Administration</span>
                                </router-link>
                            </li>
                            
                            <li><hr class="dropdown-divider my-2"></li>
                            
                            <!-- Déconnexion -->
                            <li>
                                <button class="dropdown-item py-3 text-danger" @click="handleLogout">
                                    <i class="bi bi-box-arrow-right me-3"></i>
                                    <span>Se déconnecter</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)
const isTeacher = computed(() => authStore.isTeacher)
const isStudent = computed(() => authStore.isStudent)

const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        await authStore.logout()
        router.push('/login')
    }
}

const getRoleBadgeClass = () => {
    const role = user.value?.role
    const badges = {
        admin: 'bg-gradient-primary text-white',
        teacher: 'bg-gradient-info text-white',
        student: 'bg-gradient-success text-white',
        parent: 'bg-gradient-warning text-dark'
    }
    return badges[role] || 'bg-secondary text-white'
}

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Administrateur',
        teacher: 'Professeur',
        student: 'Étudiant',
        parent: 'Parent'
    }
    return labels[role] || role
}

const getAvatarClass = () => {
    const role = user.value?.role
    const classes = {
        admin: 'bg-primary bg-opacity-10 text-primary',
        teacher: 'bg-info bg-opacity-10 text-info',
        student: 'bg-success bg-opacity-10 text-success',
        parent: 'bg-warning bg-opacity-10 text-warning'
    }
    return classes[role] || 'bg-secondary bg-opacity-10 text-secondary'
}

const getAvatarInitials = () => {
    if (!user.value?.name) return '?'
    return user.value.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
}
</script>

<style scoped>
.navbar {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.98);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1030;
    height: 56px;
}

.logo-container {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border-radius: 8px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-link {
    color: #4B5563 !important;
    font-weight: 500;
    transition: all 0.2s ease;
    border-radius: 6px;
    margin: 0 2px;
}

.nav-link:hover {
    color: #111827 !important;
    background-color: #F3F4F6;
}

.nav-link.router-link-active {
    color: #3B82F6 !important;
    background-color: #EFF6FF;
    font-weight: 600;
}

.nav-icon {
    width: 20px;
    text-align: center;
    font-size: 1.1rem;
}

.user-avatar {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
    font-weight: 600;
}

.user-avatar-lg {
    width: 48px;
    height: 48px;
    font-size: 1.125rem;
    font-weight: 600;
}

.dropdown-menu {
    border: 1px solid #E5E7EB;
}

.dropdown-item {
    transition: all 0.2s ease;
    color: #374151;
}

.dropdown-item:hover {
    background-color: #F3F4F6;
    color: #111827;
}

.dropdown-item:active {
    background-color: #E5E7EB;
}

.badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.75rem;
    font-weight: 500;
    border-radius: 12px;
}

.bg-gradient-primary {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
}

.bg-gradient-info {
    background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%);
}

.bg-gradient-success {
    background: linear-gradient(135deg, #10B981 0%, #047857 100%);
}

.bg-gradient-warning {
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}

.fs-7 {
    font-size: 0.875rem;
}

.btn-outline-secondary {
    border-color: #E5E7EB;
    color: #6B7280;
}

.btn-outline-secondary:hover {
    background-color: #F9FAFB;
    border-color: #D1D5DB;
    color: #374151;
}

.dropdown-toggle::after {
    display: none;
}

.dropdown-menu {
    margin-top: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border-radius: 0.5rem;
}

.dropdown-item {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
}

.dropdown-divider {
    margin: 0.5rem 0;
}
</style>