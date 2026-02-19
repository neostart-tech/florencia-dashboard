import { defineStore } from 'pinia'
import axios from 'axios'

export const useServiceStore = defineStore('service', {
    state: () => ({
        services: [],
        service: null
    }),
    actions: {
        setServices(services) {
            this.services = services
        },
        setService(service) {
            this.service = service
        },
        async fetchServices() {
            const response = await axios.get('/services')
            this.setServices(response.data.data || response.data)
        },
        async fetchService(id) {
            const response = await axios.get('/services/' + id)
            this.setService(response.data.data || response.data)
        },
        async createService(service) {
            const response = await axios.post('/services', service)
            this.setService(response.data.data || response.data)
        },
        async updateService(service) {
            const response = await axios.put('/services/' + service.id, service)
            this.setService(response.data.data || response.data)
        },
        async deleteService(id) {
            await axios.delete('/services/' + id)
            this.setService(null)
        }
    }
})
