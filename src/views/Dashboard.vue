<template>
    <div class="p-4">
        <h2 class="mb-4">
        <span v-if="user">👋 Bienvenue, {{ user.name }}</span>
        </h2>

        <!-- Dashboard Admin -->
        <div v-if="isAdmin" class="admin-dashboard">
        <div class="row g-4 mb-4">
            <!-- Carte Étudiants -->
            <div class="col-md-3">
            <div class="card bg-primary text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Étudiants</h6>
                    <h2 class="card-title mb-0">{{ stats.totalStudents }}</h2>
                    </div>
                    <div class="fs-1">👥</div>
                </div>
                </div>
            </div>
            </div>

            <!-- Carte Professeurs -->
            <div class="col-md-3">
            <div class="card bg-success text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Professeurs</h6>
                    <h2 class="card-title mb-0">{{ stats.totalTeachers }}</h2>
                    </div>
                    <div class="fs-1">👨‍🏫</div>
                </div>
                </div>
            </div>
            </div>

            <!-- Carte Cours -->
            <div class="col-md-3">
            <div class="card bg-info text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Cours</h6>
                    <h2 class="card-title mb-0">{{ stats.totalCourses }}</h2>
                    </div>
                    <div class="fs-1">📚</div>
                </div>
                </div>
            </div>
            </div>

            <!-- Carte Classes -->
            <div class="col-md-3">
            <div class="card bg-warning text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Classes</h6>
                    <h2 class="card-title mb-0">{{ stats.totalClasses }}</h2>
                    </div>
                    <div class="fs-1">🏫</div>
                </div>
                </div>
            </div>
            </div>
        </div>

        <!-- Activités récentes -->
        <div class="row">
            <div class="col-md-6">
            <div class="card">
                <div class="card-header bg-light">
                <h5 class="mb-0">📊 Statistiques par classe</h5>
                </div>
                <div class="card-body">
                <div v-if="classStats.length > 0">
                    <div v-for="cls in classStats" :key="cls.class" class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>{{ cls.class }}</span>
                        <span class="badge bg-primary">{{ cls.count }} étudiants</span>
                    </div>
                    <div class="progress" style="height: 20px;">
                        <div 
                        class="progress-bar" 
                        :style="{ width: getPercentage(cls.count) + '%' }"
                        >
                        {{ getPercentage(cls.count) }}%
                        </div>
                    </div>
                    </div>
                </div>
                <div v-else class="text-center text-muted py-4">
                    Aucune donnée disponible
                </div>
                </div>
            </div>
            </div>

            <div class="col-md-6">
            <div class="card">
                <div class="card-header bg-light">
                <h5 class="mb-0">🎯 Accès rapides</h5>
                </div>
                <div class="card-body">
                <div class="d-grid gap-2">
                    <router-link to="/students/create" class="btn btn-primary btn-lg">
                    ➕ Ajouter un étudiant
                    </router-link>
                    <router-link to="/students" class="btn btn-outline-primary btn-lg">
                    👥 Voir tous les étudiants
                    </router-link>
                    <router-link to="/courses" class="btn btn-outline-info btn-lg">
                    📚 Gérer les cours
                    </router-link>
                    <router-link to="/grades" class="btn btn-outline-success btn-lg">
                    📝 Saisir des notes
                    </router-link>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>

        <!-- Dashboard Professeur -->
        <div v-else-if="isTeacher" class="teacher-dashboard">
        <div class="row g-4 mb-4">
            <div class="col-md-4">
            <div class="card bg-primary text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Mes Cours</h6>
                    <h2 class="card-title mb-0">{{ teacherStats.myCourses }}</h2>
                    </div>
                    <div class="fs-1">📚</div>
                </div>
                </div>
            </div>
            </div>

            <div class="col-md-4">
            <div class="card bg-success text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Mes Étudiants</h6>
                    <h2 class="card-title mb-0">{{ teacherStats.myStudents }}</h2>
                    </div>
                    <div class="fs-1">👥</div>
                </div>
                </div>
            </div>
            </div>

            <div class="col-md-4">
            <div class="card bg-info text-white">
                <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                    <h6 class="card-subtitle mb-2">Notes saisies</h6>
                    <h2 class="card-title mb-0">{{ teacherStats.gradesEntered }}</h2>
                    </div>
                    <div class="fs-1">📝</div>
                </div>
                </div>
            </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
            <div class="card">
                <div class="card-header bg-light">
                <h5 class="mb-0">🎯 Actions rapides</h5>
                </div>
                <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                    <router-link to="/grades" class="btn btn-primary btn-lg w-100">
                        📝 Saisir des notes
                    </router-link>
                    </div>
                    <div class="col-md-6">
                    <router-link to="/students" class="btn btn-outline-primary btn-lg w-100">
                        👥 Voir mes étudiants
                    </router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>

        <!-- Dashboard Étudiant -->
        <div v-else-if="isStudent" class="student-dashboard">
        <div class="row g-4 mb-4">
            <div class="col-md-6">
            <div class="card bg-primary text-white">
                <div class="card-body">
                <h6 class="card-subtitle mb-2">Ma Classe</h6>
                <h2 class="card-title mb-0">{{ studentInfo.class || 'Non assigné' }}</h2>
                </div>
            </div>
            </div>

            <div class="col-md-6">
            <div class="card bg-success text-white">
                <div class="card-body">
                <h6 class="card-subtitle mb-2">Matricule</h6>
                <h2 class="card-title mb-0">{{ studentInfo.matricule || 'N/A' }}</h2>
                </div>
            </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
            <div class="card">
                <div class="card-header bg-light">
                <h5 class="mb-0">📊 Ma Moyenne Générale</h5>
                </div>
                <div class="card-body text-center">
                <div v-if="studentAverage !== null">
                    <h1 class="display-3" :class="getAverageColor(studentAverage)">
                    {{ studentAverage.toFixed(2) }}/20
                    </h1>
                    <p class="text-muted">{{ getAverageLabel(studentAverage) }}</p>
                </div>
                <div v-else-if="loadingAverage" class="py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">Chargement...</p>
                </div>
                <div v-else class="text-muted py-4">
                    Aucune note disponible
                </div>
                </div>
            </div>
            </div>

            <div class="col-md-6">
            <div class="card">
                <div class="card-header bg-light">
                <h5 class="mb-0">🎯 Accès rapides</h5>
                </div>
                <div class="card-body">
                <div class="d-grid gap-2">
                    <router-link 
                    v-if="studentInfo.id"
                    :to="`/students/${studentInfo.id}/grades`" 
                    class="btn btn-primary btn-lg"
                    >
                    📈 Voir mes notes
                    </router-link>
                    <router-link to="/courses" class="btn btn-outline-info btn-lg">
                    📚 Mes cours
                    </router-link>
                    <router-link to="/schedule" class="btn btn-outline-secondary btn-lg">
                    📅 Mon emploi du temps
                    </router-link>
                </div>
                </div>
            </div>
            </div>
        </div>

        <!-- Dernières notes -->
        <div class="row mt-4" v-if="recentGrades.length > 0">
            <div class="col-md-12">
            <div class="card">
                <div class="card-header bg-light">
                <h5 class="mb-0">📝 Dernières notes</h5>
                </div>
                <div class="card-body">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>Cours</th>
                        <th>Type</th>
                        <th>Note</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="grade in recentGrades" :key="grade.id">
                        <td>{{ grade.course?.name || 'N/A' }}</td>
                        <td>{{ grade.exam_type }}</td>
                        <td>
                        <span :class="'badge ' + getGradeBadgeClass(grade.grade)">
                            {{ grade.grade }}/20
                        </span>
                        </td>
                        <td>{{ formatDate(grade.exam_date) }}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        </div>

        <!-- Dashboard par défaut (Parent ou autre) -->
        <div v-else class="default-dashboard">
        <div class="alert alert-info">
            <h4>👋 Bienvenue sur le système de gestion scolaire</h4>
            <p>Votre rôle : <strong>{{ user?.role }}</strong></p>
            <p class="mb-0">Utilisez le menu de navigation pour accéder aux différentes sections.</p>
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
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalClasses: 0
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

// Fonctions
const loadAdminStats = async () => {
    try {
        const [studentsRes, coursesRes] = await Promise.all([
        api.getStudents(),
        api.getCourses()
        ])

        stats.value.totalStudents = studentsRes.data.length
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
        }))

        // Compter le nombre de classes uniques
        stats.value.totalClasses = Object.keys(classCounts).length

    } catch (error) {
        console.error('Erreur lors du chargement des stats admin:', error)
    }
}

const loadTeacherStats = async () => {
    try {
        const coursesRes = await api.getCourses()
        
        // Filtrer les cours du professeur connecté
        const teacherId = user.value.teacher?.id
        const myCourses = coursesRes.data.filter(c => c.teacher_id === teacherId)
        
        teacherStats.value.myCourses = myCourses.length
        
        // Compter les étudiants uniques dans ces cours
        const uniqueStudents = new Set()
        myCourses.forEach(course => {
        course.students?.forEach(student => {
            uniqueStudents.add(student.id)
        })
        })
        
        teacherStats.value.myStudents = uniqueStudents.size

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

        // Charger la moyenne
        loadingAverage.value = true
        const avgRes = await api.getStudentAverage(user.value.student.id)
        studentAverage.value = avgRes.data.average

        // Charger les dernières notes
        const gradesRes = await api.getStudentGrades(user.value.student.id)
        recentGrades.value = gradesRes.data.slice(0, 5) // 5 dernières notes

        loadingAverage.value = false
        }
    } catch (error) {
        console.error('Erreur lors du chargement des infos étudiant:', error)
        loadingAverage.value = false
    }
}

const getPercentage = (count) => {
    if (stats.value.totalStudents === 0) return 0
    return Math.round((count / stats.value.totalStudents) * 100)
}

const getAverageColor = (average) => {
    if (average >= 16) return 'text-success'
    if (average >= 14) return 'text-info'
    if (average >= 10) return 'text-warning'
    return 'text-danger'
}

const getAverageLabel = (average) => {
    if (average >= 16) return 'Excellent ! 🎉'
    if (average >= 14) return 'Très bien ! 👏'
    if (average >= 12) return 'Bien 👍'
    if (average >= 10) return 'Passable'
    return 'Insuffisant'
}

const getGradeBadgeClass = (grade) => {
    if (grade >= 16) return 'bg-success'
    if (grade >= 14) return 'bg-info'
    if (grade >= 10) return 'bg-warning'
    return 'bg-danger'
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR')
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
.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-body {
    padding: 1.5rem;
}

.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
}

.display-3 {
    font-weight: 700;
    font-size: 4rem;
}

.progress {
    background-color: #e9ecef;
}

.progress-bar {
    background-color: #0d6efd;
    color: white;
    font-weight: bold;
}

.table {
    margin-bottom: 0;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.025);
}

.badge {
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
}

.admin-dashboard,
.teacher-dashboard,
.student-dashboard {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>