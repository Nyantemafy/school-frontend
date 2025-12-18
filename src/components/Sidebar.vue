<template>
    <div class="sidebar bg-white border-right vh-100 p-0 d-flex flex-column">
        <!-- Header sidebar -->
        <div class="sidebar-header px-4 py-3 border-bottom">
            <div class="d-flex align-items-center">
                <div class="logo-container me-3">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L1 7L12 12L23 7L12 2Z" fill="#3B82F6"/>
                        <path d="M1 17L12 22L23 17" stroke="#3B82F6" stroke-width="2"/>
                        <path d="M1 12L12 17L23 12" stroke="#3B82F6" stroke-width="2"/>
                    </svg>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-0 text-gray-600 fw-semibold text-uppercase letter-spacing-1">Navigation</h6>
                    <small class="text-muted">Système académique</small>
                </div>
            </div>
        </div>

        <!-- Menu principal -->
        <div class="sidebar-menu flex-grow-1 p-3 overflow-auto">
            <!-- Section principale -->
            <div class="mb-5">
                <div class="mb-3">
                    <router-link to="/" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                        <div class="menu-icon">
                            <i class="bi bi-house-door-fill"></i>
                        </div>
                        <span class="menu-label">Tableau de bord</span>
                        <div class="menu-badge ms-auto">
                            <span class="badge bg-primary-subtle text-primary">Nouveau</span>
                        </div>
                    </router-link>
                </div>
            </div>

            <!-- Gestion académique -->
            <div class="mb-5">
                <div class="section-title mb-3">
                    <span class="text-uppercase text-muted fw-semibold small letter-spacing-1">Gestion</span>
                </div>
                
                <ul class="nav flex-column">
                    <li class="nav-item mb-2">
                        <router-link to="/students" class="menu-item d-flex align-items-center px-3 py-2 rounded" v-if="isAdmin || isTeacher">
                            <div class="menu-icon">
                                <i class="bi bi-people-fill"></i>
                            </div>
                            <span class="menu-label">Étudiants</span>
                            <div class="menu-badge ms-auto">
                                <span class="count-badge">{{ studentCount }}</span>
                            </div>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mb-2">
                        <router-link to="/courses" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-journal-text"></i>
                            </div>
                            <span class="menu-label">Cours</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mb-2">
                        <router-link to="/schedule" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-calendar-week"></i>
                            </div>
                            <span class="menu-label">Emploi du temps</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mb-2" v-if="isTeacher || isAdmin">
                        <router-link to="/grades" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-clipboard-data-fill"></i>
                            </div>
                            <span class="menu-label">Évaluations</span>
                            <div class="menu-badge ms-auto">
                                <i class="bi bi-arrow-right-short text-muted"></i>
                            </div>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mb-2" v-if="isStudent && user?.student">
                        <router-link :to="`/students/${user.student.id}/grades`" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-graph-up-arrow"></i>
                            </div>
                            <span class="menu-label">Mes résultats</span>
                            <div class="menu-badge ms-auto">
                                <span class="badge bg-success-subtle text-success" v-if="studentGradeCount > 0">
                                    {{ studentGradeCount }}
                                </span>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Administration -->
            <div class="mb-5" v-if="isAdmin">
                <div class="section-title mb-3">
                    <span class="text-uppercase text-muted fw-semibold small letter-spacing-1">Administration</span>
                </div>
                
                <ul class="nav flex-column">
                    <li class="nav-item mb-2">
                        <router-link to="/admin/users" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-person-badge-fill"></i>
                            </div>
                            <span class="menu-label">Utilisateurs</span>
                            <div class="menu-badge ms-auto">
                                <span class="badge bg-info-subtle text-info">{{ userCount }}</span>
                            </div>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mb-2">
                        <router-link to="/reports" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-file-earmark-bar-graph-fill"></i>
                            </div>
                            <span class="menu-label">Analytiques</span>
                        </router-link>
                    </li>
                    
                    <li class="nav-item mb-2">
                        <router-link to="/admin/settings" class="menu-item d-flex align-items-center px-3 py-2 rounded">
                            <div class="menu-icon">
                                <i class="bi bi-gear-fill"></i>
                            </div>
                            <span class="menu-label">Paramètres</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Outils rapides -->
            <div class="mb-4">
                <div class="section-title mb-3">
                    <span class="text-uppercase text-muted fw-semibold small letter-spacing-1">Outils</span>
                </div>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center py-2" v-if="isTeacher || isAdmin">
                        <i class="bi bi-plus-circle me-2"></i>
                        <span>Nouveau cours</span>
                    </button>
                    
                    <button class="btn btn-outline-success btn-sm d-flex align-items-center justify-content-center py-2" v-if="isAdmin">
                        <i class="bi bi-file-earmark-plus me-2"></i>
                        <span>Générer rapport</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Footer sidebar -->
        <div class="sidebar-footer border-top">
            <div class="user-profile p-4">
                <div class="d-flex align-items-center">
                    <div class="avatar-container me-3">
                        <div class="user-avatar d-flex align-items-center justify-content-center rounded-circle"
                            :class="getAvatarClass()">
                            {{ getAvatarInitials() }}
                        </div>
                    </div>
                    <div class="user-info flex-grow-1">
                        <h6 class="mb-1 fw-semibold text-dark">{{ user?.name }}</h6>
                        <div class="d-flex align-items-center">
                            <span :class="'badge px-2 py-1 me-2 ' + getRoleBadgeClass()">
                                {{ getRoleLabel(user?.role) }}
                            </span>
                            <small class="text-muted">{{ getTimeOfDay() }}</small>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <router-link to="/profile" class="dropdown-item">
                                    <i class="bi bi-person me-2"></i>
                                    Mon profil
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/settings" class="dropdown-item">
                                    <i class="bi bi-gear me-2"></i>
                                    Préférences
                                </router-link>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <button class="dropdown-item text-danger" @click="handleLogout">
                                    <i class="bi bi-box-arrow-right me-2"></i>
                                    Déconnexion
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Statut système -->
            <div class="system-status px-4 pb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Système</small>
                    <div class="d-flex align-items-center">
                        <span class="status-indicator bg-success me-2"></span>
                        <small class="text-success fw-medium">Opérationnel</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import api from '../services/api'

const authStore = useAuthStore()
const router = useRouter()

const isAdmin = computed(() => authStore.isAdmin)
const isTeacher = computed(() => authStore.isTeacher)
const isStudent = computed(() => authStore.isStudent)
const user = computed(() => authStore.user)

// Stats
const studentGradeCount = ref(0)
const studentCount = ref(0)
const userCount = ref(0)

onMounted(async () => {
    // Charger les stats
    if (isStudent.value && user.value?.student) {
        try {
            const { data } = await api.getStudentGrades(user.value.student.id)
            studentGradeCount.value = data.length
        } catch (error) {
            console.error('Erreur chargement notes:', error)
        }
    }
    
    if (isAdmin.value || isTeacher.value) {
        try {
            const { data } = await api.getStudents({ limit: 1 })
            studentCount.value = data.total || 0
        } catch (error) {
            console.error('Erreur chargement étudiants:', error)
        }
    }
    
    if (isAdmin.value) {
        try {
            const { data } = await api.getUsers({ limit: 1 })
            userCount.value = data.total || 0
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error)
        }
    }
})

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

const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonne matinée'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonne soirée'
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    z-index: 100;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
}

.logo-container {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border-radius: 8px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.section-title {
    position: relative;
    padding-left: 12px;
}

.section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    background: linear-gradient(to bottom, #3B82F6, #1D4ED8);
    border-radius: 2px;
}

.menu-item {
    color: #4B5563;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.menu-item:hover {
    background-color: #F3F4F6;
    color: #111827;
    border-color: #E5E7EB;
}

.menu-item.router-link-active {
    background-color: #EFF6FF;
    color: #1D4ED8;
    border-color: #3B82F6;
    font-weight: 500;
}

.menu-icon {
    width: 20px;
    text-align: center;
    margin-right: 12px;
    color: #6B7280;
    font-size: 1.1rem;
}

.menu-item.router-link-active .menu-icon {
    color: #3B82F6;
}

.menu-label {
    flex: 1;
    font-size: 0.95rem;
}

.count-badge {
    display: inline-block;
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #E5E7EB;
    color: #374151;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0 6px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
    font-weight: 600;
}

.status-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
}

.letter-spacing-1 {
    letter-spacing: 0.5px;
}

/* Scrollbar personnalisée */
.sidebar-menu::-webkit-scrollbar {
    width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
    background: #f8fafc;
}

.sidebar-menu::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Badges gradient */
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

/* Badges subtils */
.bg-primary-subtle {
    background-color: #EFF6FF;
    color: #1D4ED8;
}

.bg-success-subtle {
    background-color: #D1FAE5;
    color: #047857;
}

.bg-info-subtle {
    background-color: #E0F2FE;
    color: #0369A1;
}

/* Boutons */
.btn-outline-primary, .btn-outline-success {
    border: 1px solid #E5E7EB;
    font-size: 0.875rem;
}

.btn-outline-primary:hover {
    background-color: #EFF6FF;
    border-color: #3B82F6;
}

.btn-outline-success:hover {
    background-color: #D1FAE5;
    border-color: #10B981;
}

/* Responsive */
@media (max-width: 992px) {
    .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        width: 250px;
    height: calc(100vh - 56px);
    overflow-y: auto;
    background: white;
    border-right: 1px solid #e5e7eb;
    }
    
    .sidebar.show {
        transform: translateX(0);
    }
}
</style>