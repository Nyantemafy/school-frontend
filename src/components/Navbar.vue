<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container-fluid">
        <!-- Logo et nom -->
        <a class="navbar-brand d-flex align-items-center" href="/">
            <span class="fs-3 me-2">🎓</span>
            <span class="fw-bold">École Gestion</span>
        </a>

        <!-- Toggle pour mobile -->
        <button 
            class="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Contenu navbar -->
        <div class="collapse navbar-collapse" id="navbarContent">
            <!-- Menu rapide (uniquement desktop) -->
            <ul class="navbar-nav ms-auto me-3 d-none d-lg-flex">
            <li class="nav-item">
                <router-link to="/" class="nav-link">
                <i class="bi bi-house-door"></i> Accueil
                </router-link>
            </li>
            
            <li class="nav-item" v-if="isAdmin || isTeacher">
                <router-link to="/students" class="nav-link">
                <i class="bi bi-people"></i> Étudiants
                </router-link>
            </li>
            
            <li class="nav-item">
                <router-link to="/schedule" class="nav-link">
                <i class="bi bi-calendar3"></i> Emploi du temps
                </router-link>
            </li>
            </ul>

            <!-- Profil utilisateur -->
            <div class="d-flex align-items-center text-white">
            <!-- Badge rôle -->
            <span :class="'badge me-2 ' + getRoleBadgeClass()">
                {{ getRoleLabel(user?.role) }}
            </span>

            <!-- Nom utilisateur -->
            <span class="me-3 d-none d-md-inline">
                <strong>{{ user?.name }}</strong>
            </span>

            <!-- Menu dropdown profil -->
            <div class="dropdown">
                <button 
                class="btn btn-light btn-sm dropdown-toggle" 
                type="button" 
                id="dropdownMenuButton" 
                data-bs-toggle="dropdown"
                >
                <i class="bi bi-person-circle"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <span class="dropdown-item-text">
                    <strong>{{ user?.name }}</strong><br>
                    <small class="text-muted">{{ user?.email }}</small>
                    </span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <router-link to="/" class="dropdown-item">
                    <i class="bi bi-speedometer2"></i> Dashboard
                    </router-link>
                </li>
                <li v-if="isStudent && user?.student">
                    <router-link :to="`/students/${user.student.id}/grades`" class="dropdown-item">
                    <i class="bi bi-graph-up"></i> Mes notes
                    </router-link>
                </li>
                <li v-if="isAdmin">
                    <router-link to="/admin/users" class="dropdown-item">
                    <i class="bi bi-gear"></i> Paramètres
                    </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <button class="dropdown-item text-danger" @click="handleLogout">
                    <i class="bi bi-box-arrow-right"></i> Déconnexion
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
        admin: 'bg-danger',
        teacher: 'bg-info',
        student: 'bg-success',
        parent: 'bg-warning'
    }
    return badges[role] || 'bg-secondary'
}

const getRoleLabel = (role) => {
    const labels = {
        admin: '👑 Admin',
        teacher: '👨‍🏫 Professeur',
        student: '🎓 Étudiant',
        parent: '👨‍👩‍👧 Parent'
    }
    return labels[role] || role
}
</script>

<style scoped>
.navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand {
    font-size: 1.5rem;
    transition: transform 0.2s;
}

.navbar-brand:hover {
    transform: scale(1.05);
}

.nav-link {
    color: rgba(255, 255, 255, 0.85) !important;
    transition: all 0.2s;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
}

.nav-link:hover {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
}

.dropdown-menu {
    min-width: 250px;
}

.dropdown-item {
    padding: 0.75rem 1rem;
}

.dropdown-item i {
    width: 20px;
    margin-right: 8px;
}

.badge {
    font-size: 0.75rem;
    padding: 0.35rem 0.65rem;
    font-weight: 600;
}
</style>