<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0">Nouveau Cours</h1>
          <router-link to="/courses" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>Retour à la liste
          </router-link>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <form @submit.prevent="submitForm">
              <!-- Nom du cours -->
              <div class="mb-4">
                <label for="name" class="form-label fw-semibold">Nom du cours <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  id="name" 
                  v-model="course.name" 
                  required
                  placeholder="Ex: Mathématiques avancées"
                >
                <div class="form-text">Le nom complet du cours</div>
              </div>

              <!-- Code du cours -->
              <div class="row">
                <div class="col-md-6 mb-4">
                  <label for="code" class="form-label fw-semibold">Code du cours <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="code" 
                    v-model="course.code" 
                    required
                    placeholder="Ex: MATH101"
                    maxlength="10"
                  >
                  <div class="form-text">Code unique d'identification du cours</div>
                </div>

                <!-- Crédits -->
                <div class="col-md-6 mb-4">
                  <label for="credits" class="form-label fw-semibold">Crédits <span class="text-danger">*</span></label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="credits" 
                    v-model.number="course.credits" 
                    min="1"
                    max="10"
                    required
                  >
                  <div class="form-text">Nombre de crédits (1-10)</div>
                </div>

                <!-- Classe -->
                <div class="mb-4">
                <label for="class" class="form-label fw-semibold">Classe <span class="text-danger">*</span></label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="class" 
                    v-model="course.class" 
                    required
                    placeholder="Ex: L1, M1, etc."
                >
                </div>

                <!-- Coefficient -->
                <div class="mb-4">
                <label for="coefficient" class="form-label fw-semibold">Coefficient <span class="text-danger">*</span></label>
                <input 
                    type="number" 
                    class="form-control" 
                    id="coefficient" 
                    v-model.number="course.coefficient"
                    min="1"
                    required
                >
                <div class="form-text">Le coefficient du cours (1 par défaut)</div>
                </div>

              </div>

              <!-- Description -->
              <div class="mb-4">
                <label for="description" class="form-label fw-semibold">Description</label>
                <textarea 
                  class="form-control" 
                  id="description" 
                  v-model="course.description" 
                  rows="4"
                  placeholder="Décrivez le contenu du cours, les objectifs d'apprentissage, etc."
                ></textarea>
              </div>

              <!-- Enseignant responsable -->
              <div class="mb-4">
                <label for="teacher" class="form-label fw-semibold">Enseignant responsable <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  id="teacher" 
                  v-model="course.teacher_id" 
                  required
                >
                  <option value="" disabled>Sélectionner un enseignant</option>
                  <option 
                    v-for="teacher in teachers" 
                    :key="teacher.id" 
                    :value="teacher.id"
                  >
                    {{ teacher.name || 'Enseignant sans nom' }}
                    <template v-if="teacher.email">({{ teacher.email }})</template>
                  </option>
                </select>
              </div>

              <!-- Statut du cours -->
              <div class="mb-4">
                <label class="form-label fw-semibold d-block">Statut du cours</label>
                <div class="form-check form-check-inline">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    id="status_active" 
                    value="active" 
                    v-model="course.status"
                  >
                  <label class="form-check-label" for="status_active">Actif</label>
                </div>
                <div class="form-check form-check-inline">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    id="status_inactive" 
                    value="inactive" 
                    v-model="course.status"
                  >
                  <label class="form-check-label" for="status_inactive">Inactif</label>
                </div>
              </div>

              <div class="d-flex justify-content-between mt-5">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="resetForm"
                >
                  <i class="bi bi-x-lg me-2"></i>Annuler
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary px-4"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-save me-2"></i>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer le cours' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

// État du formulaire
const loading = ref(false);
const teachers = ref([]);

const course = ref({
  name: '',
  code: '',
  description: '',
  credits: 3,
  teacher_id: '',
  status: 'active',
  class: '',        
  coefficient: 1    
});

// Charger la liste des utilisateurs et filtrer les enseignants
const loadTeachers = async () => {
  try {
    // Récupérer tous les utilisateurs
    const response = await api.getUsers();
    
    // Filtrer pour ne garder que les enseignants
    teachers.value = response.data.filter(user => user.role === 'teacher');
    
    console.log('Enseignants chargés:', teachers.value);
    
    if (teachers.value.length === 0) {
      console.warn('Aucun enseignant trouvé avec le rôle "teacher"');
      toast.warning('Aucun enseignant trouvé. Veuillez d\'abord créer des comptes enseignants.');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des enseignants:', error);
    if (error.response) {
      console.error('Détails de l\'erreur:', error.response.data);
    }
    toast.error('Impossible de charger la liste des enseignants: ' + (error.response?.data?.message || error.message));
  }
};

// Soumission du formulaire
const submitForm = async () => {
  try {
    loading.value = true;
    
    // Préparer les données du cours
    const courseData = {
        name: course.value.name,
        code: course.value.code,
        description: course.value.description,
        teacher_id: course.value.teacher_id,
        class: course.value.class,
        coefficient: course.value.coefficient
    };

    console.log('Données du cours à envoyer:', courseData);
    
    await api.createCourse(courseData);
    
    toast.success('Le cours a été créé avec succès');
    router.push('/courses');
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    
    let errorMessage = 'Une erreur est survenue lors de la création du cours';
    if (error.response?.data?.errors) {
      // Afficher les erreurs de validation
      const errors = Object.values(error.response.data.errors).flat();
      errorMessage = errors.join('\n');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  course.value = {
    name: '',
    code: '',
    description: '',
    credits: 3,
    teacher_id: '',
    status: 'active'
  };
};

// Charger les données initiales
onMounted(() => {
  loadTeachers();
});
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.form-control, .form-select {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.btn {
  border-radius: 0.5rem;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn i {
  font-size: 1.1em;
  line-height: 1;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.text-danger {
  color: #dc3545;
}

.form-text {
  font-size: 0.85rem;
  color: #6c757d;
}

/* Animation de chargement */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-border {
  animation: spin 0.75s linear infinite;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: -0.125em;
  border: 0.15em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
}
</style>
