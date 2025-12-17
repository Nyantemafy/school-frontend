<template>
    <div class="p-4">
        <div class="d-flex justify-content-between mb-4">
        <h2>👥 Gestion des Utilisateurs</h2>
        <button class="btn btn-primary" @click="showModal = true">
            ➕ Ajouter un utilisateur
        </button>
        </div>

        <!-- Filtres -->
        <div class="card mb-4">
        <div class="card-body">
            <div class="row">
            <div class="col-md-4">
                <select v-model="filterRole" class="form-select">
                <option value="">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Professeur</option>
                <option value="student">Étudiant</option>
                <option value="parent">Parent</option>
                </select>
            </div>
            <div class="col-md-4">
                <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Rechercher par nom ou email..."
                >
            </div>
            </div>
        </div>
        </div>

        <!-- Tableau des utilisateurs -->
        <div class="card">
        <div class="card-body">
            <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date création</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>
                    <strong>{{ user.name }}</strong>
                    <br>
                    <small v-if="user.student" class="text-muted">
                        Matricule: {{ user.student.matricule }}
                    </small>
                    <small v-if="user.teacher" class="text-muted">
                        Matière: {{ user.teacher.subject }}
                    </small>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                    <span :class="'badge ' + getRoleBadge(user.role)">
                        {{ getRoleLabel(user.role) }}
                    </span>
                    </td>
                    <td>{{ formatDate(user.created_at) }}</td>
                    <td>
                    <div class="btn-group">
                        <button 
                        class="btn btn-sm btn-info"
                        @click="changeRole(user)"
                        title="Changer le rôle"
                        >
                        🔄
                        </button>
                        <button 
                        class="btn btn-sm btn-warning"
                        @click="editUser(user)"
                        title="Modifier"
                        >
                        ✏️
                        </button>
                        <button 
                        class="btn btn-sm btn-danger"
                        @click="deleteUser(user.id)"
                        title="Supprimer"
                        :disabled="user.id === currentUserId"
                        >
                        🗑️
                        </button>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </div>

        <!-- Modal Ajout/Modification -->
        <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5>{{ editing ? 'Modifier' : 'Ajouter' }} un utilisateur</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label class="form-label">Nom complet *</label>
                    <input v-model="form.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input v-model="form.email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">
                    Mot de passe {{ editing ? '(laisser vide pour ne pas changer)' : '*' }}
                    </label>
                    <input 
                    v-model="form.password" 
                    type="password" 
                    class="form-control"
                    :required="!editing"
                    minlength="6"
                    >
                </div>
                <div class="mb-3">
                    <label class="form-label">Rôle *</label>
                    <select v-model="form.role" class="form-select" required>
                    <option value="">-- Sélectionner --</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Professeur</option>
                    <option value="student">Étudiant</option>
                    <option value="parent">Parent</option>
                    </select>
                </div>

                <!-- Champs spécifiques professeur -->
                <div v-if="form.role === 'teacher'" class="mb-3">
                    <label class="form-label">Matière enseignée *</label>
                    <input v-model="form.subject" type="text" class="form-control" required>
                </div>

                <div v-if="form.role === 'teacher'" class="mb-3">
                    <label class="form-label">Téléphone</label>
                    <input v-model="form.phone" type="tel" class="form-control">
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="submitting">
                    {{ submitting ? 'Enregistrement...' : 'Enregistrer' }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="closeModal">
                    Annuler
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>

        <!-- Modal Changement de rôle -->
        <div v-if="showRoleModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5>Changer le rôle de {{ selectedUser?.name }}</h5>
                <button type="button" class="btn-close" @click="showRoleModal = false"></button>
            </div>
            <div class="modal-body">
                <select v-model="newRole" class="form-select">
                <option value="admin">Admin</option>
                <option value="teacher">Professeur</option>
                <option value="student">Étudiant</option>
                <option value="parent">Parent</option>
                </select>
                <div class="mt-3">
                <button class="btn btn-primary" @click="confirmRoleChange">
                    Confirmer
                </button>
                <button class="btn btn-secondary ms-2" @click="showRoleModal = false">
                    Annuler
                </button>
                </div>
            </div>
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
const currentUserId = computed(() => authStore.user?.id)

const users = ref([])
const showModal = ref(false)
const showRoleModal = ref(false)
const editing = ref(null)
const submitting = ref(false)
const filterRole = ref('')
const searchQuery = ref('')
const selectedUser = ref(null)
const newRole = ref('')

const form = ref({
    name: '',
    email: '',
    password: '',
    role: '',
    subject: '',
    phone: ''
})

const filteredUsers = computed(() => {
    return users.value.filter(user => {
        const matchRole = !filterRole.value || user.role === filterRole.value
        const matchSearch = !searchQuery.value || 
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        return matchRole && matchSearch
    })
})

const loadUsers = async () => {
    try {
        const { data } = await api.getUsers()
        users.value = data
    } catch (error) {
        console.error('Erreur chargement utilisateurs:', error)
    }
}

const handleSubmit = async () => {
    submitting.value = true
    try {
        if (editing.value) {
        await api.updateUser(editing.value, form.value)
        } else {
        await api.createUser(form.value)
        }
        await loadUsers()
        closeModal()
    } catch (error) {
        alert('Erreur: ' + (error.response?.data?.message || 'Erreur lors de l\'enregistrement'))
    } finally {
        submitting.value = false
    }
}

const editUser = (user) => {
    editing.value = user.id
    form.value = {
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        subject: user.teacher?.subject || '',
        phone: user.teacher?.phone || ''
    }
    showModal.value = true
}

const changeRole = (user) => {
    selectedUser.value = user
    newRole.value = user.role
    showRoleModal.value = true
}

const confirmRoleChange = async () => {
    try {
        await api.changeUserRole(selectedUser.value.id, { role: newRole.value })
        await loadUsers()
        showRoleModal.value = false
    } catch (error) {
        alert('Erreur lors du changement de rôle')
    }
}

const deleteUser = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    
    try {
        await api.deleteUser(id)
        await loadUsers()
    } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la suppression')
    }
}

const closeModal = () => {
    showModal.value = false
    editing.value = null
    form.value = {
        name: '',
        email: '',
        password: '',
        role: '',
        subject: '',
        phone: ''
    }
}

const getRoleBadge = (role) => {
    const badges = {
        admin: 'bg-danger',
        teacher: 'bg-primary',
        student: 'bg-success',
        parent: 'bg-info'
    }
    return badges[role] || 'bg-secondary'
}

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Admin',
        teacher: 'Professeur',
        student: 'Étudiant',
        parent: 'Parent'
    }
    return labels[role] || role
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR')
}

onMounted(() => {
    loadUsers()
})
</script>