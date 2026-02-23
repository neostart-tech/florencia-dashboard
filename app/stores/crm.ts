import { defineStore } from 'pinia'

export const useCrmStore = defineStore('crm', {
    state: () => ({
        customers: [] as any[],
        categories: [
            { id: 1, label: 'Standard', color: 'neutral' },
            { id: 2, label: 'Premium', color: 'primary' },
            { id: 3, label: 'VIP', color: 'success' },
            { id: 4, label: 'Nouveau', color: 'warning' }
        ],
        alerts: [] as any[],
        customerHistory: [] as any[]
    }),
    actions: {
        async fetchCustomers() {
            const api = useApi()
            const response = await api.get('/crm/customers')
            this.customers = response.data.data || response.data
        },
        async fetchCategories() {
            // Pour l'instant on utilise les catégories statiques ou on les fetch
            return this.categories
        },
        async fetchCustomerHistory(customerId: string | number) {
            const api = useApi()
            const response = await api.get(`/crm/customers/${customerId}/history`)
            this.customerHistory = response.data.data || response.data
        },
        async fetchNewCustomerAlerts() {
            const api = useApi()
            const response = await api.get('/crm/alerts/new-customers')
            this.alerts = response.data.data || response.data
        }
    }
})
