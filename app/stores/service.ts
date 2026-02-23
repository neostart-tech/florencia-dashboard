import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', {
    state: () => ({
        services: [],
        service: null
    }),
    actions: {
        setServices(services: any) {
            this.services = services
        },
        async fetchServices() {
            const api = useApi()
            const response = await api.get('/services')
            this.setServices(response.data.data || response.data)
        }
    }
})
