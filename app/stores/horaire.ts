import { defineStore } from 'pinia'

export const useHoraireStore = defineStore('horaire', {
    state: () => ({
        horaires: [] as any[],
        horaire: null
    }),
    actions: {
        setHoraires(horaires: any[]) {
            this.horaires = horaires
        },
        async fetchHoraires() {
            const api = useApi()
            const response = await api.get('/horaires')
            this.setHoraires(response.data.data || response.data)
        },
        async createHoraire(horaire: any) {
            const api = useApi()
            const response = await api.post('/horaires', horaire)
            return response.data
        },
        async deleteHoraire(id: string | number) {
            const api = useApi()
            await api.delete(`/horaires/${id}`)
        }
    }
})
