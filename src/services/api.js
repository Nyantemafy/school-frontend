import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default {
    login: (credentials) => api.post('/login', credentials),
    logout: () => api.post('/logout'),
    getMe: () => api.get('/me'),
    getStudents: () => api.get('/students'),
    getStudent: (id) => api.get(`/students/${id}`),
    createStudent: (data) => api.post('/students', data),
    updateStudent: (id, data) => api.put(`/students/${id}`, data),
    deleteStudent: (id) => api.delete(`/students/${id}`),
    getStudentGrades: (studentId) => api.get(`/grades/student/${studentId}`),
    getStudentAverage: (studentId) => api.get(`/grades/average/${studentId}`),
    createGrade: (data) => api.post('/grades', data),
    getCourses: () => api.get('/courses'),

    // Schedules
    getSchedules: (params) => api.get('/schedules', { params }),
    createSchedule: (data) => api.post('/schedules', data),
    updateSchedule: (id, data) => api.put(`/schedules/${id}`, data),
    deleteSchedule: (id) => api.delete(`/schedules/${id}`),

    // Users
    getUsers: () => api.get('/users'),
    createUser: (data) => api.post('/users', data),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
    changeUserRole: (id, data) => api.post(`/users/${id}/change-role`, data),

    // Teachers
    getTeachers: () => api.get('/teachers'),
    createTeacher: (data) => api.post('/teachers', data),

    // Courses
    getCourses: () => api.get('/courses'),
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
}