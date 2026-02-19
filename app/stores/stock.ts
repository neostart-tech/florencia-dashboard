import { defineStore } from 'pinia'
import axios from 'axios'

export const useStockStore = defineStore('stock', {
    state: () => ({
        stocks: [],
        mouvements: [],
        stock: null
    }),
    actions: {
        setStocks(stocks) {
            this.stocks = stocks
        },
        setMouvements(mouvements) {
            this.mouvements = mouvements
        },
        async fetchStocks() {
            const response = await axios.get('/stocks')
            this.setStocks(response.data.data || response.data)
        },
        async fetchArticleStock(id) {
            const response = await axios.get('/stocks/' + id)
            this.stock = response.data.data || response.data
        },
        async fetchMouvements(articleId) {
            const response = await axios.get(`/stocks/${articleId}/mouvements`)
            this.setMouvements(response.data.data || response.data)
        },
        async createMouvement(mouvement) {
            const response = await axios.post('/stocks/mouvement', mouvement)
            return response.data
        }
    }
})
