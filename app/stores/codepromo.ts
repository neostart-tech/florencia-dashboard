import { defineStore } from 'pinia'
import axios from 'axios'

export const useCodePromoStore = defineStore('codepromo', {
    state: () => ({
        codepromos: [],
        codepromo: null
    }),
    actions: {
        setCodepromos(codepromos) {
            this.codepromos = codepromos
        },
        setCodepromo(codepromo) {
            this.codepromo = codepromo
        },
        async fetchCodepromos() {
            const response = await axios.get('/codepromos')
            this.setCodepromos(response.data.data || response.data)
        },
        async fetchCodepromo(id) {
            const response = await axios.get('/codepromos/' + id)
            this.setCodepromo(response.data.data || response.data)
        },
        async createCodepromo(codepromo) {
            const response = await axios.post('/codepromos', codepromo)
            this.setCodepromo(response.data.data || response.data)
        },
        async deleteCodepromo(id) {
            await axios.delete('/codepromos/' + id)
            this.setCodepromo(null)
        }
    }
})
