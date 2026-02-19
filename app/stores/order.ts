import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [],
        order: null
    }),
    actions: {
        setOrders(orders) {
            this.orders = orders
        },
        async fetchOrders() {
            const response = await axios.get('/commandes')
            this.setOrders(response.data.data || response.data)
        },
        async updateOrderStatus(id, status) {
            const response = await axios.put(`/commandes/${id}/status`, { status })
            return response.data
        }
    }
})
