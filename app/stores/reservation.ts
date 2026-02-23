import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservation', {
    state: () => ({
        reservations: [] as any[],
        reservation: null
    }),
    actions: {
        setReservations(reservations: any[]) {
            this.reservations = reservations
        },
        async fetchReservations() {
            const api = useApi()
            const response = await api.get('/reservations')
            this.setReservations(response.data.data || response.data)
        },
        async deleteReservation(id: string | number) {
            const api = useApi()
            await api.delete(`/reservations/${id}`)
        }
    }
})
