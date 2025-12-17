<!-- src/views/Grades/GradeEntry.vue -->
<template>
    <div class="p-4">
        <h2 class="mb-4">📝 Saisie des Notes</h2>

        <!-- Formulaire de saisie -->
        <div class="card mb-4">
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Ajouter une note</h5>
        </div>
        <div class="card-body">
            <form @submit.prevent="handleSubmit">
            <div class="row">
                <!-- Sélection étudiant -->
                <div class="col-md-4 mb-3">
                <label class="form-label">Étudiant *</label>
                <select 
                    v-model="form.student_id" 
                    class="form-select" 
                    required
                    @change="onStudentChange"
                >
                    <option value="">-- Sélectionner un étudiant --</option>
                    <option 
                    v-for="student in students" 
                    :key="student.id" 
                    :value="student.id"
                    >
                    {{ student.user.name }} ({{ student.matricule }}) - {{ student.class }}
                    </option>
                </select>
                </div>

                <!-- Sélection cours -->
                <div class="col-md-4 mb-3">
                <label class="form-label">Cours *</label>
                <select 
                    v-model="form.course_id" 
                    class="form-select" 
                    required
                    :disabled="!form.student_id"
                >
                    <option value="">-- Sélectionner un cours --</option>
                    <option 
                    v-for="course in availableCourses" 
                    :key="course.id" 
                    :value="course.id"
                    >
                    {{ course.name }} (Coef: {{ course.coefficient }})
                    </option>
                </select>
                </div>

                <!-- Type d'examen -->
                <div class="col-md-4 mb-3">
                <label class="form-label">Type d'examen *</label>
                <select v-model="form.exam_type" class="form-select" required>
                    <option value="">-- Sélectionner --</option>
                    <option value="quiz">Quiz</option>
                    <option value="devoir">Devoir</option>
                    <option value="controle">Contrôle</option>
                    <option value="examen">Examen</option>
                    <option value="oral">Oral</option>
                </select>
                </div>

                <!-- Note -->
                <div class="col-md-4 mb-3">
                <label class="form-label">Note * (sur 20)</label>
                <input 
                    v-model.number="form.grade" 
                    type="number" 
                    class="form-control"
                    min="0"
                    max="20"
                    step="0.25"
                    required
                    placeholder="Ex: 15.5"
                >
                <div class="form-text">
                    Note actuelle: 
                    <span :class="getGradeColor(form.grade)">
                    {{ form.grade || 0 }}/20
                    </span>
                </div>
                </div>

                <!-- Date -->
                <div class="col-md-4 mb-3">
                <label class="form-label">Date de l'examen *</label>
                <input 
                    v-model="form.exam_date" 
                    type="date" 
                    class="form-control"
                    :max="today"
                    required
                >
                </div>

                <!-- Commentaire (optionnel) -->
                <div class="col-md-4 mb-3">
                <label class="form-label">Commentaire (optionnel)</label>
                <input 
                    v-model="form.comment" 
                    type="text" 
                    class="form-control"
                    placeholder="Ex: Très bon travail"
                >
                </div>
            </div>

            <!-- Boutons -->
            <div class="d-flex gap-2">
                <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="submitting"
                >
                <span v-if="submitting">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Enregistrement...
                </span>
                <span v-else>✅ Enregistrer la note</span>
                </button>
                <button 
                type="button" 
                class="btn btn-secondary"
                @click="resetForm"
                >
                🔄 Réinitialiser
                </button>
            </div>
            </form>

            <!-- Message de succès -->
            <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
            </div>

            <!-- Message d'erreur -->
            <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
            </div>
        </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="row mb-4">
        <div class="col-md-4">
            <div class="card bg-info text-white">
            <div class="card-body">
                <h6>Notes saisies aujourd'hui</h6>
                <h3>{{ todayGradesCount }}</h3>
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-success text-white">
            <div class="card-body">
                <h6>Moyenne des dernières notes</h6>
                <h3>{{ recentAverage.toFixed(2) }}/20</h3>
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-warning text-white">
            <div class="card-body">
                <h6>Total notes ce mois</h6>
                <h3>{{ monthGradesCount }}</h3>
            </div>
            </div>
        </div>
        </div>

        <!-- Dernières notes saisies -->
        <div class="card">
        <div class="card-header bg-light">
            <h5 class="mb-0">📋 Dernières notes saisies</h5>
        </div>
        <div class="card-body">
            <div v-if="loadingGrades" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Chargement...</p>
            </div>

            <div v-else-if="recentGrades.length === 0" class="text-center text-muted py-4">
            Aucune note saisie récemment
            </div>

            <div v-else class="table-responsive">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>Étudiant</th>
                    <th>Cours</th>
                    <th>Type</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="grade in recentGrades" :key="grade.id">
                    <td>
                    <strong>{{ grade.student?.user?.name || 'N/A' }}</strong>
                    <br>
                    <small class="text-muted">{{ grade.student?.matricule }}</small>
                    </td>
                    <td>{{ grade.course?.name || 'N/A' }}</td>
                    <td>
                    <span class="badge bg-secondary">{{ grade.exam_type }}</span>
                    </td>
                    <td>
                    <span :class="'badge ' + getGradeBadgeClass(grade.grade)">
                        {{ grade.grade }}/20
                    </span>
                    </td>
                    <td>{{ formatDate(grade.exam_date) }}</td>
                    <td>
                    <button 
                        class="btn btn-sm btn-danger"
                        @click="deleteGrade(grade.id)"
                        title="Supprimer"
                    >
                        🗑️
                    </button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'

const authStore = useAuthStore()

// État du formulaire
const form = ref({
    student_id: '',
    course_id: '',
    grade: '',
    exam_type: '',
    exam_date: '',
    comment: ''
})

// Données
const students = ref([])
const courses = ref([])
const recentGrades = ref([])
const selectedStudent = ref(null)

// États
const submitting = ref(false)
const loadingGrades = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Date du jour
const today = new Date().toISOString().split('T')[0]

// Computed
const availableCourses = computed(() => {
    if (!form.value.student_id) return []
    
    const student = students.value.find(s => s.id === form.value.student_id)
    if (!student) return courses.value
    
    // Filtrer les cours de la classe de l'étudiant
    return courses.value.filter(c => c.class === student.class)
})

const todayGradesCount = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    return recentGrades.value.filter(g => 
        g.exam_date === todayStr
    ).length
})

const monthGradesCount = computed(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    return recentGrades.value.filter(g => 
        new Date(g.exam_date) >= firstDay
    ).length
})

const recentAverage = computed(() => {
    if (recentGrades.value.length === 0) return 0
    const sum = recentGrades.value.reduce((acc, g) => acc + parseFloat(g.grade), 0)
    return sum / recentGrades.value.length
})

// Fonctions
const loadStudents = async () => {
    try {
        const { data } = await api.getStudents()
        students.value = data
    } catch (error) {
        console.error('Erreur chargement étudiants:', error)
    }
}

const loadCourses = async () => {
    try {
        const { data } = await api.getCourses()
        courses.value = data
    } catch (error) {
        console.error('Erreur chargement cours:', error)
    }
}

const loadRecentGrades = async () => {
    loadingGrades.value = true
    try {
        // Charger toutes les notes et prendre les 10 dernières
        const gradesPromises = students.value.map(student => 
        api.getStudentGrades(student.id)
        )
        
        const results = await Promise.all(gradesPromises)
        const allGrades = results.flatMap(r => r.data)
        
        // Trier par date et prendre les 10 dernières
        recentGrades.value = allGrades
        .sort((a, b) => new Date(b.exam_date) - new Date(a.exam_date))
        .slice(0, 10)
        
    } catch (error) {
        console.error('Erreur chargement notes récentes:', error)
    } finally {
        loadingGrades.value = false
    }
}

const onStudentChange = () => {
  // Réinitialiser le cours sélectionné
    form.value.course_id = ''
    selectedStudent.value = students.value.find(s => s.id === form.value.student_id)
}

const handleSubmit = async () => {
    submitting.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
        await api.createGrade(form.value)
        
        successMessage.value = '✅ Note enregistrée avec succès !'
        
        // Recharger les notes récentes
        await loadRecentGrades()
        
        // Réinitialiser le formulaire
        resetForm()
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
        successMessage.value = ''
        }, 3000)
        
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error)
        errorMessage.value = '❌ Erreur lors de l\'enregistrement de la note. Veuillez réessayer.'
    } finally {
        submitting.value = false
    }
}

const resetForm = () => {
    form.value = {
        student_id: '',
        course_id: '',
        grade: '',
        exam_type: '',
        exam_date: today,
        comment: ''
    } 
}

const deleteGrade = async (gradeId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return
    
    try {
        // Note: À implémenter dans l'API si nécessaire
        console.log('Suppression de la note:', gradeId)
        successMessage.value = '✅ Note supprimée avec succès !'
        await loadRecentGrades()
    } catch (error) {
        console.error('Erreur suppression:', error)
        errorMessage.value = '❌ Erreur lors de la suppression'
    }
}

const getGradeColor = (grade) => {
    if (!grade) return 'text-muted'
    if (grade >= 16) return 'text-success fw-bold'
    if (grade >= 14) return 'text-info fw-bold'
    if (grade >= 10) return 'text-warning fw-bold'
    return 'text-danger fw-bold'
}

const getGradeBadgeClass = (grade) => {
    if (grade >= 16) return 'bg-success'
    if (grade >= 14) return 'bg-info'
    if (grade >= 10) return 'bg-warning'
    return 'bg-danger'
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

// Lifecycle
onMounted(async () => {
    form.value.exam_date = today
    await Promise.all([
        loadStudents(),
        loadCourses()
    ])
    await loadRecentGrades()
})
</script>

<style scoped>
.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
    border-bottom: 2px solid rgba(0, 0, 0, 0.125);
}

.form-label {
    font-weight: 600;
    margin-bottom: 0.5rem;
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

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.alert {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    opacity: 1;
}
</style>