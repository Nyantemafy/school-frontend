<template>
  <div class="p-4">
    <div class="d-flex justify-content-between mb-4">
      <h2>Liste des Étudiants</h2>
      <router-link 
        v-if="isAdmin" 
        to="/students/create" 
        class="btn btn-primary"
      >
        ➕ Ajouter
      </router-link>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Matricule</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Classe</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.matricule }}</td>
          <td>{{ student.user.name }}</td>
          <td>{{ student.user.email }}</td>
          <td>{{ student.class }}</td>
          <td>
            <router-link 
              :to="`/students/${student.id}/grades`" 
              class="btn btn-sm btn-info me-2"
            >
              Notes
            </router-link>
            <button 
              v-if="isAdmin"
              @click="deleteStudent(student.id)" 
              class="btn btn-sm btn-danger"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStudentsStore } from '../../stores/students'
import { useAuthStore } from '../../stores/auth'

const studentsStore = useStudentsStore()
const authStore = useAuthStore()

const students = computed(() => studentsStore.students)
const loading = computed(() => studentsStore.loading)
const isAdmin = computed(() => authStore.isAdmin)

onMounted(() => {
    studentsStore.fetchStudents()
})

const deleteStudent = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cet étudiant ?')) {
        await studentsStore.deleteStudent(id)
    }
}
</script>