<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-white py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Paramètres</h4>
            </div>
          </div>
          
          <div class="card-body p-4">
            <ul class="nav nav-tabs mb-4" id="settingsTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="account-tab" data-bs-toggle="tab" data-bs-target="#account" type="button" role="tab">
                  <i class="bi bi-person me-2"></i>Compte
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="notifications-tab" data-bs-toggle="tab" data-bs-target="#notifications" type="button" role="tab">
                  <i class="bi bi-bell me-2"></i>Notifications
                </button>
              </li>
              <li v-if="isAdmin" class="nav-item" role="presentation">
                <button class="nav-link" id="system-tab" data-bs-toggle="tab" data-bs-target="#system" type="button" role="tab">
                  <i class="bi bi-gear me-2"></i>Système
                </button>
              </li>
            </ul>

            <div class="tab-content" id="settingsTabsContent">
              <!-- Onglet Compte -->
              <div class="tab-pane fade show active" id="account" role="tabpanel">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title mb-4">Paramètres du compte</h5>
                    
                    <div class="mb-4">
                      <div class="d-flex align-items-center mb-3">
                        <div class="position-relative me-3">
                          <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name" 
                               class="rounded-circle border" 
                               width="80" 
                               height="80"
                               alt="Photo de profil">
                          <button class="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 border"
                                  @click="triggerFileInput">
                            <i class="bi bi-camera"></i>
                          </button>
                          <input type="file" 
                                 ref="avatarInput" 
                                 class="d-none" 
                                 accept="image/*"
                                 @change="handleAvatarUpload">
                        </div>
                        <div>
                          <h6 class="mb-1">{{ user.name }}</h6>
                          <p class="text-muted mb-0">{{ user.email }}</p>
                          <small class="text-muted">{{ formatRole(user.role) }}</small>
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Thème de l'application</label>
                      <select class="form-select" v-model="settings.theme">
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="system">Système</option>
                      </select>
                    </div>

                    <div class="form-check form-switch mb-3">
                      <input class="form-check-input" type="checkbox" id="emailNotifications" v-model="settings.emailNotifications">
                      <label class="form-check-label" for="emailNotifications">Activer les notifications par email</label>
                    </div>

                    <div class="d-flex justify-content-end">
                      <button class="btn btn-primary" @click="saveSettings" :disabled="saving">
                        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Onglet Notifications -->
              <div class="tab-pane fade" id="notifications" role="tabpanel">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title mb-4">Préférences de notification</h5>
                    
                    <div class="mb-4">
                      <h6 class="mb-3">Email</h6>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="emailGrades" v-model="notificationSettings.email.grades">
                        <label class="form-check-label" for="emailGrades">Nouvelles notes</label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="emailAnnouncements" v-model="notificationSettings.email.announcements">
                        <label class="form-check-label" for="emailAnnouncements">Annonces</label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="emailMessages" v-model="notificationSettings.email.messages">
                        <label class="form-check-label" for="emailMessages">Messages privés</label>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6 class="mb-3">Notification dans l'application</h6>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="appGrades" v-model="notificationSettings.app.grades">
                        <label class="form-check-label" for="appGrades">Nouvelles notes</label>
                      </div>
                      <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="appAnnouncements" v-model="notificationSettings.app.announcements">
                        <label class="form-check-label" for="appAnnouncements">Annonces</label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="appMessages" v-model="notificationSettings.app.messages">
                        <label class="form-check-label" for="appMessages">Messages privés</label>
                      </div>
                    </div>

                    <div class="d-flex justify-content-end">
                      <button class="btn btn-primary" @click="saveNotificationSettings" :disabled="saving">
                        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                        Enregistrer les préférences
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Onglet Système (Admin uniquement) -->
              <div v-if="isAdmin" class="tab-pane fade" id="system" role="tabpanel">
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title mb-4">Paramètres système</h5>
                    
                    <div class="alert alert-warning">
                      <i class="bi bi-exclamation-triangle-fill me-2"></i>
                      Ces paramètres affectent tous les utilisateurs du système. Utilisez avec prudence.
                    </div>

                    <div class="mb-4">
                      <h6>Maintenance</h6>
                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="maintenanceMode" v-model="systemSettings.maintenanceMode">
                        <label class="form-check-label" for="maintenanceMode">Mode maintenance</label>
                        <div class="form-text">Le site sera inaccessible pour les utilisateurs normaux</div>
                      </div>

                      <div v-if="systemSettings.maintenanceMode" class="mb-3">
                        <label class="form-label">Message de maintenance</label>
                        <textarea class="form-control" v-model="systemSettings.maintenanceMessage" rows="3"></textarea>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6>Sécurité</h6>
                      <div class="mb-3">
                        <label class="form-label">Durée de session (minutes)</label>
                        <input type="number" class="form-control" v-model.number="systemSettings.sessionTimeout">
                      </div>
                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="force2fa" v-model="systemSettings.force2FA">
                        <label class="form-check-label" for="force2fa">Forcer l'authentification à deux facteurs</label>
                      </div>
                    </div>

                    <div class="d-flex justify-content-end">
                      <button class="btn btn-danger me-2" @click="resetSystemSettings">
                        Réinitialiser
                      </button>
                      <button class="btn btn-primary" @click="saveSystemSettings" :disabled="saving">
                        <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                        Enregistrer les paramètres
                      </button>
                    </div>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const authStore = useAuthStore()
const router = useRouter()
const saving = ref(false)
const avatarInput = ref(null)

// Données utilisateur
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Paramètres utilisateur
const settings = reactive({
  theme: 'light',
  emailNotifications: true
})

// Paramètres de notification
const notificationSettings = reactive({
  email: {
    grades: true,
    announcements: true,
    messages: true
  },
  app: {
    grades: true,
    announcements: true,
    messages: true
  }
})

// Paramètres système (admin uniquement)
const systemSettings = reactive({
  maintenanceMode: false,
  maintenanceMessage: 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
  sessionTimeout: 120,
  force2FA: false
})

// Formater le rôle pour l'affichage
const formatRole = (role) => {
  const roles = {
    'admin': 'Administrateur',
    'teacher': 'Enseignant',
    'student': 'Étudiant'
  }
  return roles[role] || role
}

// Déclencher la sélection de fichier pour l'avatar
const triggerFileInput = () => {
  avatarInput.value?.click()
}

// Gérer le téléchargement de l'avatar
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    saving.value = true
    const response = await api.uploadAvatar(formData)
    await authStore.fetchUser()
    toast.success('Photo de profil mise à jour avec succès')
  } catch (error) {
    console.error('Erreur lors du téléchargement de la photo:', error)
    toast.error('Erreur lors du téléchargement de la photo')
  } finally {
    saving.value = false
    event.target.value = null
  }
}

// Charger les paramètres
const loadSettings = async () => {
  try {
    const response = await api.getUserSettings()
    Object.assign(settings, response.data.settings || {})
    Object.assign(notificationSettings, response.data.notificationSettings || {})
    if (isAdmin.value) {
      Object.assign(systemSettings, response.data.systemSettings || {})
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
    toast.error('Erreur lors du chargement des paramètres')
  }
}

// Enregistrer les paramètres généraux
const saveSettings = async () => {
  try {
    saving.value = true
    await api.updateUserSettings({ settings })
    toast.success('Paramètres enregistrés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error)
    toast.error('Erreur lors de la sauvegarde des paramètres')
  } finally {
    saving.value = false
  }
}

// Enregistrer les paramètres de notification
const saveNotificationSettings = async () => {
  try {
    saving.value = true
    await api.updateNotificationSettings(notificationSettings)
    toast.success('Préférences de notification enregistrées')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error)
    toast.error('Erreur lors de la sauvegarde des préférences')
  } finally {
    saving.value = false
  }
}

// Enregistrer les paramètres système
const saveSystemSettings = async () => {
  if (!isAdmin.value) return

  try {
    saving.value = true
    await api.updateSystemSettings(systemSettings)
    toast.success('Paramètres système mis à jour')
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres système:', error)
    toast.error('Erreur lors de la mise à jour des paramètres système')
  } finally {
    saving.value = false
  }
}

// Réinitialiser les paramètres système
const resetSystemSettings = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres système aux valeurs par défaut ?')) {
    Object.assign(systemSettings, {
      maintenanceMode: false,
      maintenanceMessage: 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
      sessionTimeout: 120,
      force2FA: false
    })
  }
}

// Charger les paramètres au montage du composant
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  font-weight: 600;
}

.card {
  border-radius: 0.75rem;
}

.form-switch .form-check-input {
  width: 2.5em;
  margin-left: -2.5em;
}

.avatar-upload {
  position: relative;
  display: inline-block;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
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
</style>