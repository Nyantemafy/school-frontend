<template>
    <div class="student-grades-container p-4">
        <!-- En-tête -->
        <div class="grades-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">Notes académiques</h1>
                    <div class="d-flex align-items-center">
                        <div class="student-badge me-3">
                            <span class="badge bg-gradient-success text-white">
                                <i class="bi bi-mortarboard me-2"></i>
                                Étudiant
                            </span>
                        </div>
                        <div class="text-muted">
                            <i class="bi bi-person-circle me-1"></i>
                            {{ studentInfo.name || 'Chargement...' }}
                        </div>
                    </div>
                </div>
                <div>
                    <button 
                        class="btn btn-primary d-flex align-items-center"
                        @click="downloadBulletin"
                        :disabled="loading"
                    >
                        <i class="bi bi-download me-2"></i>
                        Exporter PDF
                    </button>
                </div>
            </div>
        </div>

        <!-- Métriques principales -->
        <div class="row g-4 mb-6">
            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-primary bg-opacity-10 text-primary rounded-2 p-3 me-3">
                            <i class="bi bi-graph-up fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Moyenne générale</p>
                            <h2 class="mb-0 fw-bold" :class="getAverageColor(average)">
                                {{ average.toFixed(2) }}/20
                            </h2>
                        </div>
                    </div>
                    <div class="metric-trend mt-3">
                        <span :class="'small ' + getAverageTrendClass(average)">
                            <i :class="'bi ' + getAverageTrendIcon(average)"></i>
                            {{ getAverageStatus(average) }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-success bg-opacity-10 text-success rounded-2 p-3 me-3">
                            <i class="bi bi-check-circle fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Notes > 10/20</p>
                            <h2 class="mb-0 fw-bold">{{ passingGrades }}</h2>
                        </div>
                    </div>
                    <div class="metric-trend mt-3">
                        <span class="text-success small">
                            {{ passingPercentage }}% des notes
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
                            <p class="text-muted mb-1">Total des notes</p>
                            <h2 class="mb-0 fw-bold">{{ totalGrades }}</h2>
                        </div>
                    </div>
                    <div class="metric-trend mt-3">
                        <span class="text-muted small">
                            {{ uniqueSubjects }} matières
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-warning bg-opacity-10 text-warning rounded-2 p-3 me-3">
                            <i class="bi bi-star fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Meilleure note</p>
                            <h2 class="mb-0 fw-bold">{{ bestGrade.toFixed(1) }}/20</h2>
                        </div>
                    </div>
                    <div class="metric-trend mt-3">
                        <span class="text-warning small">
                            En {{ bestGradeSubject }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Graphique et informations -->
        <div class="row g-4 mb-6">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-semibold">Répartition par matière</h5>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i class="bi bi-filter me-1"></i>
                                    Filtrer
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" @click.prevent="filterByType('all')">Tous les types</a></li>
                                    <li><a class="dropdown-item" href="#" @click.prevent="filterByType('examen')">Examens</a></li>
                                    <li><a class="dropdown-item" href="#" @click.prevent="filterByType('devoir')">Devoirs</a></li>
                                    <li><a class="dropdown-item" href="#" @click.prevent="filterByType('quiz')">Quizz</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div v-if="loading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2 text-muted">Chargement des notes...</p>
                        </div>
                        <div v-else-if="filteredGrades.length > 0" class="grades-list">
                            <div v-for="course in paginatedCourses" :key="course.name" class="course-grades mb-4">
                                <div class="course-header mb-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="fw-semibold mb-1">{{ course.name }}</h6>
                                            <div class="d-flex align-items-center">
                                                <span class="badge bg-light text-dark me-2">
                                                    Coefficient: {{ course.coefficient }}
                                                </span>
                                                <span class="badge bg-light text-dark">
                                                    Moyenne: {{ course.average.toFixed(1) }}/20
                                                </span>
                                            </div>
                                        </div>
                                        <div class="text-end">
                                            <div class="progress" style="width: 100px; height: 8px;">
                                                <div class="progress-bar" 
                                                     :class="getProgressBarClass(course.average)"
                                                     :style="{width: (course.average / 20 * 100) + '%'}">
                                                </div>
                                            </div>
                                            <small class="text-muted">{{ getGradeStatus(course.average) }}</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Type d'évaluation</th>
                                                <th>Note</th>
                                                <th>Date</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="grade in course.grades" :key="grade.id">
                                                <td>
                                                    <span class="badge" :class="getExamTypeClass(grade.exam_type)">
                                                        {{ grade.exam_type }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span :class="'grade-badge ' + getGradeClass(grade.grade)">
                                                        {{ parseFloat(grade.grade).toFixed(1) }}/20
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="text-muted">{{ formatDate(grade.exam_date) }}</span>
                                                </td>
                                                <td>
                                                    <span class="status-indicator" :class="getGradeStatusClass(grade.grade)"></span>
                                                    <small class="ms-2">{{ getGradeStatus(grade.grade) }}</small>
                                                </td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary" @click="viewGradeDetails(grade)">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-5">
                            <div class="text-muted mb-3">
                                <i class="bi bi-journal-x fs-1"></i>
                            </div>
                            <p class="text-muted">Aucune note disponible pour ce filtre</p>
                        </div>
                        <!-- Pagination -->
                        <div v-if="groupedByCourse.length > itemsPerPage" class="mt-4 d-flex justify-content-center">
                            <nav aria-label="Pagination des cours">
                                <ul class="pagination">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                                            &laquo;
                                        </button>
                                    </li>
                                    <li v-for="page in Math.ceil(groupedByCourse.length / itemsPerPage)" 
                                        :key="page" 
                                        class="page-item" 
                                        :class="{ active: currentPage === page }">
                                        <button class="page-link" @click="currentPage = page">
                                            {{ page }}
                                        </button>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage >= Math.ceil(groupedByCourse.length / itemsPerPage) }">
                                        <button 
                                            class="page-link" 
                                            @click="currentPage++" 
                                            :disabled="currentPage >= Math.ceil(groupedByCourse.length / itemsPerPage)">
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <!-- Information étudiant -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 fw-semibold">Informations étudiant</h5>
                    </div>
                    <div class="card-body">
                        <div v-if="loading" class="text-center py-3">
                            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                        <div v-else class="student-info">
                            <div class="mb-3">
                                <div class="info-item">
                                    <i class="bi bi-person text-primary me-2"></i>
                                    <span class="fw-medium">Nom complet:</span>
                                    <span class="ms-2">{{ studentInfo.name || 'Non disponible' }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="info-item">
                                    <i class="bi bi-building text-primary me-2"></i>
                                    <span class="fw-medium">Classe:</span>
                                    <span class="badge bg-primary-subtle text-primary ms-2">
                                        {{ studentInfo.class || 'Non assigné' }}
                                    </span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="info-item">
                                    <i class="bi bi-card-text text-primary me-2"></i>
                                    <span class="fw-medium">Matricule:</span>
                                    <code class="ms-2 bg-light px-2 py-1 rounded">
                                        {{ studentInfo.matricule || 'N/A' }}
                                    </code>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="info-item">
                                    <i class="bi bi-envelope text-primary me-2"></i>
                                    <span class="fw-medium">Email:</span>
                                    <span class="ms-2 text-muted">{{ studentInfo.email || 'Non disponible' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques rapides -->
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="mb-0 fw-semibold">Statistiques</h5>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-primary fw-bold">{{ excellentGrades }}</div>
                                <div class="stat-label small text-muted">Excellent (≥16)</div>
                            </div>
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-info fw-bold">{{ goodGrades }}</div>
                                <div class="stat-label small text-muted">Bon (14-15.9)</div>
                            </div>
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-warning fw-bold">{{ averageGrades }}</div>
                                <div class="stat-label small text-muted">Moyen (10-13.9)</div>
                            </div>
                            <div class="stat-item text-center p-3 border rounded-2">
                                <div class="stat-value text-danger fw-bold">{{ lowGrades }}</div>
                                <div class="stat-label small text-muted">À améliorer (<10)</div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="small text-muted">Progression moyenne</span>
                                <span class="small fw-medium">{{ average.toFixed(1) }}/20</span>
                            </div>
                            <div class="progress" style="height: 10px;">
                                <div class="progress-bar" 
                                     :class="getProgressBarClass(average)"
                                     :style="{width: (average / 20 * 100) + '%'}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Légende -->
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <h6 class="fw-semibold mb-3">Légende des notes</h6>
                <div class="row g-3">
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-success text-white me-2">16-20</span>
                            <small class="text-muted">Excellent</small>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-info text-white me-2">14-15.9</span>
                            <small class="text-muted">Très bien</small>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-warning text-dark me-2">10-13.9</span>
                            <small class="text-muted">Satisfaisant</small>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <span class="grade-badge bg-danger text-white me-2">0-9.9</span>
                            <small class="text-muted">À améliorer</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Configuration de la pagination
const itemsPerPage = ref(5)
const currentPage = ref(1)

// États
const grades = ref([])
const studentInfo = ref({})
const loading = ref(true)
const currentFilter = ref('all')

// Propriétés calculées
const average = computed(() => {
    if (grades.value.length === 0) return 0
    const sum = grades.value.reduce((acc, grade) => {
        // Convertir la note en nombre avant l'addition
        const gradeValue = parseFloat(grade.grade) || 0
        return acc + gradeValue
    }, 0)
    return sum / grades.value.length
})

const filteredGrades = computed(() => {
    if (currentFilter.value === 'all') return grades.value
    return grades.value.filter(grade => grade.exam_type === currentFilter.value)
})

const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return groupedByCourse.value.slice(start, start + itemsPerPage.value)
})

const totalGrades = computed(() => grades.value.length)

const passingGrades = computed(() => {
    return grades.value.filter(grade => grade.grade >= 10).length
})

const passingPercentage = computed(() => {
    if (totalGrades.value === 0) return 0
    return Math.round((passingGrades.value / totalGrades.value) * 100)
})

const uniqueSubjects = computed(() => {
    const subjects = new Set()
    grades.value.forEach(grade => subjects.add(grade.course.name))
    return subjects.size
})

const bestGrade = computed(() => {
    if (grades.value.length === 0) return 0
    return Math.max(...grades.value.map(g => parseFloat(g.grade) || 0))
})

const bestGradeSubject = computed(() => {
    if (grades.value.length === 0) return ''
    const best = grades.value.reduce((prev, current) => 
        (prev.grade > current.grade) ? prev : current
    )
    return best.course.name
})

const excellentGrades = computed(() => {
    return grades.value.filter(g => g.grade >= 16).length
})

const goodGrades = computed(() => {
    return grades.value.filter(g => g.grade >= 14 && g.grade < 16).length
})

const averageGrades = computed(() => {
    return grades.value.filter(g => g.grade >= 10 && g.grade < 14).length
})

const lowGrades = computed(() => {
    return grades.value.filter(g => g.grade < 10).length
})

const groupedByCourse = computed(() => {
    const groups = {}
    
    filteredGrades.value.forEach(grade => {
        if (!groups[grade.course.name]) {
            groups[grade.course.name] = {
                name: grade.course.name,
                coefficient: grade.course.coefficient || 1,
                grades: [],
                average: 0
            }
        }
        // S'assurer que la note est un nombre
        grade.grade = parseFloat(grade.grade) || 0
        groups[grade.course.name].grades.push(grade)
    })
    
    // Calculer la moyenne par cours
    Object.values(groups).forEach(course => {
        const sum = course.grades.reduce((acc, grade) => acc + grade.grade, 0)
        course.average = sum / course.grades.length
    })
    
    return Object.values(groups).sort((a, b) => b.average - a.average)
})

// Méthodes
const downloadBulletin = () => {
    const studentId = route.params.id
    window.open(`http://localhost:8000/api/reports/bulletin/${studentId}`, '_blank')
}

const filterByType = (type) => {
    currentFilter.value = type
    currentPage.value = 1 // Réinitialiser la pagination lors du filtrage
}

const viewGradeDetails = (grade) => {
    // Implémentez l'action pour voir les détails de la note
    console.log('Détails de la note:', grade)
}

const getGradeClass = (grade) => {
    if (grade >= 16) return 'bg-success'
    if (grade >= 14) return 'bg-info'
    if (grade >= 10) return 'bg-warning'
    return 'bg-danger'
}

const getGradeStatus = (grade) => {
    if (grade >= 16) return 'Excellent'
    if (grade >= 14) return 'Très bien'
    if (grade >= 12) return 'Bien'
    if (grade >= 10) return 'Satisfaisant'
    return 'Insuffisant'
}

const getGradeStatusClass = (grade) => {
    if (grade >= 10) return 'bg-success'
    return 'bg-danger'
}

const getExamTypeClass = (type) => {
    const classes = {
        'examen': 'bg-danger-subtle text-danger',
        'devoir': 'bg-warning-subtle text-warning',
        'quiz': 'bg-info-subtle text-info',
        'controle': 'bg-primary-subtle text-primary'
    }
    return classes[type] || 'bg-secondary-subtle text-secondary'
}

const getAverageColor = (avg) => {
    if (avg >= 16) return 'text-success'
    if (avg >= 14) return 'text-info'
    if (avg >= 10) return 'text-warning'
    return 'text-danger'
}

const getAverageTrendClass = (avg) => {
    if (avg >= 14) return 'text-success'
    if (avg >= 10) return 'text-warning'
    return 'text-danger'
}

const getAverageTrendIcon = (avg) => {
    if (avg >= 14) return 'bi-arrow-up-short'
    if (avg >= 10) return 'bi-dash'
    return 'bi-arrow-down-short'
}

const getAverageStatus = (avg) => {
    if (avg >= 16) return 'Performance excellente'
    if (avg >= 14) return 'Performance très bonne'
    if (avg >= 12) return 'Performance bonne'
    if (avg >= 10) return 'Performance moyenne'
    return 'À améliorer'
}

const getProgressBarClass = (value) => {
    if (value >= 16) return 'bg-success'
    if (value >= 14) return 'bg-info'
    if (value >= 10) return 'bg-warning'
    return 'bg-danger'
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// Chargement initial des données
const loadInitialData = async () => {
    loading.value = true
    try {
        const studentId = route.params.id
        
        const [gradesRes, studentRes] = await Promise.all([
            api.getStudentGrades(studentId),
            api.getStudent(studentId)
        ])
        
        // Convertir les notes en nombres
        grades.value = gradesRes.data.map(grade => ({
            ...grade,
            grade: parseFloat(grade.grade) || 0
        }))
        
        studentInfo.value = studentRes.data
        
        console.log('Données chargées:', {
            gradesCount: grades.value.length,
            studentInfo: studentInfo.value
        })
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadInitialData()
})

// Assurez-vous que le composant API est correctement importé
import api from '../../services/api'
</script>

<style scoped>
.student-grades-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.grades-header {
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

.course-grades {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
}

.course-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.grade-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.student-info .info-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.student-info .info-item:last-child {
    border-bottom: none;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.stat-item {
    transition: all 0.2s ease;
}

.stat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-value {
    font-size: 1.5rem;
    line-height: 1.2;
}

.stat-label {
    margin-top: 0.25rem;
}

.progress {
    background-color: #f1f5f9;
    border-radius: 10px;
}

.progress-bar {
    border-radius: 10px;
}

/* Classes pour les badges de couleurs */
.bg-primary-subtle {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
}

.bg-success-subtle {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
}

.bg-warning-subtle {
    background-color: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
}

.bg-danger-subtle {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
}

.bg-info-subtle {
    background-color: rgba(14, 165, 233, 0.1);
    color: #0EA5E9;
}

.bg-gradient-success {
    background: linear-gradient(135deg, #10B981 0%, #047857 100%);
}

/* Responsive */
@media (max-width: 768px) {
    .grades-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .grades-header .d-flex {
        margin-top: 1rem;
        width: 100%;
        justify-content: space-between;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
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

.student-grades-container > * {
    animation: fadeInUp 0.5s ease-out;
}
</style>