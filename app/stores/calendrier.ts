import { defineStore } from 'pinia'
import axios from 'axios'

export const useCalendrierStore = defineStore('calendrier', {
    state: () => ({
        calendriers: [],
        calendrier: null
    }),
    actions: {
        setCalendriers(calendriers) {
            this.calendriers = calendriers
        },
        setCalendrier(calendrier) {
            this.calendrier = calendrier
        },
        async fetchCalendriers() {
            const response = await axios.get('/calendriers')
            this.setCalendriers(response.data.data || response.data)
        },
        async fetchCalendrier(id) {
            const response = await axios.get('/calendriers/' + id)
            this.setCalendrier(response.data.data || response.data)
        },
        async createCalendrier(calendrier) {
            const response = await axios.post('/calendriers', calendrier)
            this.setCalendrier(response.data.data || response.data)
        },
        async updateCalendrier(calendrier) {
            const response = await axios.put('/calendriers/' + calendrier.id, calendrier)
            this.setCalendrier(response.data.data || response.data)
        },
        async deleteCalendrier(id) {
            await axios.delete('/calendriers/' + id)
            this.setCalendrier(null)
        }
    }
})
