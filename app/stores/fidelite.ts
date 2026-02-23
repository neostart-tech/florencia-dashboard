import { defineStore } from 'pinia'

export const useFideliteStore = defineStore('fidelite', {
    state: () => ({
        fidelites: [] as any[],
        fidelite: null
    }),
    actions: {
        setFidelites(items: any[]) {
            this.fidelites = items
        },
        async fetchFidelites() {
            const api = useApi()
            const response = await api.get('/fidelites')
            this.setFidelites(response.data.data || response.data)
        },
        async createFidelite(data: any) {
            const api = useApi()
            const response = await api.post('/fidelites', data)
            return response.data
        },
        async deleteFidelite(id: string | number) {
            const api = useApi()
            await api.delete(`/fidelites/${id}`)
        }
    }
})
