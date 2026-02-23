import { defineStore } from 'pinia'

export const useCalendrierStore = defineStore('calendrier', {
    state: () => ({
        calendriers: [] as any[],
        calendrier: null
    }),
    actions: {
        setCalendriers(calendriers: any[]) {
            this.calendriers = calendriers
        },
        async fetchCalendriers() {
            const api = useApi()
            const response = await api.get('/calendriers')
            this.setCalendriers(response.data.data || response.data)
        },
        async createCalendrier(data: any) {
            const api = useApi()
            const response = await api.post('/calendriers', data)
            return response.data
        },
        async updateCalendrier(cal: any) {
            const api = useApi()
            const response = await api.put(`/calendriers/${cal.id}`, { is_active: cal.is_active })
            return response.data
        },
        async deleteCalendrier(id: string | number) {
            const api = useApi()
            await api.delete(`/calendriers/${id}`)
        }
    }
})
