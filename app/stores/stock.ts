import { defineStore } from 'pinia'

export const useStockStore = defineStore('stock', {
    state: () => ({
        stocks: [] as any[],
        mouvements: [] as any[],
        stock: null
    }),
    actions: {
        setStocks(stocks: any[]) {
            this.stocks = stocks
        },
        setMouvements(mouvements: any[]) {
            this.mouvements = mouvements
        },
        async fetchStocks() {
            const api = useApi()
            const response = await api.get('/stocks')
            this.setStocks(response.data.data || response.data)
        },
        async fetchMouvements(articleId: string | number) {
            const api = useApi()
            const response = await api.get(`/stocks/${articleId}/mouvements`)
            this.setMouvements(response.data.data || response.data)
        },
        async createMouvement(mouvement: any) {
            const api = useApi()
            const response = await api.post('/stocks/mouvement', mouvement)
            return response.data
        }
    }
})
