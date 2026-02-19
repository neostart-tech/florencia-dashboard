import { defineStore } from 'pinia'
import axios from 'axios'

export const usePersonnelStore = defineStore('personnel', {
    state: () => ({
        personnels: [],
        personnel: null
    }),
    actions: {
        setPersonnels(personnels) {
            this.personnels = personnels
        },
        setPersonnel(personnel) {
            this.personnel = personnel
        },
        async fetchPersonnels() {
            const response = await axios.get('/personnels')
            this.setPersonnels(response.data.data || response.data)
        },
        async fetchPersonnel(id) {
            const response = await axios.get('/personnels/' + id)
            this.setPersonnel(response.data.data || response.data)
        },
        async createPersonnel(personnel) {
            const response = await axios.post('/personnels', personnel)
            this.setPersonnel(response.data.data || response.data)
        },
        async updatePersonnel(personnel) {
            const response = await axios.put('/personnels/' + personnel.id, personnel)
            this.setPersonnel(response.data.data || response.data)
        },
        async deletePersonnel(id) {
            await axios.delete('/personnels/' + id)
            this.setPersonnel(null)
        }
    }
})
