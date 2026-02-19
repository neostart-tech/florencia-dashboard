import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategorieStore = defineStore('categorie', {
    state: () => ({
        categories: [],
        categorie: null
    }),
    actions: {
        setCategories(categories) {
            this.categories = categories
        },
        setCategorie(categorie) {
            this.categorie = categorie
        },
        async fetchCategories() {
            const response = await axios.get('/categories')
            this.setCategories(response.data.data || response.data)
        },
        async fetchCategorie(id) {
            const response = await axios.get('/categories/' + id)
            this.setCategorie(response.data.data || response.data)
        },
        async createCategorie(categorie) {
            const response = await axios.post('/categories', categorie)
            this.setCategorie(response.data.data || response.data)
        },
        async updateCategorie(categorie) {
            const response = await axios.put('/categories/' + categorie.id, categorie)
            this.setCategorie(response.data.data || response.data)
        },
        async deleteCategorie(id) {
            await axios.delete('/categories/' + id)
            this.setCategorie(null)
        }
    }
})
