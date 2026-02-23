import { defineStore } from 'pinia'

export const useSousCategorieStore = defineStore('sousCategorie', {
    state: () => ({
        sousCategories: [] as any[],
        sousCategorie: null
    }),
    actions: {
        setSousCategories(items: any[]) {
            this.sousCategories = items
        },
        async fetchSousCategories() {
            const api = useApi()
            const response = await api.get('/sous-categories')
            this.setSousCategories(response.data.data || response.data)
        },
        async createSousCategorie(data: any) {
            const api = useApi()
            const response = await api.post('/sous-categories', data)
            return response.data
        },
        async deleteSousCategorie(id: string | number) {
            const api = useApi()
            await api.delete(`/sous-categories/${id}`)
        }
    }
})
