import { defineStore } from 'pinia'
import axios from 'axios'

export const useSousCategorieStore = defineStore('sousCategorie', {
    state: () => ({
        sousCategories: [],
        sousCategorie: null
    }),
    actions: {
        setSousCategories(items) {
            this.sousCategories = items
        },
        async fetchSousCategories() {
            const response = await axios.get('/sous-categories')
            this.setSousCategories(response.data.data || response.data)
        }
    }
})
