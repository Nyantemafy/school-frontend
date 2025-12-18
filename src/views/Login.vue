<template>
    <div class="login-container">
        <div class="login-content">
            <div class="row g-0">
                <!-- Left side - Brand/Info -->
                <div class="col-lg-6 d-none d-lg-block">
                    <div class="login-brand-section h-100 p-5">
                        <div class="brand-content">
                            <div class="brand-logo mb-4">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L1 7L12 12L23 7L12 2Z" fill="#3B82F6"/>
                                    <path d="M1 17L12 22L23 17" stroke="#3B82F6" stroke-width="2"/>
                                    <path d="M1 12L12 17L23 12" stroke="#3B82F6" stroke-width="2"/>
                                </svg>
                            </div>
                            <h1 class="text-primary mb-3">ÉcoleSupérieure</h1>
                            <p class="text-muted mb-4">
                                Système de gestion académique professionnel
                            </p>
                            <div class="features-list">
                                <div class="feature-item">
                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                    <span class="text-gray-700">Gestion des étudiants</span>
                                </div>
                                <div class="feature-item">
                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                    <span class="text-gray-700">Suivi des notes</span>
                                </div>
                                <div class="feature-item">
                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                    <span class="text-gray-700">Emploi du temps</span>
                                </div>
                                <div class="feature-item">
                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                    <span class="text-gray-700">Rapports détaillés</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="stats-box mt-5 p-4 bg-light rounded-3">
                            <h6 class="fw-medium mb-3 text-gray-700">
                                <i class="bi bi-graph-up me-2"></i>
                                Statistiques
                            </h6>
                            <div class="row g-2">
                                <div class="col-6">
                                    <small class="text-muted d-block">Étudiants</small>
                                    <span class="fw-bold">25</span>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted d-block">Professeurs</small>
                                    <span class="fw-bold">6</span>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted d-block">Cours</small>
                                    <span class="fw-bold">16</span>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted d-block">Classes</small>
                                    <span class="fw-bold">4</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="login-footer mt-4">
                            <small class="text-muted">
                                © 2024 ÉcoleSupérieure. Tous droits réservés.
                            </small>
                        </div>
                    </div>
                </div>
                
                <!-- Right side - Login Form -->
                <div class="col-lg-6">
                    <div class="login-form-section h-100 p-4 p-md-5">
                        <div class="form-wrapper">
                            <!-- Logo mobile -->
                            <div class="text-center mb-4 d-lg-none">
                                <div class="brand-logo-mobile mb-3">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L1 7L12 12L23 7L12 2Z" fill="#3B82F6"/>
                                        <path d="M1 17L12 22L23 17" stroke="#3B82F6" stroke-width="2"/>
                                        <path d="M1 12L12 17L23 12" stroke="#3B82F6" stroke-width="2"/>
                                    </svg>
                                </div>
                                <h4 class="text-gray-800 fw-bold">ÉcoleSupérieure</h4>
                                <p class="text-muted small">Connexion au système</p>
                            </div>
                            
                            <!-- Form -->
                            <div class="form-container">
                                <div class="form-header mb-4">
                                    <h2 class="fw-bold text-gray-800 mb-2">Bienvenue</h2>
                                    <p class="text-muted mb-0">
                                        Connectez-vous à votre compte
                                    </p>
                                </div>
                                
                                <form @submit.prevent="handleLogin" class="login-form">
                                    <div class="mb-4">
                                        <label class="form-label fw-medium text-gray-700 mb-2">
                                            Adresse email
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-envelope text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="credentials.email" 
                                                type="email" 
                                                class="form-control border-start-0 ps-0"
                                                placeholder="exemple@ecole.fr"
                                                required
                                                :disabled="loading"
                                            >
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <label class="form-label fw-medium text-gray-700">
                                                Mot de passe
                                            </label>
                                            <a href="#" class="text-decoration-none small text-primary">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0">
                                                <i class="bi bi-lock text-muted"></i>
                                            </span>
                                            <input 
                                                v-model="credentials.password" 
                                                :type="showPassword ? 'text' : 'password'"
                                                class="form-control border-start-0 border-end-0"
                                                placeholder="Votre mot de passe"
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
                                    </div>
                                    
                                    <div class="mb-4">
                                        <div class="form-check">
                                            <input 
                                                type="checkbox" 
                                                class="form-check-input" 
                                                id="rememberMe"
                                                v-model="rememberMe"
                                            >
                                            <label class="form-check-label text-muted" for="rememberMe">
                                                Se souvenir de moi
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary btn-lg w-100 py-3 mb-4"
                                        :disabled="loading"
                                        :class="{ 'btn-loading': loading }"
                                    >
                                        <span v-if="!loading">
                                            <i class="bi bi-box-arrow-in-right me-2"></i>
                                            Se connecter
                                        </span>
                                        <span v-else class="d-flex align-items-center justify-content-center">
                                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Connexion...
                                        </span>
                                    </button>
                                    
                                    <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                        <div>{{ error }}</div>
                                    </div>
                                    
                                    <div class="text-center mt-4">
                                        <p class="text-muted mb-0">
                                            Vous n'avez pas de compte ?
                                            <a href="#" class="text-decoration-none fw-medium text-primary">
                                                Contacter l'administration
                                            </a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                            
                            <!-- Demo credentials - Mis à jour avec vos données -->
                            <div class="demo-credentials mt-5 p-4 bg-light rounded-3 border">
                                <h6 class="fw-medium text-gray-700 mb-3 d-flex align-items-center">
                                    <i class="bi bi-key-fill text-primary me-2"></i>
                                    Identifiants de test
                                </h6>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="demo-account p-3 bg-white rounded-2 border">
                                            <div class="d-flex align-items-start mb-2">
                                                <span class="badge bg-danger me-2">Admin</span>
                                                <small class="text-muted">Tous droits</small>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Email</small>
                                                <code class="d-block text-primary">admin@school.com</code>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted d-block">Mot de passe</small>
                                                <code class="d-block text-primary">password</code>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="demo-account p-3 bg-white rounded-2 border">
                                            <div class="d-flex align-items-start mb-2">
                                                <span class="badge bg-info me-2">Professeur</span>
                                                <small class="text-muted">Mathématiques</small>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Email</small>
                                                <code class="d-block text-primary">rakoto@school.com</code>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted d-block">Mot de passe</small>
                                                <code class="d-block text-primary">password</code>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="demo-account p-3 bg-white rounded-2 border">
                                            <div class="d-flex align-items-start mb-2">
                                                <span class="badge bg-success me-2">Étudiant</span>
                                                <small class="text-muted">Classe 6ème</small>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Email</small>
                                                <code class="d-block text-primary">anjara.ravalison@student.school.com</code>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted d-block">Mot de passe</small>
                                                <code class="d-block text-primary">password</code>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="demo-account p-3 bg-white rounded-2 border">
                                            <div class="d-flex align-items-start mb-2">
                                                <span class="badge bg-warning me-2">Autres</span>
                                                <small class="text-muted">Accès disponibles</small>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Plus de comptes</small>
                                                <p class="mb-0 small text-muted">
                                                    <code class="small">ravelo@school.com</code><br>
                                                    <code class="small">anjara.ravalison@student.school.com</code><br>
                                                    <small>Tous utilisent: <code>password</code></small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-3">
                                    <small class="text-muted">
                                        <i class="bi bi-info-circle me-1"></i>
                                        Tous les comptes utilisent le même mot de passe : <code>password</code>
                                    </small>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({ 
    email: '', 
    password: '' 
})
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
    if (loading.value) return
    
    loading.value = true
    error.value = ''
    
    try {
        const success = await authStore.login(credentials.value)
        
        if (success) {
            // Sauvegarder l'email si "se souvenir de moi" est coché
            if (rememberMe.value) {
                localStorage.setItem('rememberedEmail', credentials.value.email)
            } else {
                localStorage.removeItem('rememberedEmail')
            }
            router.push('/')
        } else {
            error.value = 'Email ou mot de passe incorrect. Veuillez réessayer.'
        }
    } catch (err) {
        error.value = 'Une erreur est survenue. Veuillez réessayer plus tard.'
        console.error('Login error:', err)
    } finally {
        loading.value = false
    }
}

// Charger l'email sauvegardé
const loadRememberedEmail = () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
        credentials.value.email = rememberedEmail
        rememberMe.value = true
    }
}

// Charger l'email au montage
loadRememberedEmail()
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    padding: 1rem;
}

.login-content {
    width: 100%;
    max-width: 1200px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    overflow: hidden;
    background: white;
}

.login-brand-section {
    background: white;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.brand-content h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1D4ED8;
}

.features-list {
    margin-top: 2rem;
}

.feature-item {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.feature-item:hover {
    background-color: #f8fafc;
}

.stats-box {
    border: 1px solid #e5e7eb;
}

.stats-box h6 {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.login-form-section {
    display: flex;
    align-items: center;
    background: white;
}

.form-wrapper {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.form-header h2 {
    font-size: 1.75rem;
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

.form-control {
    border: none;
    background-color: white;
    padding: 0.75rem;
}

.form-control:focus {
    box-shadow: none;
    background-color: white;
}

.btn-primary {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover {
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

.brand-logo-mobile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border-radius: 12px;
    padding: 12px;
}

.demo-credentials {
    border: 1px solid #e5e7eb;
}

.demo-account {
    height: 100%;
    transition: all 0.2s;
}

.demo-account:hover {
    border-color: #3B82F6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.demo-account code {
    background: rgba(59, 130, 246, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', 'Roboto Mono', monospace;
    font-size: 0.85rem;
    word-break: break-all;
}

.badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    font-weight: 600;
}

/* Responsive */
@media (max-width: 991.98px) {
    .login-content {
        margin: 0;
        border-radius: 12px;
    }
    
    .login-brand-section,
    .login-form-section {
        padding: 2rem;
    }
}

@media (max-width: 767.98px) {
    .login-container {
        padding: 0;
        background: white;
    }
    
    .login-content {
        box-shadow: none;
        border-radius: 0;
        min-height: 100vh;
    }
    
    .login-form-section {
        padding: 1.5rem;
    }
    
    .demo-credentials {
        margin: 1rem -1.5rem -1.5rem;
        border-left: none;
        border-right: none;
        border-bottom: none;
        border-radius: 0;
    }
}

/* Animation pour les badges */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.badge {
    animation: pulse 2s infinite;
}
</style>