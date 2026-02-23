import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [] as any[],
        order: null
    }),
    actions: {
        setOrders(orders: any[]) {
            this.orders = orders
        },
        async fetchOrders() {
            const api = useApi()
            const response = await api.get('/commandes')
            this.setOrders(response.data.data || response.data)
        },
        async updateOrderStatus(id: string | number, status: string) {
            const api = useApi()
            await api.put(`/commandes/${id}`, { statut: status })
        }
    }
})
