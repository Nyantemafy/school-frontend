<template>
    <div class="p-4">
        <div class="d-flex justify-content-between mb-4">
        <h2>📚 Gestion des Cours</h2>
        <button 
            v-if="isAdmin"
            class="btn btn-primary" 
            @click="showModal = true"
        >
            ➕ Ajouter un cours
        </button>
        </div>

        <div class="table-responsive">
        <table class="table table-hover">
            <thead>
            <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Professeur</th>
                <th>Classe</th>
                <th>Coefficient</th>
                <th>Étudiants</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="course in courses" :key="course.id">
                <td><strong>{{ course.code }}</strong></td>
                <td>{{ course.name }}</td>
                <td>{{ course.teacher?.user?.name }}</td>
                <td><span class="badge bg-info">{{ course.class }}</span></td>
                <td>{{ course.coefficient }}</td>
                <td>{{ course.students?.length || 0 }}</td>
                <td>
                <button 
                    class="btn btn-sm btn-info me-2"
                    @click="viewStudents(course)"
                >
                    👥 Étudiants
                </button>
                <button 
                    v-if="isAdmin"
                    class="btn btn-sm btn-warning me-2"
                    @click="editCourse(course)"
                >
                    ✏️
                </button>
                <button 
                    v-if="isAdmin"
                    class="btn btn-sm btn-danger"
                    @click="deleteCourse(course.id)"
                >
                    🗑️
                </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

        <!-- Modal Ajout/Modification -->
        <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5>{{ editing ? 'Modifier' : 'Ajouter' }} un cours</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label class="form-label">Code *</label>
                    <input v-model="form.code" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nom *</label>
                    <input v-model="form.name" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Professeur *</label>
                    <select v-model="form.teacher_id" class="form-select" required>
                    <option value="">-- Sélectionner --</option>
                    <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                        {{ teacher.user.name }}
                    </option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Classe *</label>
                    <select v-model="form.class" class="form-select" required>
                    <option value="6ème">6ème</option>
                    <option value="5ème">5ème</option>
                    <option value="4ème">4ème</option>
                    <option value="3ème">3ème</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Coefficient *</label>
                    <input v-model.number="form.coefficient" type="number" class="form-control" min="1" required>
                </div>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                </form>
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
const isAdmin = computed(() => authStore.isAdmin)

const courses = ref([])
const teachers = ref([])
const showModal = ref(false)
const editing = ref(null)

const form = ref({
    code: '',
    name: '',
    teacher_id: '',
    class: '',
    coefficient: 1
})

const loadCourses = async () => {
    const { data } = await api.getCourses()
    courses.value = data
}

const loadTeachers = async () => {
    const { data } = await api.getTeachers()
    teachers.value = data
}

const handleSubmit = async () => {
    if (editing.value) {
        await api.updateCourse(editing.value, form.value)
    } else {
        await api.createCourse(form.value)
    }
    await loadCourses()
    closeModal()
}

const editCourse = (course) => {
    editing.value = course.id
    form.value = { ...course }
    showModal.value = true
}

const deleteCourse = async (id) => {
    if (confirm('Supprimer ce cours ?')) {
        await api.deleteCourse(id)
        await loadCourses()
    }
}

const closeModal = () => {
    showModal.value = false
    editing.value = null
    form.value = { code: '', name: '', teacher_id: '', class: '', coefficient: 1 }
}

onMounted(async () => {
    await Promise.all([loadCourses(), loadTeachers()])
})
</script>