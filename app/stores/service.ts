import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', {
    state: () => ({
        services: [] as any[],
        service: null as any
    }),
    actions: {
        setServices(services: any) {
            this.services = services
        },
        async fetchServices() {
            const api = useApi()
            const response = await api.get('/services')
            this.setServices(response.data.data || response.data)
        },
        async createService(data: any) {
            const api = useApi()
            const response = await api.post('/services', data)
            return response.data
        },
        async deleteService(id: string | number) {
            const api = useApi()
            await api.delete(`/services/${id}`)
        }
    }
})
