<template>
    <div class="p-4">
        <h2 class="mb-4">Notes de l'étudiant</h2>

        <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
        </div>

        <div v-else>
        <div class="alert alert-info mb-4">
            <h5>Moyenne générale: {{ average }}</h5>
        </div>
        <button 
            class="btn btn-success"
            @click="downloadBulletin"
            >
            📥 Télécharger le bulletin PDF
        </button>

        <table class="table table-bordered">
            <thead>
            <tr>
                <th>Cours</th>
                <th>Type d'examen</th>
                <th>Note</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="grade in grades" :key="grade.id">
                <td>{{ grade.course.name }}</td>
                <td>{{ grade.exam_type }}</td>
                <td>
                <span :class="getGradeClass(grade.grade)">
                    {{ grade.grade }}/20
                </span>
                </td>
                <td>{{ formatDate(grade.exam_date) }}</td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const grades = ref([])
const average = ref(0)
const loading = ref(true)

const downloadBulletin = () => {
    const studentId = route.params.id
    window.open(`http://localhost:8000/api/reports/bulletin/${studentId}`, '_blank')
}

onMounted(async () => {
    const studentId = route.params.id
    
    const [gradesRes, avgRes] = await Promise.all([
        api.getStudentGrades(studentId),
        api.getStudentAverage(studentId)
    ])
    
    grades.value = gradesRes.data
    average.value = avgRes.data.average
    loading.value = false
})

const getGradeClass = (grade) => {
    if (grade >= 16) return 'badge bg-success'
    if (grade >= 14) return 'badge bg-info'
    if (grade >= 10) return 'badge bg-warning'
    return 'badge bg-danger'
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR')
}
</script>