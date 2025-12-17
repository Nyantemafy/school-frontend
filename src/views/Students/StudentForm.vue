<template>
    <div class="p-4">
        <h2 class="mb-4">Ajouter un Étudiant</h2>
        <form @submit.prevent="handleSubmit" class="col-md-6">
        <div class="mb-3">
            <label class="form-label">Nom complet</label>
            <input v-model="form.name" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Mot de passe</label>
            <input v-model="form.password" type="password" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Matricule</label>
            <input v-model="form.matricule" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Classe</label>
            <select v-model="form.class" class="form-select" required>
            <option value="6ème">6ème</option>
            <option value="5ème">5ème</option>
            <option value="4ème">4ème</option>
            <option value="3ème">3ème</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Date de naissance</label>
            <input v-model="form.date_of_birth" type="date" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <router-link to="/students" class="btn btn-secondary ms-2">Annuler</router-link>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentsStore } from '../../stores/students'

const router = useRouter()
const studentsStore = useStudentsStore()

const form = ref({
    name: '',
    email: '',
    password: '',
    matricule: '',
    class: '',
    date_of_birth: ''
})

const handleSubmit = async () => {
    const success = await studentsStore.createStudent(form.value)
    if (success) {
        router.push('/students')
    }
}
</script>