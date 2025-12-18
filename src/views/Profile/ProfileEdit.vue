<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Modifier mon profil</h4>
              <router-link to="/profile" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Retour
              </router-link>
            </div>
          </div>
          
          <div class="card-body p-4">
            <form @submit.prevent="updateProfile">
              <div class="row mb-4">
                <div class="col-md-4 text-center">
                  <div class="position-relative d-inline-block mb-3">
                    <img :src="form.avatar || 'https://ui-avatars.com/api/?name=' + form.name + '&background=random'"
                         class="rounded-circle border" 
                         width="150" 
                         height="150"
                         alt="Photo de profil">
                    <input type="file" 
                           ref="fileInput" 
                           class="d-none" 
                           accept="image/*"
                           @change="handleFileUpload">
                    <button type="button" 
                            class="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 border"
                            @click="$refs.fileInput.click()">
                      <i class="bi bi-camera"></i>
                    </button>
                  </div>
                  <div v-if="uploading" class="progress" style="height: 5px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                         role="progressbar" 
                         :style="'width: ' + uploadProgress + '%'">
                    </div>
                  </div>
                </div>
                
                <div class="col-md-8">
                  <div class="mb-3">
                    <label class="form-label">Nom complet</label>
                    <input type="text" class="form-control" v-model="form.name" required>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Adresse email</label>
                    <input type="email" class="form-control" v-model="form.email" required>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Téléphone</label>
                    <input type="tel" class="form-control" v-model="form.phone">
                  </div>
                  
                  <div v-if="isStudent" class="mb-3">
                    <label class="form-label">Date de naissance</label>
                    <input type="date" class="form-control" v-model="form.date_of_birth">
                  </div>
                  
                  <div v-if="isTeacher" class="mb-3">
                    <label class="form-label">Matière enseignée</label>
                    <input type="text" class="form-control" v-model="form.subject">
                  </div>
                </div>
              </div>
              
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-danger" @click="showChangePassword = !showChangePassword">
                  <i class="bi bi-key me-1"></i> Changer le mot de passe
                </button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  Enregistrer les modifications
                </button>
              </div>
              
              <!-- Formulaire de changement de mot de passe -->
              <div v-if="showChangePassword" class="mt-4 p-3 border rounded">
                <h5 class="mb-3">Changer le mot de passe</h5>
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label">Mot de passe actuel</label>
                    <input type="password" class="form-control" v-model="password.current_password" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Nouveau mot de passe</label>
                    <input type="password" class="form-control" v-model="password.new_password" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Confirmer le mot de passe</label>
                    <input type="password" class="form-control" v-model="password.confirm_password" required>
                  </div>
                </div>
                <div class="mt-2">
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="updatePassword">
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const showChangePassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  avatar: null,
  // Champs spécifiques aux étudiants
  date_of_birth: '',
  // Champs spécifiques aux enseignants
  subject: ''
})

const password = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Charger les données du profil
const loadProfile = async () => {
  try {
    const response = await api.getMe()
    const user = response.data
    form.name = user.name
    form.email = user.email
    form.phone = user.phone
    form.avatar = user.avatar
    
    if (user.role === 'student' && user.student) {
      form.date_of_birth = user.student.date_of_birth
    }
    
    if (user.role === 'teacher' && user.teacher) {
      form.subject = user.teacher.subject
      form.phone = user.teacher.phone
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    toast.error('Erreur lors du chargement du profil')
  }
}

// Mettre à jour le profil
const updateProfile = async () => {
  try {
    loading.value = true;
    const data = { ...form };
    
    let response;
    if (authStore.user.role === 'student' && authStore.user.student) {
      response = await api.updateStudent(authStore.user.student.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        class: data.class // Assurez-vous d'envoyer la classe si nécessaire
      });
    } else if (authStore.user.role === 'teacher' && authStore.user.teacher) {
      response = await api.updateTeacher(authStore.user.teacher.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject
      });
    } else {
      response = await api.updateUser(authStore.user.id, {
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    }
    
    // Mettre à jour le store avec la réponse directe au lieu de recharger
    authStore.user = { ...authStore.user, ...response.data };
    if (authStore.user.role === 'student' && response.data.user) {
      authStore.user = { ...authStore.user, ...response.data.user };
    }
    
    toast.success('Profil mis à jour avec succès');
    await router.push({ name: 'Profile' });
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
  } finally {
    loading.value = false;
  }
};

// Mettre à jour le mot de passe
const updatePassword = async () => {
  try {
    if (password.new_password !== password.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    
    await api.updatePassword({
      current_password: password.current_password,
      new_password: password.new_password,
      confirm_password: password.confirm_password
    })
    
    toast.success('Mot de passe mis à jour avec succès')
    showChangePassword.value = false
    Object.keys(password).forEach(key => { password[key] = '' })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error)
    toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe')
  }
}

// Gérer le téléchargement de fichier
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('avatar', file)
  
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    const response = await api.uploadAvatar(formData, {
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
      }
    })
    
    form.avatar = response.data.url
    await authStore.fetchUser()
    toast.success('Photo de profil mise à jour avec succès')
  } catch (error) {
    console.error('Erreur lors du téléchargement de la photo:', error)
    toast.error('Erreur lors du téléchargement de la photo')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Déterminer le type d'utilisateur
const isAdmin = authStore.user?.role === 'admin'
const isTeacher = authStore.user?.role === 'teacher'
const isStudent = authStore.user?.role === 'student'

// Charger les données au montage du composant
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.avatar-upload {
  position: relative;
  display: inline-block;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.avatar-upload-btn:hover {
  background: #f8f9fa;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>