import { defineStore } from 'pinia'
import api from '../services/api'

export const useStudentsStore = defineStore('students', {
    state: () => ({
        students: [],
        currentStudent: null,
        loading: false
    }),

    actions: {
        async fetchStudents() {
        this.loading = true
        try {
            const { data } = await api.getStudents()
            this.students = data
        } catch (error) {
            console.error('Fetch students error:', error)
        } finally {
            this.loading = false
        }
        },

        async fetchStudent(id) {
        this.loading = true
        try {
            const { data } = await api.getStudent(id)
            this.currentStudent = data
        } catch (error) {
            console.error('Fetch student error:', error)
        } finally {
            this.loading = false
        }
        },

        async createStudent(studentData) {
        try {
            const { data } = await api.createStudent(studentData)
            this.students.push(data)
            return true
        } catch (error) {
            console.error('Create student error:', error)
            return false
        }
        },

        async deleteStudent(id) {
        try {
            await api.deleteStudent(id)
            this.students = this.students.filter(s => s.id !== id)
            return true
        } catch (error) {
            console.error('Delete student error:', error)
            return false
        }
        }
    }
})