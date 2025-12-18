<template>
    <div class="student-form-container p-4">
        <!-- En-tête -->
        <div class="form-header mb-6">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="mb-2 text-gray-800 fw-bold">
                        <i class="bi bi-person-plus me-2"></i>
                        Nouvel étudiant
                    </h1>
                    <p class="text-muted mb-0">
                        Ajouter un nouvel étudiant au système académique
                    </p>
                </div>
                <div>
                    <button 
                        type="button" 
                        class="btn btn-outline-secondary d-flex align-items-center"
                        @click="router.push('/students')"
                    >
                        <i class="bi bi-arrow-left me-2"></i>
                        Retour
                    </button>
                </div>
            </div>
        </div>

        <!-- Formulaire -->
        <div class="row">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-5">
                        <form @submit.prevent="handleSubmit" class="student-form">
                            <!-- Informations personnelles -->
                            <div class="form-section mb-5">
                                <div class="section-header mb-4">
                                    <h5 class="fw-semibold text-gray-800">
                                        <i class="bi bi-person-vcard text-primary me-2"></i>
                                        Informations personnelles
                                    </h5>
                                    <p class="text-muted mb-0 small">
                                        Renseignez les informations de base de l'étudiant
                                    </p>
                                </div>
                                
                                <div class="row g-3">
                                    <div class="col-md-12">
                                        <label class="form-label fw-medium text-gray-700">
                                            Nom complet
                                            <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-person text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="form.name" 
                                                type="text" 
                                                class="form-control border-start-0"
                                                placeholder="Jean Dupont"
                                                required
                                                :disabled="loading"
                                            >
                                        </div>
                                        <small class="text-muted">Prénom et nom de l'étudiant</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Email académique
                                            <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-envelope text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="form.email" 
                                                type="email" 
                                                class="form-control border-start-0"
                                                placeholder="jean.dupont@student.school.com"
                                                required
                                                :disabled="loading"
                                                @input="generateMatricule"
                                            >
                                        </div>
                                        <small class="text-muted">Adresse email institutionnelle</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Mot de passe
                                            <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-lock text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="form.password" 
                                                :type="showPassword ? 'text' : 'password'"
                                                class="form-control border-start-0 border-end-0"
                                                placeholder="••••••••"
                                                required
                                                :disabled="loading"
                                            >
                                            <button 
                                                type="button" 
                                                class="input-group-text bg-light border-start-0"
                                                @click="showPassword = !showPassword"
                                            >
                                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted">Minimum 8 caractères</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Date de naissance
                                            <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-calendar3 text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="form.date_of_birth" 
                                                type="date" 
                                                class="form-control border-start-0"
                                                :max="maxBirthDate"
                                                required
                                                :disabled="loading"
                                            >
                                        </div>
                                        <small class="text-muted">Âge minimum: 10 ans</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Téléphone
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-telephone text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="form.phone" 
                                                type="tel" 
                                                class="form-control border-start-0"
                                                placeholder="034 XX XXX XX"
                                                :disabled="loading"
                                            >
                                        </div>
                                        <small class="text-muted">Optionnel - Format malgache</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations académiques -->
                            <div class="form-section mb-5">
                                <div class="section-header mb-4">
                                    <h5 class="fw-semibold text-gray-800">
                                        <i class="bi bi-mortarboard text-primary me-2"></i>
                                        Informations académiques
                                    </h5>
                                    <p class="text-muted mb-0 small">
                                        Définissez le parcours académique de l'étudiant
                                    </p>
                                </div>
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Matricule
                                            <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-card-text text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="form.matricule" 
                                                type="text" 
                                                class="form-control border-start-0"
                                                placeholder="STU20240001"
                                                required
                                                :disabled="loading || autoMatricule"
                                            >
                                            <button 
                                                type="button" 
                                                class="input-group-text bg-light border-start-0"
                                                @click="toggleMatriculeMode"
                                                title="Générer automatiquement"
                                            >
                                                <i :class="autoMatricule ? 'bi bi-magic text-primary' : 'bi bi-pen text-muted'"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted">Identifiant unique de l'étudiant</small>
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
                                                :disabled="loading"
                                            >
                                                <option value="">Sélectionnez une classe</option>
                                                <optgroup label="Collège">
                                                    <option value="6ème">6ème</option>
                                                    <option value="5ème">5ème</option>
                                                    <option value="4ème">4ème</option>
                                                    <option value="3ème">3ème</option>
                                                </optgroup>
                                                <optgroup label="Lycée">
                                                    <option value="Seconde">Seconde</option>
                                                    <option value="Première">Première</option>
                                                    <option value="Terminale">Terminale</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <small class="text-muted">Classe d'affectation</small>
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
                                                :disabled="loading"
                                            >
                                                <option value="2024-2025">2024-2025</option>
                                                <option value="2023-2024">2023-2024</option>
                                                <option value="2022-2023">2022-2023</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Statut
                                        </label>
                                        <div class="d-flex gap-3">
                                            <div class="form-check">
                                                <input 
                                                    v-model="form.status" 
                                                    value="active" 
                                                    type="radio" 
                                                    class="form-check-input" 
                                                    id="statusActive"
                                                    :disabled="loading"
                                                >
                                                <label class="form-check-label" for="statusActive">
                                                    <span class="badge bg-success">Actif</span>
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input 
                                                    v-model="form.status" 
                                                    value="inactive" 
                                                    type="radio" 
                                                    class="form-check-input" 
                                                    id="statusInactive"
                                                    :disabled="loading"
                                                >
                                                <label class="form-check-label" for="statusInactive">
                                                    <span class="badge bg-secondary">Inactif</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations additionnelles -->
                            <div class="form-section mb-5">
                                <div class="section-header mb-4">
                                    <h5 class="fw-semibold text-gray-800">
                                        <i class="bi bi-info-circle text-primary me-2"></i>
                                        Informations additionnelles
                                    </h5>
                                    <p class="text-muted mb-0 small">
                                        Informations complémentaires (optionnelles)
                                    </p>
                                </div>
                                
                                <div class="row g-3">
                                    <div class="col-md-12">
                                        <label class="form-label fw-medium text-gray-700">
                                            Adresse
                                        </label>
                                        <textarea 
                                            v-model="form.address" 
                                            class="form-control" 
                                            rows="2"
                                            placeholder="Adresse complète de l'étudiant"
                                            :disabled="loading"
                                        ></textarea>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Nationalité
                                        </label>
                                        <input 
                                            v-model="form.nationality" 
                                            type="text" 
                                            class="form-control"
                                            placeholder="Malagasy"
                                            :disabled="loading"
                                        >
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-medium text-gray-700">
                                            Lieu de naissance
                                        </label>
                                        <input 
                                            v-model="form.place_of_birth" 
                                            type="text" 
                                            class="form-control"
                                            placeholder="Antananarivo"
                                            :disabled="loading"
                                        >
                                    </div>

                                    <div class="col-md-12">
                                        <label class="form-label fw-medium text-gray-700">
                                            Observations
                                        </label>
                                        <textarea 
                                            v-model="form.notes" 
                                            class="form-control" 
                                            rows="3"
                                            placeholder="Notes ou remarques concernant l'étudiant..."
                                            :disabled="loading"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Boutons d'action -->
                            <div class="form-actions border-top pt-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <button 
                                            type="button" 
                                            class="btn btn-outline-danger"
                                            @click="resetForm"
                                            :disabled="loading"
                                        >
                                            <i class="bi bi-x-circle me-2"></i>
                                            Effacer
                                        </button>
                                    </div>
                                    <div class="d-flex gap-3">
                                        <button 
                                            type="button" 
                                            class="btn btn-outline-secondary"
                                            @click="router.push('/students')"
                                            :disabled="loading"
                                        >
                                            Annuler
                                        </button>
                                        <button 
                                            type="submit" 
                                            class="btn btn-primary px-4"
                                            :disabled="loading || !isFormValid"
                                            :class="{ 'btn-loading': loading }"
                                        >
                                            <span v-if="!loading">
                                                <i class="bi bi-check-lg me-2"></i>
                                                Enregistrer l'étudiant
                                            </span>
                                            <span v-else class="d-flex align-items-center">
                                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Enregistrement...
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Messages d'erreur -->
                            <div v-if="error" class="alert alert-danger mt-4 d-flex align-items-center" role="alert">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>{{ error }}</div>
                            </div>

                            <!-- Messages de succès -->
                            <div v-if="success" class="alert alert-success mt-4 d-flex align-items-center" role="alert">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                <div>
                                    Étudiant créé avec succès !
                                    <router-link to="/students" class="alert-link ms-2">
                                        Voir la liste
                                    </router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Sidebar d'aide -->
            <div class="col-lg-4">
                <div class="sticky-top" style="top: 20px;">
                    <!-- Aide -->
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0 fw-semibold">
                                <i class="bi bi-info-circle text-primary me-2"></i>
                                Guide d'utilisation
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="help-list">
                                <div class="help-item mb-3">
                                    <h6 class="fw-medium text-gray-700 mb-2">
                                        <i class="bi bi-check2-circle text-success me-2"></i>
                                        Champ obligatoires
                                    </h6>
                                    <p class="small text-muted mb-0">
                                        Les champs marqués d'un <span class="text-danger">*</span> sont obligatoires.
                                    </p>
                                </div>
                                <div class="help-item mb-3">
                                    <h6 class="fw-medium text-gray-700 mb-2">
                                        <i class="bi bi-key text-warning me-2"></i>
                                        Génération matricule
                                    </h6>
                                    <p class="small text-muted mb-0">
                                        Cliquez sur l'icône <i class="bi bi-magic text-primary"></i> pour générer automatiquement un matricule.
                                    </p>
                                </div>
                                <div class="help-item">
                                    <h6 class="fw-medium text-gray-700 mb-2">
                                        <i class="bi bi-shield-lock text-info me-2"></i>
                                        Sécurité
                                    </h6>
                                    <p class="small text-muted mb-0">
                                        Le mot de passe doit contenir au moins 8 caractères.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Aperçu étudiant -->
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0 fw-semibold">
                                <i class="bi bi-eye text-primary me-2"></i>
                                Aperçu
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="student-preview">
                                <div class="preview-item mb-3">
                                    <small class="text-muted d-block">Nom complet</small>
                                    <span class="fw-medium">{{ form.name || 'Non renseigné' }}</span>
                                </div>
                                <div class="preview-item mb-3">
                                    <small class="text-muted d-block">Matricule</small>
                                    <code class="bg-light px-2 py-1 rounded">{{ form.matricule || 'Non généré' }}</code>
                                </div>
                                <div class="preview-item mb-3">
                                    <small class="text-muted d-block">Classe</small>
                                    <span v-if="form.class" class="badge bg-primary-subtle text-primary">
                                        {{ form.class }}
                                    </span>
                                    <span v-else class="text-muted">Non sélectionnée</span>
                                </div>
                                <div class="preview-item mb-3">
                                    <small class="text-muted d-block">Email</small>
                                    <span class="text-truncate d-block">{{ form.email || 'Non renseigné' }}</span>
                                </div>
                                <div class="preview-item">
                                    <small class="text-muted d-block">Statut</small>
                                    <span v-if="form.status === 'active'" class="badge bg-success">Actif</span>
                                    <span v-else-if="form.status === 'inactive'" class="badge bg-secondary">Inactif</span>
                                    <span v-else class="text-muted">Non défini</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentsStore } from '../../stores/students'

const router = useRouter()
const studentsStore = useStudentsStore()

// Form data
const form = ref({
    name: '',
    email: '',
    password: '',
    matricule: '',
    class: '',
    date_of_birth: '',
    phone: '',
    academic_year: '2024-2025',
    status: 'active',
    address: '',
    nationality: 'Malagasy',
    place_of_birth: '',
    notes: ''
})

// UI states
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const autoMatricule = ref(true)

// Computed properties
const isFormValid = computed(() => {
    return form.value.name && 
           form.value.email && 
           form.value.password && 
           form.value.matricule && 
           form.value.class && 
           form.value.date_of_birth
})

const maxBirthDate = computed(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 10)
    return date.toISOString().split('T')[0]
})

// Methods
const generateMatricule = () => {
    if (!autoMatricule.value) return
    
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    form.value.matricule = `STU${year}${random}`
}

const toggleMatriculeMode = () => {
    autoMatricule.value = !autoMatricule.value
    if (autoMatricule.value) {
        generateMatricule()
    } else {
        form.value.matricule = ''
    }
}

const resetForm = () => {
    if (!confirm('Voulez-vous vraiment effacer tous les champs du formulaire ?')) {
        return
    }
    
    Object.keys(form.value).forEach(key => {
        if (key === 'academic_year') {
            form.value[key] = '2024-2025'
        } else if (key === 'status') {
            form.value[key] = 'active'
        } else if (key === 'nationality') {
            form.value[key] = 'Malagasy'
        } else {
            form.value[key] = ''
        }
    })
    
    if (autoMatricule.value) {
        generateMatricule()
    }
    
    error.value = ''
    success.value = false
}

const handleSubmit = async () => {
    if (!isFormValid.value) {
        error.value = 'Veuillez remplir tous les champs obligatoires.'
        return
    }
    
    if (form.value.password.length < 8) {
        error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
        return
    }
    
    loading.value = true
    error.value = ''
    success.value = false
    
    try {
        const successResult = await studentsStore.createStudent(form.value)
        
        if (successResult) {
            success.value = true
            // Redirection automatique après 2 secondes
            setTimeout(() => {
                router.push('/students')
            }, 2000)
        } else {
            error.value = 'Une erreur est survenue lors de la création de l\'étudiant.'
        }
    } catch (err) {
        error.value = 'Erreur: ' + (err.message || 'Veuillez réessayer.')
        console.error('Erreur création étudiant:', err)
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    generateMatricule()
})
</script>

<style scoped>
.student-form-container {
    background-color: #f8fafc;
    min-height: 100vh;
}

.form-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.form-section {
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.section-header {
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
}

.input-group {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.input-group:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group-text {
    border: none;
    background-color: #f8fafc;
    color: #6b7280;
}

.form-control, .form-select {
    border: none;
    background-color: white;
    padding: 0.75rem;
}

.form-control:focus, .form-select:focus {
    box-shadow: none;
    background-color: white;
}

textarea.form-control {
    min-height: 100px;
}

.form-check-input:checked {
    background-color: #3B82F6;
    border-color: #3B82F6;
}

.form-actions {
    border-top: 2px solid #e5e7eb;
}

.btn-primary {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
    opacity: 0.7;
    transform: none !important;
}

.btn-loading {
    position: relative;
}

.btn-outline-secondary:hover {
    background-color: #f8fafc;
    border-color: #d1d5db;
}

.btn-outline-danger:hover {
    background-color: #fee2e2;
    border-color: #ef4444;
    color: #ef4444;
}

/* Help sidebar */
.help-list .help-item {
    padding: 0.75rem;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.help-list .help-item:hover {
    background-color: #f8fafc;
}

/* Student preview */
.student-preview .preview-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.student-preview .preview-item:last-child {
    border-bottom: none;
}

.bg-primary-subtle {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
}

code {
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 991.98px) {
    .form-header {
        flex-direction: column;
        align-items: flex-start !important;
    }
    
    .form-header .d-flex {
        margin-top: 1rem;
        width: 100%;
        justify-content: space-between;
    }
    
    .form-actions {
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-actions > div {
        width: 100%;
        justify-content: space-between !important;
    }
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.student-form-container > * {
    animation: fadeIn 0.5s ease-out;
}

/* Loading overlay */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Loading overlay */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Loading overlay */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Reusable loading spinner component */
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Reusable loading spinner component */
.loading-spinner-large {
    width: 60px;
    height: 60px;
    border: 5px solid #e5e7eb;
    border-top: 5px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
}

/* Reusable loading spinner component - small */
.loading-spinner-small {
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Reusable loading spinner component - extra small */
.loading-spinner-xs {
    width: 12px;
    height: 12px;
    border: 1.5px solid #e5e7eb;
    border-top: 1.5px solid #3B82F6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* Reusable loading spinner component - mini */
.loading-spinner-mini {
    width: 8px;
    height: 8px;
    border: 1px solid #e5e7eb;
    border-top: 1px solid #3B82F6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

/* Reusable loading spinner component - tiny */
.loading-spinner-tiny {
    width: 6px;
    height: 6px;
    border: 1px solid #e5e7eb;
    border-top: 1px solid #3B82F6;
    border-radius: 50%;
    animation: spin 0.5s linear infinite;
}

/* Reusable loading spinner component - custom size */
.loading-spinner-custom {
    /* Default values - can be overridden with inline styles */
    width: 24px;
    height: 24px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3B82F6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
</style>