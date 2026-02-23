import { defineStore } from 'pinia'

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        yields: [] as any[],
        interventions: [] as any[],
        paymentAlerts: [] as any[],
        periodicReports: {
            daily: null,
            weekly: null,
            monthly: null,
            quarterly: null,
            annual: null
        }
    }),
    actions: {
        async fetchEmployeeYields() {
            const api = useApi()
            const response = await api.get('/analytics/yields')
            this.yields = response.data.data || response.data
        },
        async fetchInterventions(employeeId?: string | number) {
            const api = useApi()
            const url = employeeId ? `/analytics/employees/${employeeId}/interventions` : '/analytics/interventions'
            const response = await api.get(url)
            this.interventions = response.data.data || response.data
        },
        async fetchPaymentAlerts() {
            const api = useApi()
            const response = await api.get('/analytics/alerts/payments')
            this.paymentAlerts = response.data.data || response.data
        },
        async fetchPeriodicReport(type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual') {
            const api = useApi()
            const response = await api.get(`/analytics/reports/${type}`)
            this.periodicReports[type] = response.data.data || response.data
        }
    }
})
