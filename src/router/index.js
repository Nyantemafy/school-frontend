import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { guest: true }
    },
    {
        path: '/',
        component: Layout, // Layout comme parent pour toutes les routes protégées
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: '/students',
                name: 'StudentList',
                component: () => import('../views/Students/StudentList.vue'),
                meta: { roles: ['admin', 'teacher'] }
            },
            {
                path: '/students/create',
                name: 'StudentCreate',
                component: () => import('../views/Students/StudentForm.vue'),
                meta: { roles: ['admin'] }
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('../views/Profile/Profile.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/admin/settings',
                name: 'Settings',
                component: () => import('../views/Settings/Settings.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/admin/users',
                name: 'Admin',
                component: () => import('../views/Admin/UserManagement.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/profile/edit',
                name: 'ProfileEdit',
                component: () => import('../views/Profile/ProfileEdit.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/students/:id/grades',
                name: 'StudentGrades',
                component: () => import('../views/Students/StudentGrades.vue')
            },
            {
                path: '/grades',
                name: 'GradeEntry',
                component: () => import('../views/Grades/GradeEntry.vue'),
                meta: { roles: ['teacher', 'admin'] }
            },
            {
                path: '/courses',
                name: 'Courses',
                component: () => import('../views/Courses/CourseList.vue'),
                meta: { roles: ['admin', 'teacher'] }
            },
            {
                path: '/courses/create',
                name: 'CreateCourse',
                component: () => import('../views/Courses/CreateCourse.vue'),
                meta: { roles: ['admin', 'teacher'] }
            },
            {
                path: '/schedule',
                name: 'Schedule',
                component: () => import('../views/Schedule/ScheduleView.vue')
            },
            {
                path: '/reports',
                name: 'Reports',
                component: () => import('../views/Report/Reports.vue'),
                meta: { roles: ['admin'] }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    if (authStore.token && !authStore.user) {
        await authStore.fetchUser()
    }

    if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
        next({ name: 'Login' })
    } 
    else if (to.matched.some(record => record.meta.guest) && authStore.isAuthenticated) {
        next({ name: 'Dashboard' })
    } 
    else if (to.meta.roles) {
        const userRole = authStore.user?.role || ''
        if (!to.meta.roles.includes(userRole)) {
            next({ name: 'Dashboard' }) 
        } else {
            next()
        }
    }
    else {
        next()
    }
})

export default router