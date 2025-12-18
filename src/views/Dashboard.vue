<template>
    <div class="dashboard-container p-4">
        <!-- En-tête -->
        <div class="dashboard-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">Tableau de bord</h1>
                    <p class="text-muted mb-0">
                        <i class="bi bi-calendar3 me-2"></i>
                        {{ formatDate(new Date()) }}
                    </p>
                </div>
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <span class="badge bg-light text-dark border d-flex align-items-center">
                            <i class="bi bi-person-circle me-2"></i>
                            {{ getRoleLabel(user?.role) }}
                        </span>
                    </div>
                    <button class="btn btn-light border d-flex align-items-center">
                        <i class="bi bi-download me-2"></i>
                        Exporter
                    </button>
                </div>
            </div>
        </div>

        <!-- Dashboard Admin -->
        <div v-if="isAdmin" class="admin-dashboard">
            <!-- Métriques principales -->
            <div class="row g-4 mb-6">
                <div class="col-xl-3 col-md-6">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-primary bg-opacity-10 text-primary rounded-2 p-3 me-3">
                                <i class="bi bi-people-fill fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Étudiants</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(stats.totalStudents) }}</h2>
                            </div>
                        </div>
                        <div class="metric-trend mt-3">
                            <span class="text-success small">
                                <i class="bi bi-arrow-up-short"></i>
                                12% vs mois dernier
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-success bg-opacity-10 text-success rounded-2 p-3 me-3">
                                <i class="bi bi-person-badge-fill fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Enseignants</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(stats.totalTeachers) }}</h2>
                            </div>
                        </div>
                        <div class="metric-trend mt-3">
                            <span class="text-success small">
                                <i class="bi bi-arrow-up-short"></i>
                                5% vs mois dernier
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-info bg-opacity-10 text-info rounded-2 p-3 me-3">
                                <i class="bi bi-journal-text fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Cours actifs</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(stats.totalCourses) }}</h2>
                            </div>
                        </div>
                        <div class="metric-trend mt-3">
                            <span class="text-success small">
                                <i class="bi bi-arrow-up-short"></i>
                                8% vs mois dernier
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-warning bg-opacity-10 text-warning rounded-2 p-3 me-3">
                                <i class="bi bi-building fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Classes</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(stats.totalClasses) }}</h2>
                            </div>
                        </div>
                        <div class="metric-trend mt-3">
                            <span class="text-secondary small">
                                <i class="bi bi-dash"></i>
                                Stable
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphiques et données -->
            <div class="row g-4 mb-6">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0 fw-semibold">Répartition par classe</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="classStats.length > 0" class="chart-container">
                                <div v-for="cls in classStats" :key="cls.class" class="mb-4">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <div class="color-indicator me-3" :style="{backgroundColor: getClassColor(cls.class)}"></div>
                                            <span class="fw-medium">{{ cls.class }}</span>
                                        </div>
                                        <div>
                                            <span class="badge bg-light text-dark">{{ cls.count }} étudiants</span>
                                            <span class="text-muted ms-2 small">{{ getPercentage(cls.count) }}%</span>
                                        </div>
                                    </div>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar rounded" 
                                             :style="{width: getPercentage(cls.count) + '%', backgroundColor: getClassColor(cls.class)}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-5">
                                <div class="text-muted mb-3">
                                    <i class="bi bi-bar-chart fs-1"></i>
                                </div>
                                <p class="text-muted">Aucune donnée disponible</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0 fw-semibold">Actions rapides</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-grid gap-3">
                                <router-link to="/students/create" class="btn btn-primary d-flex align-items-center justify-content-center py-3">
                                    <i class="bi bi-person-plus me-3"></i>
                                    <span>Ajouter un étudiant</span>
                                </router-link>
                                <router-link to="/courses/create" class="btn btn-outline-primary d-flex align-items-center justify-content-center py-3">
                                    <i class="bi bi-plus-circle me-3"></i>
                                    <span>Créer un cours</span>
                                </router-link>
                                <router-link to="/reports" class="btn btn-outline-success d-flex align-items-center justify-content-center py-3">
                                    <i class="bi bi-file-earmark-bar-graph me-3"></i>
                                    <span>Générer rapport</span>
                                </router-link>
                                <router-link to="/schedule" class="btn btn-outline-info d-flex align-items-center justify-content-center py-3">
                                    <i class="bi bi-calendar-week me-3"></i>
                                    <span>Voir emplois du temps</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dashboard Professeur -->
        <div v-else-if="isTeacher" class="teacher-dashboard">
            <!-- Métriques -->
            <div class="row g-4 mb-6">
                <div class="col-md-4">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-primary bg-opacity-10 text-primary rounded-2 p-3 me-3">
                                <i class="bi bi-journal-text fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Cours assignés</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(teacherStats.myCourses) }}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-success bg-opacity-10 text-success rounded-2 p-3 me-3">
                                <i class="bi bi-people-fill fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Étudiants</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(teacherStats.myStudents) }}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="metric-icon bg-info bg-opacity-10 text-info rounded-2 p-3 me-3">
                                <i class="bi bi-clipboard-data fs-4"></i>
                            </div>
                            <div>
                                <p class="text-muted mb-1">Évaluations</p>
                                <h2 class="mb-0 fw-bold">{{ formatNumber(teacherStats.gradesEntered) }}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="row">
                <div class="col-md-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0 fw-semibold">Gestion des cours</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="action-card border rounded-3 p-4 text-center h-100">
                                        <div class="action-icon mb-3">
                                            <i class="bi bi-clipboard-plus fs-2 text-primary"></i>
                                        </div>
                                        <h6 class="fw-semibold mb-2">Saisir notes</h6>
                                        <p class="text-muted small mb-3">Enregistrer les résultats d'évaluation</p>
                                        <router-link to="/grades" class="btn btn-primary w-100">Accéder</router-link>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="action-card border rounded-3 p-4 text-center h-100">
                                        <div class="action-icon mb-3">
                                            <i class="bi bi-people fs-2 text-success"></i>
                                        </div>
                                        <h6 class="fw-semibold mb-2">Liste étudiants</h6>
                                        <p class="text-muted small mb-3">Consulter vos étudiants</p>
                                        <router-link to="/students" class="btn btn-outline-success w-100">Voir</router-link>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="action-card border rounded-3 p-4 text-center h-100">
                                        <div class="action-icon mb-3">
                                            <i class="bi bi-calendar-week fs-2 text-info"></i>
                                        </div>
                                        <h6 class="fw-semibold mb-2">Emploi du temps</h6>
                                        <p class="text-muted small mb-3">Planifier vos cours</p>
                                        <router-link to="/schedule" class="btn btn-outline-info w-100">Planifier</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dashboard Étudiant -->
        <div v-else-if="isStudent" class="student-dashboard">
            <div class="row g-4 mb-6">
                <!-- Info perso -->
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0 fw-semibold">Informations académiques</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="info-item mb-4">
                                        <p class="text-muted mb-1">Classe</p>
                                        <h4 class="fw-bold">{{ studentInfo.class || 'Non assigné' }}</h4>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="info-item mb-4">
                                        <p class="text-muted mb-1">Matricule</p>
                                        <h4 class="fw-bold text-mono">{{ studentInfo.matricule || 'N/A' }}</h4>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="info-item mb-4">
                                        <p class="text-muted mb-1">Année académique</p>
                                        <h4 class="fw-bold">2024-2025</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Performance -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center py-5">
                            <div v-if="studentAverage !== null" class="text-center">
                                <div class="performance-circle mb-4">
                                    <div class="position-relative">
                                        <svg width="120" height="120" class="circular-chart">
                                            <circle class="circle-bg" cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" stroke-width="8"/>
                                            <circle class="circle" cx="60" cy="60" r="54" fill="none" 
                                                    :stroke="getAverageColor(studentAverage, true)" stroke-width="8" 
                                                    :stroke-dasharray="`${(studentAverage / 20) * 340} 340`" stroke-linecap="round"/>
                                        </svg>
                                        <div class="position-absolute top-50 start-50 translate-middle text-center">
                                            <h1 class="mb-0 fw-bold" :class="getAverageColor(studentAverage)">
                                                {{ studentAverage.toFixed(1) }}
                                            </h1>
                                            <small class="text-muted">/20</small>
                                        </div>
                                    </div>
                                </div>
                                <p class="fw-medium mb-0" :class="getAverageColor(studentAverage)">
                                    <i class="bi bi-star-fill me-2"></i>
                                    {{ getAverageLabel(studentAverage) }}
                                </p>
                            </div>
                            <div v-else-if="loadingAverage" class="text-center py-4">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="mt-2 text-muted">Chargement des résultats...</p>
                            </div>
                            <div v-else class="text-center py-4">
                                <div class="text-muted mb-3">
                                    <i class="bi bi-graph-up fs-1"></i>
                                </div>
                                <p class="text-muted">Aucune note disponible</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dernières notes -->
            <div class="row" v-if="recentGrades.length > 0">
                <div class="col-md-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 py-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0 fw-semibold">Dernières évaluations</h5>
                                <router-link :to="`/students/${studentInfo.id}/grades`" class="btn btn-sm btn-outline-primary">
                                    Voir tout <i class="bi bi-arrow-right ms-1"></i>
                                </router-link>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="border-0 ps-4">Matière</th>
                                            <th class="border-0">Type d'évaluation</th>
                                            <th class="border-0">Note</th>
                                            <th class="border-0">Date</th>
                                            <th class="border-0 pe-4">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="grade in recentGrades" :key="grade.id">
                                            <td class="ps-4">
                                                <div class="d-flex align-items-center">
                                                    <div class="subject-icon bg-light rounded-2 p-2 me-3">
                                                        <i class="bi bi-journal-text text-primary"></i>
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-0 fw-medium">{{ grade.course?.name || 'N/A' }}</h6>
                                                        <small class="text-muted">{{ grade.course?.code || '' }}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge bg-light text-dark">
                                                    {{ grade.exam_type }}
                                                </span>
                                            </td>
                                            <td>
                                                <span :class="'badge ' + getGradeBadgeClass(grade.grade)">
                                                    {{ Number(grade.grade || 0).toFixed(1) }}/20
                                                </span>
                                            </td>
                                            <td>
                                                <span class="text-muted">{{ formatDate(grade.exam_date) }}</span>
                                            </td>
                                            <td class="pe-4">
                                                <span class="status-indicator" :class="getGradeStatus(grade.grade)"></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

// Computed properties
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)
const isTeacher = computed(() => authStore.isTeacher)
const isStudent = computed(() => authStore.isStudent)

// Stats Admin
const stats = ref({
    totalStudents: 1256,
    totalTeachers: 48,
    totalCourses: 156,
    totalClasses: 32
})

const classStats = ref([])

// Stats Professeur
const teacherStats = ref({
    myCourses: 0,
    myStudents: 0,
    gradesEntered: 0
})

// Info Étudiant
const studentInfo = ref({
    id: null,
    class: null,
    matricule: null
})

const studentAverage = ref(null)
const loadingAverage = ref(false)
const recentGrades = ref([])

// Fonctions utilitaires
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num)
}

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Administrateur',
        teacher: 'Enseignant',
        student: 'Étudiant',
        parent: 'Parent'
    }
    return labels[role] || role
}

const getPercentage = (count) => {
    if (stats.value.totalStudents === 0) return 0
    return Math.round((count / stats.value.totalStudents) * 100)
}

const getClassColor = (className) => {
    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ]
    const index = className?.charCodeAt(0) % colors.length || 0
    return colors[index]
}

const getAverageColor = (average, forStroke = false) => {
    if (average >= 16) return forStroke ? '#10B981' : 'text-success'
    if (average >= 14) return forStroke ? '#0EA5E9' : 'text-info'
    if (average >= 10) return forStroke ? '#F59E0B' : 'text-warning'
    return forStroke ? '#EF4444' : 'text-danger'
}

const getAverageLabel = (average) => {
    if (average >= 16) return 'Excellent'
    if (average >= 14) return 'Très bien'
    if (average >= 12) return 'Bien'
    if (average >= 10) return 'Satisfaisant'
    return 'À améliorer'
}

const getGradeBadgeClass = (grade) => {
    if (grade >= 16) return 'bg-success text-white'
    if (grade >= 14) return 'bg-info text-white'
    if (grade >= 10) return 'bg-warning text-dark'
    return 'bg-danger text-white'
}

const getGradeStatus = (grade) => {
    if (grade >= 10) return 'bg-success'
    return 'bg-danger'
}

// Fonctions de chargement des données
const loadAdminStats = async () => {
    try {
        const [studentsRes, teachersRes, coursesRes] = await Promise.all([
            api.getStudents(),
            api.getTeachers(),
            api.getCourses()
        ])

        stats.value.totalStudents = studentsRes.data.length
        stats.value.totalTeachers = teachersRes.data.length
        stats.value.totalCourses = coursesRes.data.length

        // Calculer les stats par classe
        const classCounts = {}
        studentsRes.data.forEach(student => {
            const cls = student.class
            classCounts[cls] = (classCounts[cls] || 0) + 1
        })

        classStats.value = Object.entries(classCounts).map(([cls, count]) => ({
            class: cls,
            count: count
        })).sort((a, b) => b.count - a.count).slice(0, 8)

        stats.value.totalClasses = Object.keys(classCounts).length

    } catch (error) {
        console.error('Erreur lors du chargement des stats admin:', error)
    }
}

const loadTeacherStats = async () => {
    try {
        const coursesRes = await api.getCourses()
        const teacherId = user.value.teacher?.id
        
        const myCourses = coursesRes.data.filter(c => c.teacher_id === teacherId)
        teacherStats.value.myCourses = myCourses.length
        
        // Compter les étudiants
        const uniqueStudents = new Set()
        myCourses.forEach(course => {
            course.students?.forEach(student => {
                uniqueStudents.add(student.id)
            })
        })
        
        teacherStats.value.myStudents = uniqueStudents.size

        // Compter les notes saisies
        const gradesRes = await api.getGrades({ teacher_id: teacherId })
        teacherStats.value.gradesEntered = gradesRes.data.length

    } catch (error) {
        console.error('Erreur lors du chargement des stats professeur:', error)
    }
}

const loadStudentInfo = async () => {
    try {
        if (user.value.student) {
            studentInfo.value = {
                id: user.value.student.id,
                class: user.value.student.class,
                matricule: user.value.student.matricule
            }

            loadingAverage.value = true
            const avgRes = await api.getStudentAverage(user.value.student.id)
            studentAverage.value = avgRes.data.average

            const gradesRes = await api.getStudentGrades(user.value.student.id)
            recentGrades.value = gradesRes.data.slice(0, 6)

            loadingAverage.value = false
        }
    } catch (error) {
        console.error('Erreur lors du chargement des infos étudiant:', error)
        loadingAverage.value = false
    }
}

// Lifecycle
onMounted(async () => {
    if (isAdmin.value) {
        await loadAdminStats()
    } else if (isTeacher.value) {
        await loadTeacherStats()
    } else if (isStudent.value) {
        await loadStudentInfo()
    }
})
</script>

<style scoped>
.dashboard-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.dashboard-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.metric-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.metric-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-indicator {
    width: 16px;
    height: 16px;
    border-radius: 4px;
}

.action-card {
    transition: all 0.2s ease;
    border: 1px solid #e5e7eb;
}

.action-card:hover {
    border-color: #3B82F6;
    transform: translateY(-4px);
}

.action-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(59, 130, 246, 0.1);
    border-radius: 12px;
}

.text-mono {
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    letter-spacing: 0.5px;
}

.circular-chart {
    display: block;
}

.circle-bg {
    fill: none;
}

.circle {
    fill: none;
    transition: stroke-dasharray 0.8s ease;
}

.performance-circle {
    position: relative;
}

.progress {
    background-color: #f1f5f9;
}

.progress-bar {
    border-radius: 4px;
}

.table th {
    font-weight: 600;
    color: #6b7280;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.subject-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.info-item {
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8fafc;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.admin-dashboard,
.teacher-dashboard,
.student-dashboard {
    animation: fadeInUp 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .dashboard-header .d-flex {
        width: 100%;
        justify-content: space-between;
        margin-top: 1rem;
    }
    
    .metric-card {
        margin-bottom: 1rem;
    }
}
</style>