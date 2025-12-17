import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
        isTeacher: (state) => state.user?.role === 'teacher',
        isStudent: (state) => state.user?.role === 'student'
    },

    actions: {
        async login(credentials) {
        this.loading = true
        try {
            const { data } = await api.login(credentials)
            this.token = data.token
            this.user = data.user
            localStorage.setItem('token', data.token)
            return true
        } catch (error) {
            console.error('Login error:', error)
            return false
        } finally {
            this.loading = false
        }
        },

        async logout() {
        try {
            await api.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
        }
        },

        async fetchUser() {
        try {
            const { data } = await api.getMe()
            this.user = data
        } catch (error) {
            console.error('Fetch user error:', error)
            this.logout()
        }
        }
    }
})