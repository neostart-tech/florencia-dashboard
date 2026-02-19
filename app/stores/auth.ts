import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: null as string | null
    }),
    actions: {
        setUser(user: any) {
            this.user = user
        },
        setToken(token: string | null) {
            this.token = token
            if (token) {
                localStorage.setItem('admin_token', token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            } else {
                localStorage.removeItem('admin_token')
                delete axios.defaults.headers.common['Authorization']
            }
        },
        initFromStorage() {
            const token = localStorage.getItem('admin_token')
            if (token) {
                this.token = token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        },
        async login(email: string, password: string) {
            const response = await axios.post('/admin/login', { email, password })
            this.setToken(response.data.token)
            this.user = response.data.user
            return response.data
        },
        async logout() {
            try {
                await axios.post('/logout')
            } finally {
                this.user = null
                this.setToken(null)
            }
        }
    }
})