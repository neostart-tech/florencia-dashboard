import { defineStore } from 'pinia'

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
            if (import.meta.client) {
                if (token) {
                    localStorage.setItem('admin_token', token)
                } else {
                    localStorage.removeItem('admin_token')
                }
            }
        },
        initFromStorage() {
            if (import.meta.client) {
                const token = localStorage.getItem('admin_token')
                if (token) {
                    this.token = token
                }
            }
        },
        async login(email: string, password: string) {
            const api = useApi()
            const response = await api.post('/admin/login', { email, password })
            this.setToken(response.data.token)
            this.user = response.data.user
            return response.data
        },
        async logout() {
            const api = useApi()
            try {
                await api.post('/logout')
            } finally {
                this.user = null
                this.setToken(null)
            }
        }
    }
})