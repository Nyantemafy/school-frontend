<template>
    <div class="courses-container p-4">
        <!-- En-tête -->
        <div class="courses-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">
                        <i class="bi bi-journal-text me-2"></i>
                        Gestion des cours
                    </h1>
                    <p class="text-muted mb-0">
                        Gérez l'ensemble des cours et leurs affectations
                    </p>
                </div>
                <div class="d-flex gap-3">
                    <button 
                        class="btn btn-outline-secondary d-flex align-items-center"
                        @click="refreshData"
                        :disabled="loading"
                    >
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Actualiser
                    </button>
                    <button 
                        v-if="isAdmin"
                        class="btn btn-primary d-flex align-items-center"
                        @click="openCreateModal"
                    >
                        <i class="bi bi-plus-circle me-2"></i>
                        Nouveau cours
                    </button>
                </div>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="row g-4 mb-6">
            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-primary bg-opacity-10 text-primary rounded-2 p-3 me-3">
                            <i class="bi bi-journal-text fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Total cours</p>
                            <h2 class="mb-0 fw-bold">{{ totalCourses }}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-success bg-opacity-10 text-success rounded-2 p-3 me-3">
                            <i class="bi bi-people-fill fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Cours actifs</p>
                            <h2 class="mb-0 fw-bold">{{ activeCourses }}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-info bg-opacity-10 text-info rounded-2 p-3 me-3">
                            <i class="bi bi-mortarboard fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Étudiants inscrits</p>
                            <h2 class="mb-0 fw-bold">{{ totalStudents }}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6">
                <div class="metric-card border rounded-3 bg-white p-4 shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="metric-icon bg-warning bg-opacity-10 text-warning rounded-2 p-3 me-3">
                            <i class="bi bi-person-badge fs-4"></i>
                        </div>
                        <div>
                            <p class="text-muted mb-1">Professeurs</p>
                            <h2 class="mb-0 fw-bold">{{ totalTeachers }}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="card border-0 shadow-sm mb-6">
            <div class="card-body p-4">
                <div class="row g-3 align-items-center">
                    <div class="col-md-4">
                        <div class="search-box">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-search text-muted"></i>
                                </span>
                                <input 
                                    v-model="searchQuery" 
                                    type="text" 
                                    class="form-control border-start-0" 
                                    placeholder="Rechercher un cours..."
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select v-model="selectedClass" class="form-select">
                            <option value="">Toutes les classes</option>
                            <option value="6ème">6ème</option>
                            <option value="5ème">5ème</option>
                            <option value="4ème">4ème</option>
                            <option value="3ème">3ème</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select v-model="selectedTeacher" class="form-select">
                            <option value="">Tous les professeurs</option>
                            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                {{ teacher.user?.name || 'Professeur non défini' }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button 
                            class="btn btn-outline-secondary w-100"
                            @click="resetFilters"
                        >
                            <i class="bi bi-x-circle me-2"></i>
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tableau des cours -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3">
                <h5 class="mb-0 fw-semibold">Liste des cours</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Code</th>
                                <th>Nom du cours</th>
                                <th>Professeur</th>
                                <th>Classe</th>
                                <th>Coefficient</th>
                                <th>Étudiants</th>
                                <th>Statut</th>
                                <th class="pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="course in paginatedCourses" :key="course.id">
                                <td class="ps-4">
                                    <div class="course-code">
                                        <code class="bg-light px-2 py-1 rounded">{{ course.code }}</code>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="course-icon bg-primary bg-opacity-10 text-primary rounded-2 p-2 me-3">
                                            <i class="bi bi-journal-text"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0 fw-medium">{{ course.name }}</h6>
                                            <small class="text-muted">Créé le {{ formatDate(course.created_at) }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div v-if="course.teacher" class="d-flex align-items-center">
                                        <div class="teacher-avatar bg-info bg-opacity-10 text-info rounded-circle p-2 me-2">
                                            <i class="bi bi-person"></i>
                                        </div>
                                        <div>
                                            <div class="fw-medium">{{ course.teacher.user?.name || 'Professeur non défini' }}</div>
                                            <small class="text-muted">{{ course.teacher.subject }}</small>
                                        </div>
                                    </div>
                                    <div v-else class="text-muted">
                                        <small>Non assigné</small>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge" :class="getClassBadgeClass(course.class)">
                                        {{ course.class }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark">
                                        x{{ course.coefficient }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="students-count me-2">
                                            <i class="bi bi-people text-muted"></i>
                                        </div>
                                        <div>
                                            <div class="fw-medium">{{ course.students?.length || 0 }}</div>
                                            <small class="text-muted">étudiants</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-success-subtle text-success">
                                        <i class="bi bi-check-circle me-1"></i>
                                        Actif
                                    </span>
                                </td>
                                <td class="pe-4">
                                    <div class="d-flex gap-2">
                                        <button 
                                            class="btn btn-sm btn-outline-info"
                                            @click="viewCourseDetails(course)"
                                            title="Voir les détails"
                                        >
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button 
                                            v-if="isAdmin"
                                            class="btn btn-sm btn-outline-warning"
                                            @click="editCourse(course)"
                                            title="Modifier"
                                        >
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            v-if="isAdmin"
                                            class="btn btn-sm btn-outline-danger"
                                            @click="confirmDelete(course)"
                                            title="Supprimer"
                                        >
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Message si aucun résultat -->
                <div v-if="filteredCourses.length === 0" class="text-center py-5">
                    <div class="text-muted mb-3">
                        <i class="bi bi-journal-x fs-1"></i>
                    </div>
                    <h6 class="text-muted">Aucun cours trouvé</h6>
                    <p class="text-muted small">Essayez de modifier vos critères de recherche</p>
                </div>

                <!-- Pagination -->
                <div v-if="filteredCourses.length > itemsPerPage" class="border-top p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="text-muted small">
                            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredCourses.length }} cours
                        </div>
                        <nav aria-label="Pagination des cours">
                            <ul class="pagination mb-0">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                <li v-for="page in Math.ceil(filteredCourses.length / itemsPerPage)" 
                                    :key="page" 
                                    class="page-item" 
                                    :class="{ active: currentPage === page }">
                                    <button class="page-link" @click="currentPage = page">
                                        {{ page }}
                                    </button>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage >= Math.ceil(filteredCourses.length / itemsPerPage) }">
                                    <button 
                                        class="page-link" 
                                        @click="currentPage++" 
                                        :disabled="currentPage >= Math.ceil(filteredCourses.length / itemsPerPage)">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal d'ajout/modification -->
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-white border-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi me-2" :class="editing ? 'bi-pencil-square text-warning' : 'bi-plus-circle text-primary'"></i>
                            {{ editing ? 'Modifier le cours' : 'Nouveau cours' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="handleSubmit" class="course-form">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Code du cours
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-tag text-muted"></i>
                                        </span>
                                        <input 
                                            v-model="form.code" 
                                            type="text" 
                                            class="form-control border-start-0"
                                            placeholder="MATH-301"
                                            required
                                        >
                                    </div>
                                    <small class="text-muted">Identifiant unique du cours</small>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Nom du cours
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-journal-text text-muted"></i>
                                        </span>
                                        <input 
                                            v-model="form.name" 
                                            type="text" 
                                            class="form-control border-start-0"
                                            placeholder="Mathématiques Avancées"
                                            required
                                        >
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Professeur
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-person-badge text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.teacher_id" 
                                            class="form-select border-start-0"
                                            required
                                        >
                                            <option value="">Sélectionnez un professeur</option>
                                            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                                {{ teacher.user.name }} - {{ teacher.subject }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Classe
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-building text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.class" 
                                            class="form-select border-start-0"
                                            required
                                        >
                                            <option value="">Sélectionnez une classe</option>
                                            <option value="6ème">6ème</option>
                                            <option value="5ème">5ème</option>
                                            <option value="4ème">4ème</option>
                                            <option value="3ème">3ème</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Coefficient
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-123 text-muted"></i>
                                        </span>
                                        <input 
                                            v-model.number="form.coefficient" 
                                            type="number" 
                                            class="form-control border-start-0"
                                            min="1"
                                            max="10"
                                            required
                                        >
                                    </div>
                                    <small class="text-muted">Poids du cours dans la moyenne générale</small>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-medium text-gray-700">
                                        Année scolaire
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0">
                                            <i class="bi bi-calendar-range text-muted"></i>
                                        </span>
                                        <select 
                                            v-model="form.academic_year" 
                                            class="form-select border-start-0"
                                        >
                                            <option value="2024-2025">2024-2025</option>
                                            <option value="2023-2024">2023-2024</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <label class="form-label fw-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea 
                                        v-model="form.description" 
                                        class="form-control" 
                                        rows="3"
                                        placeholder="Description détaillée du cours..."
                                    ></textarea>
                                </div>
                            </div>

                            <div class="modal-footer border-0 pt-4">
                                <button 
                                    type="button" 
                                    class="btn btn-outline-secondary"
                                    @click="closeModal"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    class="btn btn-primary px-4"
                                    :disabled="loading"
                                >
                                    <span v-if="!loading">
                                        <i class="bi bi-check-lg me-2"></i>
                                        {{ editing ? 'Mettre à jour' : 'Créer le cours' }}
                                    </span>
                                    <span v-else class="d-flex align-items-center">
                                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Enregistrement...
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de détails du cours -->
        <div class="modal fade" id="courseDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Détails du cours</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="selectedCourse">
                <div class="row mb-4">
                    <div class="col-md-6">
                    <h4 class="mb-3">{{ selectedCourse.name }}</h4>
                    <p class="text-muted mb-2">
                        <i class="bi bi-book me-2"></i>Code: <strong>{{ selectedCourse.code }}</strong>
                    </p>
                    <p class="text-muted mb-2">
                        <i class="bi bi-people me-2"></i>Classe: <span class="badge bg-primary">{{ selectedCourse.class }}</span>
                    </p>
                    <p class="text-muted mb-2" v-if="selectedCourse.teacher">
                        <i class="bi bi-person-video3 me-2"></i>Enseignant: 
                        <span class="fw-medium">{{ selectedCourse.teacher.user?.name || 'Non attribué' }}</span>
                    </p>
                    </div>
                    <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body">
                        <h6 class="card-subtitle mb-3 text-muted">Statistiques</h6>
                        <div class="d-flex justify-content-between mb-2" v-if="selectedCourse.students">
                            <span>Étudiants inscrits:</span>
                            <span class="badge bg-info">{{ selectedCourse.students.length }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Statut:</span>
                            <span class="badge" :class="selectedCourse.status === 'active' ? 'bg-success' : 'bg-secondary'">
                            {{ selectedCourse.status === 'active' ? 'Actif' : 'Inactif' }}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between" v-if="selectedCourse.created_at">
                            <span>Créé le:</span>
                            <span class="text-muted">{{ formatDate(selectedCourse.created_at) }}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
        
                <div class="mb-4" v-if="selectedCourse.description">
                    <h6>Description</h6>
                    <p class="text-muted">{{ selectedCourse.description || 'Aucune description disponible.' }}</p>
                </div>
        
                <div v-if="selectedCourse.students && selectedCourse.students.length > 0">
                    <h6 class="mb-3">Étudiants inscrits ({{ selectedCourse.students.length }})</h6>
                    <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Date d'inscription</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="student in selectedCourse.students" :key="student.id">
                            <td>{{ student.name }}</td>
                            <td>{{ student.email }}</td>
                            <td>{{ formatDate(student.pivot?.created_at) || 'N/A' }}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div v-else class="alert alert-info">
                    Aucun étudiant n'est inscrit à ce cours pour le moment.
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                </div>
            </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap';
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const router = useRouter()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

// États
const courses = ref([])
const teachers = ref([])
const loading = ref(false)
const showModal = ref(false)
const editing = ref(null)
const searchQuery = ref('')
const selectedClass = ref('')
const selectedTeacher = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const selectedCourse = ref(null);
let courseDetailsModal = null;

const viewCourseDetails = async (course) => {
  try {
    // Si le cours contient déjà les détails complets
    if (course.students && course.teacher) {
      selectedCourse.value = course;
    } else {
      // Sinon, récupérer les détails complets
      const response = await api.get(`/courses/${course.id}`);
      selectedCourse.value = response.data;
    }
    
    // Initialiser ou afficher la modale
    if (!courseDetailsModal) {
      courseDetailsModal = new Modal(document.getElementById('courseDetailsModal'));
    }
    courseDetailsModal.show();
  } catch (error) {
    console.error('Erreur lors du chargement des détails du cours:', error);
    // Afficher un message d'erreur à l'utilisateur
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'PPP', { locale: fr });
};

// Form
const form = ref({
    code: '',
    name: '',
    teacher_id: '',
    class: '',
    coefficient: 1,
    academic_year: '2024-2025',
    description: ''
})

// Computed properties
const filteredCourses = computed(() => {
    return courses.value.filter(course => {
        const matchesSearch = searchQuery.value === '' || 
            course.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        const matchesClass = selectedClass.value === '' || course.class === selectedClass.value
        
        const matchesTeacher = selectedTeacher.value === '' || 
            course.teacher?.id === parseInt(selectedTeacher.value)
        
        return matchesSearch && matchesClass && matchesTeacher
    })
})

const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredCourses.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredCourses.value.length))

const totalCourses = computed(() => courses.value.length)
const activeCourses = computed(() => courses.value.filter(c => c.is_active !== false).length)
const totalStudents = computed(() => {
    return courses.value.reduce((total, course) => total + (course.students?.length || 0), 0)
})
const totalTeachers = computed(() => {
    const teacherIds = new Set()
    courses.value.forEach(course => {
        if (course.teacher?.id) teacherIds.add(course.teacher.id)
    })
    return teacherIds.size
})

// Méthodes
const loadCourses = async () => {
    loading.value = true
    try {
        const { data } = await api.getCourses()
        courses.value = data
    } catch (error) {
        if (error.response?.status === 401) {
            // Redirect to login on 401
            router.push('/login')
        } else {
            console.error('Erreur lors du chargement des cours:', error)
        }
    } finally {
        loading.value = false
    }
}

const loadTeachers = async () => {
    try {
        const { data } = await api.getTeachers()
        teachers.value = data
    } catch (error) {
        if (error.response?.status === 401) {
            // Redirect to login on 401
            router.push('/login')
        } else {
            console.error('Erreur lors du chargement des professeurs:', error)
        }
    }
}

const refreshData = async () => {
    try {
        await Promise.all([loadCourses(), loadTeachers()])
    } catch (error) {
        // Errors are already handled in the individual functions
        console.error('Erreur lors du rafraîchissement des données:', error)
    }
}

const openCreateModal = () => {
    editing.value = null
    resetForm()
    showModal.value = true
}

const editCourse = (course) => {
    editing.value = course.id
    form.value = { ...course }
    showModal.value = true
}

const confirmDelete = (course) => {
    if (confirm(`Voulez-vous vraiment supprimer le cours "${course.name}" ?`)) {
        deleteCourse(course.id)
    }
}

const deleteCourse = async (id) => {
    try {
        await api.deleteCourse(id)
        await loadCourses()
    } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Impossible de supprimer le cours. Il est peut-être utilisé par des étudiants.')
    }
}

const handleSubmit = async () => {
    try {
        if (editing.value) {
            await api.updateCourse(editing.value, form.value)
        } else {
            await api.createCourse(form.value)
        }
        await loadCourses()
        closeModal()
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error)
        alert('Une erreur est survenue lors de l\'enregistrement.')
    }
}

const closeModal = () => {
    showModal.value = false
    editing.value = null
    resetForm()
}

const resetForm = () => {
    form.value = {
        code: '',
        name: '',
        teacher_id: '',
        class: '',
        coefficient: 1,
        academic_year: '2024-2025',
        description: ''
    }
}

const resetFilters = () => {
    searchQuery.value = ''
    selectedClass.value = ''
    selectedTeacher.value = ''
    currentPage.value = 1
}

const getClassBadgeClass = (className) => {
    const classes = {
        '6ème': 'bg-primary-subtle text-primary',
        '5ème': 'bg-success-subtle text-success',
        '4ème': 'bg-info-subtle text-info',
        '3ème': 'bg-warning-subtle text-warning'
    }
    return classes[className] || 'bg-secondary-subtle text-secondary'
}

// Lifecycle
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/login')
        return
    }
    await refreshData()
})

// Watchers
watch([searchQuery, selectedClass, selectedTeacher], () => {
    currentPage.value = 1
})
</script>

<style scoped>
.courses-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.courses-header {
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

.search-box .input-group {
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.search-box .input-group:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.course-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.teacher-avatar {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.students-count {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.course-code code {
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 0.875rem;
}

.bg-primary-subtle {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
}

.bg-success-subtle {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
}

.bg-info-subtle {
    background-color: rgba(14, 165, 233, 0.1);
    color: #0EA5E9;
}

.bg-warning-subtle {
    background-color: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
}

.course-form .input-group {
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.course-form .input-group:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-content {
    animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .courses-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .courses-header .d-flex {
        margin-top: 1rem;
        width: 100%;
        justify-content: space-between;
    }
    
    .modal-dialog {
        margin: 1rem;
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

.courses-container > * {
    animation: fadeInUp 0.5s ease-out;
}
</style>