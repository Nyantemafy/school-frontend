<template>
    <div class="sidebar bg-light border-end vh-100 p-0">
        <!-- Header sidebar -->
        <div class="sidebar-header p-3 border-bottom">
        <h6 class="mb-0 text-muted fw-bold">NAVIGATION</h6>
        </div>

        <!-- Menu principal -->
        <div class="sidebar-menu">
        <ul class="nav flex-column">
            <!-- Dashboard -->
            <li class="nav-item">
            <router-link to="/" class="nav-link">
                <i class="bi bi-speedometer2"></i>
                <span>Dashboard</span>
            </router-link>
            </li>

            <!-- Séparateur Admin/Teacher -->
            <li v-if="isAdmin || isTeacher" class="nav-divider">
            <span>GESTION</span>
            </li>

            <!-- Étudiants (Admin & Teacher) -->
            <li class="nav-item" v-if="isAdmin || isTeacher">
            <router-link to="/students" class="nav-link">
                <i class="bi bi-people"></i>
                <span>Étudiants</span>
            </router-link>
            </li>

            <!-- Saisir Notes (Admin & Teacher) -->
            <li class="nav-item" v-if="isTeacher || isAdmin">
            <router-link to="/grades" class="nav-link">
                <i class="bi bi-pencil-square"></i>
                <span>Saisir Notes</span>
            </router-link>
            </li>

            <!-- Cours -->
            <li class="nav-divider">
            <span>ACADÉMIQUE</span>
            </li>

            <li class="nav-item">
            <router-link to="/courses" class="nav-link">
                <i class="bi bi-book"></i>
                <span>Cours</span>
            </router-link>
            </li>

            <!-- Emploi du temps -->
            <li class="nav-item">
            <router-link to="/schedule" class="nav-link">
                <i class="bi bi-calendar3"></i>
                <span>Emploi du temps</span>
            </router-link>
            </li>

            <!-- Mes Notes (Student) -->
            <li class="nav-item" v-if="isStudent && user?.student">
            <router-link :to="`/students/${user.student.id}/grades`" class="nav-link">
                <i class="bi bi-graph-up"></i>
                <span>Mes Notes</span>
                <span class="badge bg-primary ms-auto">
                {{ studentGradeCount }}
                </span>
            </router-link>
            </li>

            <!-- Séparateur Admin -->
            <li v-if="isAdmin" class="nav-divider mt-3">
            <span>ADMINISTRATION</span>
            </li>

            <!-- Gestion utilisateurs (Admin) -->
            <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin/users" class="nav-link">
                <i class="bi bi-person-gear"></i>
                <span>Utilisateurs</span>
            </router-link>
            </li>

            <!-- Rapports (Admin) -->
            <li class="nav-item" v-if="isAdmin">
            <router-link to="/reports" class="nav-link">
                <i class="bi bi-file-earmark-text"></i>
                <span>Rapports</span>
            </router-link>
            </li>
        </ul>
        </div>

        <!-- Footer sidebar -->
        <div class="sidebar-footer p-3 border-top mt-auto">
        <div class="d-flex align-items-center">
            <div class="flex-grow-1">
            <small class="text-muted d-block">Connecté en tant que</small>
            <strong class="d-block text-truncate">{{ user?.name }}</strong>
            </div>
            <div>
            <span :class="'badge ' + getRoleBadgeClass()">
                {{ getRoleIcon() }}
            </span>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

const isAdmin = computed(() => authStore.isAdmin)
const isTeacher = computed(() => authStore.isTeacher)
const isStudent = computed(() => authStore.isStudent)
const user = computed(() => authStore.user)

// Compter les notes pour l'étudiant
const studentGradeCount = ref(0)

onMounted(async () => {
    if (isStudent.value && user.value?.student) {
        try {
        const { data } = await api.getStudentGrades(user.value.student.id)
        studentGradeCount.value = data.length
        } catch (error) {
        console.error('Erreur comptage notes:', error)
        }
    }
})

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

const getRoleIcon = () => {
    const role = user.value?.role
    const icons = {
        admin: '👑',
        teacher: '👨‍🏫',
        student: '🎓',
        parent: '👨‍👩‍👧'
    }
    return icons[role] || '👤'
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 56px; /* Hauteur de la navbar */
    left: 0;
    width: 260px;
    height: calc(100vh - 56px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    background-color: #f8f9fa;
}

.sidebar-menu {
    flex: 1;
    overflow-y: auto;
}

.sidebar-footer {
    background-color: #f8f9fa;
}

.nav-link {
    color: #495057;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    font-size: 0.95rem;
}

.nav-link i {
    font-size: 1.2rem;
    width: 24px;
    margin-right: 12px;
}

.nav-link span {
    flex: 1;
}

.nav-link:hover {
    background-color: #e9ecef;
    color: #0d6efd;
    border-left-color: #0d6efd;
}

.nav-link.router-link-active {
    background-color: #e7f1ff;
    color: #0d6efd;
    font-weight: 600;
    border-left-color: #0d6efd;
}

.nav-link.router-link-active i {
    color: #0d6efd;
}

.nav-divider {
    padding: 1rem 1.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #6c757d;
    letter-spacing: 0.5px;
}

.nav-divider span {
    display: block;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.5rem;
}

/* Badge pour les notifications */
.nav-link .badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
}

/* Scrollbar personnalisée */
.sidebar-menu::-webkit-scrollbar {
    width: 6px;
}

.sidebar-menu::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.sidebar-menu::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: -260px;
        transition: left 0.3s;
        z-index: 1000;
    }

    .sidebar.show {
        left: 0;
    }
}
</style>