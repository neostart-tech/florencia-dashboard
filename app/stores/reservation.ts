import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservation', {
    state: () => ({
        reservations: [] as any[],
        reservation: null,
        loading: false
    }),
    actions: {
        async fetchReservations() {
            this.loading = true
            try {
                const api = useApi()
                const response = await api.get('/reservations')
                this.reservations = response.data.data || response.data
            } finally {
                this.loading = false
            }
        },
        async createReservation(data: any) {
            const api = useApi()
            const response = await api.post('/reservations', data)
            await this.fetchReservations()
            return response.data
        },
        async deleteReservation(id: string | number) {
            const api = useApi()
            await api.delete(`/reservations/${id}`)
            await this.fetchReservations()
        }
    }
})
