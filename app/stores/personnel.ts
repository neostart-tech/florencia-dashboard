import { defineStore } from 'pinia'

export const usePersonnelStore = defineStore('personnel', {
    state: () => ({
        personnels: [] as any[],
        personnel: null
    }),
    actions: {
        setPersonnels(personnels: any[]) {
            this.personnels = personnels
        },
        async fetchPersonnels() {
            const api = useApi()
            const response = await api.get('/personnels')
            this.setPersonnels(response.data.data || response.data)
        },
        async createPersonnel(data: any) {
            const api = useApi()
            const response = await api.post('/personnels', data)
            return response.data
        },
        async deletePersonnel(id: string | number) {
            const api = useApi()
            await api.delete(`/personnels/${id}`)
        }
    }
})
