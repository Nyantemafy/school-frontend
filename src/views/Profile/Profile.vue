<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Mon profil</h4>
              <router-link to="/profile/edit" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-pencil me-1"></i> Modifier
              </router-link>
            </div>
          </div>
          
          <div class="card-body p-4">
            <div class="row">
              <!-- Photo de profil -->
              <div class="col-md-4 text-center mb-4 mb-md-0">
                <div class="position-relative d-inline-block">
                  <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'"
                       class="rounded-circle border" 
                       width="150" 
                       height="150"
                       alt="Photo de profil">
                  <button class="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 border">
                    <i class="bi bi-camera"></i>
                  </button>
                </div>
              </div>
              
              <!-- Informations utilisateur -->
              <div class="col-md-8">
                <div class="mb-4">
                  <h3 class="mb-3">{{ user.name }}</h3>
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-envelope me-2 text-muted"></i>
                    <span>{{ user.email }}</span>
                  </div>
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-person-badge me-2 text-muted"></i>
                    <span class="badge" :class="'bg-' + getRoleColor(user.role)">
                      {{ formatRole(user.role) }}
                    </span>
                  </div>
                  <div v-if="user.phone" class="d-flex align-items-center mb-2">
                    <i class="bi bi-telephone me-2 text-muted"></i>
                    <span>{{ user.phone }}</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-calendar3 me-2 text-muted"></i>
                    <span>Membre depuis {{ formatDate(user.created_at) }}</span>
                  </div>
                </div>
                
                <!-- Informations supplémentaires selon le rôle -->
                <div v-if="isStudent && user.student" class="border-top pt-3">
                  <h5 class="mb-3">Informations étudiant</h5>
                  <div class="row">
                    <div class="col-md-6 mb-2">
                      <div class="text-muted small">Classe</div>
                      <div>{{ user.student.class || 'Non spécifiée' }}</div>
                    </div>
                    <div class="col-md-6 mb-2">
                      <div class="text-muted small">Date de naissance</div>
                      <div>{{ user.student.date_of_birth ? formatDate(user.student.date_of_birth) : 'Non spécifiée' }}</div>
                    </div>
                  </div>
                </div>
                
                <div v-else-if="isTeacher && user.teacher" class="border-top pt-3">
                  <h5 class="mb-3">Informations enseignant</h5>
                  <div class="row">
                    <div class="col-md-6 mb-2">
                      <div class="text-muted small">Matière</div>
                      <div>{{ user.teacher.subject || 'Non spécifiée' }}</div>
                    </div>
                    <div class="col-md-6 mb-2">
                      <div class="text-muted small">Téléphone</div>
                      <div>{{ user.teacher.phone || 'Non spécifié' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="row mt-4">
          <div v-if="isStudent" class="col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h5 class="card-title text-muted mb-3">Résultats académiques</h5>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                    <i class="bi bi-award-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h3 class="mb-0">{{ stats.average || '--' }}<small class="text-muted">/20</small></h3>
                    <p class="text-muted mb-0">Moyenne générale</p>
                  </div>
                </div>
                <div class="progress mb-2" style="height: 6px;">
                  <div class="progress-bar bg-primary" :style="'width: ' + (stats.average ? (stats.average / 20 * 100) : 0) + '%'"></div>
                </div>
                <div class="d-flex justify-content-between small text-muted">
                  <span>0</span>
                  <span>20</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h5 class="card-title text-muted mb-3">Cours suivis</h5>
                <div class="d-flex align-items-center">
                  <div class="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                    <i class="bi bi-journal-bookmark-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <h3 class="mb-0">{{ stats.courses || 0 }}</h3>
                    <p class="text-muted mb-0">Cours actifs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import api from '../../services/api'

const authStore = useAuthStore()
const user = ref({})
const stats = ref({
  average: null,
  courses: 0
})

// Récupérer les données du profil
const fetchProfile = async () => {
  try {
    const response = await api.getMe()
    user.value = response.data
    // Chargez les statistiques supplémentaires si nécessaire
    if (user.value.role === 'student') {
      const grades = await api.getStudentGrades(user.value.student.id)
      const avg = await api.getStudentAverage(user.value.student.id)
      stats.value.average = avg.data.average
      stats.value.courses = grades.data.length
    } else if (user.value.role === 'teacher') {
      // Logique pour les enseignants
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
  }
}

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifiée'
  return format(new Date(dateString), 'PPP', { locale: fr })
}

// Formater le rôle
const formatRole = (role) => {
  const roles = {
    'admin': 'Administrateur',
    'teacher': 'Enseignant',
    'student': 'Étudiant'
  }
  return roles[role] || role
}

// Couleur du badge de rôle
const getRoleColor = (role) => {
  const colors = {
    'admin': 'danger',
    'teacher': 'info',
    'student': 'success'
  }
  return colors[role] || 'secondary'
}

// Déterminer le type d'utilisateur
const isAdmin = user.value?.role === 'admin'
const isTeacher = user.value?.role === 'teacher'
const isStudent = user.value?.role === 'student'

// Charger les données au montage du composant
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.badge {
  font-size: 0.8rem;
  padding: 0.35em 0.65em;
}

.bg-primary {
  background-color: #4e73df !important;
}

.bg-success {
  background-color: #1cc88a !important;
}

.bg-info {
  background-color: #36b9cc !important;
}

.bg-warning {
  background-color: #f6c23e !important;
}

.bg-danger {
  background-color: #e74a3b !important;
}
</style>