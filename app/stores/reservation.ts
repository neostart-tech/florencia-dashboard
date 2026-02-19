import { defineStore } from 'pinia'
import axios from 'axios'

export const useReservationStore = defineStore('reservation', {
    state: () => ({
        reservations: [],
        reservation: null
    }),
    actions: {
        setReservations(reservations) {
            this.reservations = reservations
        },
        async fetchReservations() {
            const response = await axios.get('/reservations')
            this.setReservations(response.data.data || response.data)
        },
        async deleteReservation(id: string | number) {
            await axios.delete(`/reservations/${id}`)
        }
    }
})
