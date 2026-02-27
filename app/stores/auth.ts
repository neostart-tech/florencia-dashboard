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
                    // On ne peut pas await ici si c'est synchrone, 
                    // mais on déclenche la récupération du profil
                    this.fetchUser()
                }
            }
        },
        async fetchUser() {
            try {
                const api = useApi()
                const response = await api.get('/profil')
                // Laravel Resources wrap data in a 'data' property
                this.user = response.data.data || response.data
            } catch (error) {
                this.setToken(null)
                this.user = null
            }
        },
        async login(email: string, password: string) {
            const api = useApi()
            const response = await api.post('/admin/login', { email, password })
            this.setToken(response.data.token)
            // L'utilisateur est retourné via UserResource, donc peut être wrappé
            this.user = response.data.user?.data || response.data.user
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