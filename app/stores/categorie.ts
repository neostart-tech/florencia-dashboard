import { defineStore } from 'pinia'

export const useCategorieStore = defineStore('categorie', {
    state: () => ({
        categories: [] as any[],
        categorie: null
    }),
    actions: {
        setCategories(categories: any[]) {
            this.categories = categories
        },
        async fetchCategories() {
            const api = useApi()
            const response = await api.get('/categories')
            this.setCategories(response.data.data || response.data)
        },
        async createCategorie(data: any) {
            const api = useApi()
            const response = await api.post('/categories', data)
            return response.data
        },
        async deleteCategorie(id: string | number) {
            const api = useApi()
            await api.delete(`/categories/${id}`)
        }
    }
})
