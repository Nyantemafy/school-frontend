<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">🎓 Connexion</h3>
                <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input 
                    v-model="credentials.email" 
                    type="email" 
                    class="form-control" 
                    required
                    >
                </div>
                <div class="mb-3">
                    <label class="form-label">Mot de passe</label>
                    <input 
                    v-model="credentials.password" 
                    type="password" 
                    class="form-control" 
                    required
                    >
                </div>
                <button 
                    type="submit" 
                    class="btn btn-primary w-100"
                    :disabled="loading"
                >
                    {{ loading ? 'Connexion...' : 'Se connecter' }}
                </button>
                </form>
                <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
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

const credentials = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
    loading.value = true
    error.value = ''
    
    const success = await authStore.login(credentials.value)
    
    if (success) {
        router.push('/')
    } else {
        error.value = 'Email ou mot de passe incorrect'
    }
    
    loading.value = false
}
</script>