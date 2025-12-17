import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { guest: true }
    },
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/students',
        name: 'StudentList',
        component: () => import('../views/Students/StudentList.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'teacher'] }
    },
    {
        path: '/students/create',
        name: 'StudentCreate',
        component: () => import('../views/Students/StudentForm.vue'),
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/students/:id/grades',
        name: 'StudentGrades',
        component: () => import('../views/Students/StudentGrades.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/grades',
        name: 'GradeEntry',
        component: () => import('../views/Grades/GradeEntry.vue'),
        meta: { requiresAuth: true, roles: ['teacher', 'admin'] }
    }
    ]

    const router = createRouter({
    history: createWebHistory(),
    routes
    })

    // Navigation guard
    router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login')
    }

    if (to.meta.guest && authStore.isAuthenticated) {
        return next('/')
    }

    if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
        return next('/')
    }

    next()
})

export default router