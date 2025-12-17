<template>
    <div class="p-4">
        <div class="d-flex justify-content-between mb-4">
        <h2>📅 Emploi du Temps</h2>
        <div class="d-flex gap-2">
            <select v-model="selectedClass" class="form-select" style="width: 200px">
            <option value="">Toutes les classes</option>
            <option value="6ème">6ème</option>
            <option value="5ème">5ème</option>
            <option value="4ème">4ème</option>
            <option value="3ème">3ème</option>
            </select>
            <button 
            v-if="isAdmin || isTeacher"
            class="btn btn-primary" 
            @click="showAddModal = true"
            >
            ➕ Ajouter un horaire
            </button>
            <button 
            v-if="selectedClass"
            class="btn btn-success" 
            @click="exportIcal"
            >
            📥 Export iCal
            </button>
        </div>
        </div>

        <!-- Calendrier -->
        <div class="card">
        <div class="card-body">
            <FullCalendar :options="calendarOptions" />
        </div>
        </div>

        <!-- Modal Ajout/Modification -->
        <div v-if="showAddModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ editingSchedule ? 'Modifier' : 'Ajouter' }} un horaire</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label class="form-label">Classe *</label>
                    <select v-model="form.class" class="form-select" required>
                    <option value="">-- Sélectionner --</option>
                    <option value="6ème">6ème</option>
                    <option value="5ème">5ème</option>
                    <option value="4ème">4ème</option>
                    <option value="3ème">3ème</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Cours *</label>
                    <select v-model="form.course_id" class="form-select" required>
                    <option value="">-- Sélectionner --</option>
                    <option v-for="course in courses" :key="course.id" :value="course.id">
                        {{ course.name }} - {{ course.teacher?.user?.name }}
                    </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Jour *</label>
                    <select v-model="form.day_of_week" class="form-select" required>
                    <option value="">-- Sélectionner --</option>
                    <option value="Lundi">Lundi</option>
                    <option value="Mardi">Mardi</option>
                    <option value="Mercredi">Mercredi</option>
                    <option value="Jeudi">Jeudi</option>
                    <option value="Vendredi">Vendredi</option>
                    <option value="Samedi">Samedi</option>
                    </select>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                    <label class="form-label">Heure début *</label>
                    <input v-model="form.start_time" type="time" class="form-control" required>
                    </div>
                    <div class="col-md-6 mb-3">
                    <label class="form-label">Heure fin *</label>
                    <input v-model="form.end_time" type="time" class="form-control" required>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Salle</label>
                    <input v-model="form.room" type="text" class="form-control" placeholder="Ex: A101">
                </div>

                <div v-if="errorMessage" class="alert alert-danger">
                    {{ errorMessage }}
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const isTeacher = computed(() => authStore.isTeacher)

const selectedClass = ref('')
const schedules = ref([])
const courses = ref([])
const showAddModal = ref(false)
const editingSchedule = ref(null)
const submitting = ref(false)
const errorMessage = ref('')

const form = ref({
    course_id: '',
    class: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    room: ''
})

const dayMapping = {
    'Lundi': 1,
    'Mardi': 2,
    'Mercredi': 3,
    'Jeudi': 4,
    'Vendredi': 5,
    'Samedi': 6
}

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'fr',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '18:00:00',
    allDaySlot: false,
    weekends: true,
    events: schedules.value.map(schedule => {
        const dayNum = dayMapping[schedule.day_of_week]
        const today = new Date()
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + dayNum))
        
        return {
        id: schedule.id,
        title: schedule.course.name + (schedule.room ? ` (${schedule.room})` : ''),
        start: `${startOfWeek.toISOString().split('T')[0]}T${schedule.start_time}`,
        end: `${startOfWeek.toISOString().split('T')[0]}T${schedule.end_time}`,
        backgroundColor: getRandomColor(),
        extendedProps: {
            teacher: schedule.course.teacher?.user?.name,
            class: schedule.class,
            room: schedule.room
        }
        }
    }),
    eventClick: (info) => {
        if (isAdmin.value || isTeacher.value) {
        const schedule = schedules.value.find(s => s.id == info.event.id)
        if (schedule) {
            editSchedule(schedule)
        }
        }
    }
}))

const loadSchedules = async () => {
    try {
        const params = selectedClass.value ? { class: selectedClass.value } : {}
        const { data } = await api.getSchedules(params)
        schedules.value = data
    } catch (error) {
        console.error('Erreur chargement emploi du temps:', error)
    }
}

const loadCourses = async () => {
    try {
        const { data } = await api.getCourses()
        courses.value = data
    } catch (error) {
        console.error('Erreur chargement cours:', error)
    }
}

const handleSubmit = async () => {
    submitting.value = true
    errorMessage.value = ''

    try {
        if (editingSchedule.value) {
        await api.updateSchedule(editingSchedule.value.id, form.value)
        } else {
        await api.createSchedule(form.value)
        }
        await loadSchedules()
        closeModal()
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'enregistrement'
    } finally {
        submitting.value = false
    }
}

const editSchedule = (schedule) => {
    editingSchedule.value = schedule
    form.value = { ...schedule }
    showAddModal.value = true
}

const closeModal = () => {
    showAddModal.value = false
    editingSchedule.value = null
    form.value = {
        course_id: '',
        class: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        room: ''
    }
    errorMessage.value = ''
}

const exportIcal = () => {
    if (!selectedClass.value) return
    window.open(`http://localhost:8000/api/schedules/export/ical/${selectedClass.value}`, '_blank')
}

const getRandomColor = () => {
    const colors = ['#3788d8', '#28a745', '#ffc107', '#dc3545', '#6f42c1']
    return colors[Math.floor(Math.random() * colors.length)]
}

watch(selectedClass, () => {
    loadSchedules()
})

onMounted(async () => {
    await Promise.all([loadSchedules(), loadCourses()])
})
</script>