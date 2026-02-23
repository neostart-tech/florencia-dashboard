import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        paymentAlerts: [] as any[],
        newCustomerAlerts: [] as any[],
        ordersCount: 0,
        loading: false,
        lastTotal: 0,
        audio: null as HTMLAudioElement | null
    }),
    getters: {
        totalAlerts(): number {
            return this.paymentAlerts.length + this.newCustomerAlerts.length
        },
        allNotifications(): any[] {
            const payments = this.paymentAlerts.map((a: any) => ({
                id: `pay-${a.id}`,
                label: 'Paiement en attente', // Nécessaire pour UDropdown
                description: `${a.montant} Fcfa - ${a.owner_type?.includes('Commande') ? 'Commande' : 'Réservation'}`,
                icon: 'i-lucide-credit-card',
                color: 'text-red-500',
                to: '/reports/payments',
                time: a.created_at
            }))

            const customers = this.newCustomerAlerts.map((a: any) => ({
                id: `cust-${a.id}`,
                label: 'Nouveau client', // Nécessaire pour UDropdown
                description: `${a.nom} vient de s'inscrire`,
                icon: 'i-lucide-user-plus',
                color: 'text-blue-500',
                to: '/crm/directory',
                time: a.created_at
            }))

            const all = [...payments, ...customers].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

            // On limite aux 5 dernières pour le dropdown
            return all.slice(0, 5)
        }
    },
    actions: {
        initAudio() {
            if (import.meta.client && !this.audio) {
                // Utilisation d'un son de notification standard
                this.audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
            }
        },
        playNotificationSound() {
            if (import.meta.client) {
                this.initAudio()
                this.audio?.play().catch(e => console.log('Audio play blocked by browser', e))
            }
        },
        async fetchAllAlerts() {
            this.loading = true
            const api = useApi()
            try {
                const results = await Promise.allSettled([
                    api.get('/analytics/alerts/payments'),
                    api.get('/crm/alerts/new-customers')
                ])

                const newPayments = results[0].status === 'fulfilled' ? (results[0].value.data.data || results[0].value.data) : []
                const newCustomers = results[1].status === 'fulfilled' ? (results[1].value.data.data || results[1].value.data) : []

                const newTotal = newPayments.length + newCustomers.length

                // Si le total a augmenté, on joue le son
                if (newTotal > this.lastTotal && this.lastTotal !== 0) {
                    this.playNotificationSound()
                }

                this.paymentAlerts = newPayments
                this.newCustomerAlerts = newCustomers
                this.lastTotal = newTotal

            } catch (error) {
                console.error('Failed to fetch alerts', error)
            } finally {
                this.loading = false
            }
        }
    }
})
