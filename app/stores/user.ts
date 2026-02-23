import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as any[],
        user: null as any,
        roles: [] as any[]
    }),
    actions: {
        setUsers(users: any[]) {
            this.users = users
        },
        async fetchUsers() {
            const api = useApi()
            const response = await api.get('/admins') // Pour lister les utilsateurs (admin/personnel/users)
            this.setUsers(response.data.data || response.data)
        },
        async createUser(userData: any) {
            const api = useApi()
            // Le backend Laravel attend souvent 'nom' et 'prenom' séparés, ou juste 'nom'
            // On adapte ici selon les besoins du contrôleur
            const response = await api.post('/admins', userData)
            return response.data
        },
        async deleteUser(id: string | number) {
            const api = useApi()
            await api.delete('/admins/' + id)
        }
    }
})
