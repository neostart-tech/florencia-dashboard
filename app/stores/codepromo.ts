import { defineStore } from 'pinia'

export const useCodePromoStore = defineStore('codepromo', {
    state: () => ({
        codepromos: [] as any[],
        codepromo: null
    }),
    actions: {
        setCodepromos(items: any[]) {
            this.codepromos = items
        },
        async fetchCodepromos() {
            const api = useApi()
            const response = await api.get('/codepromos')
            this.setCodepromos(response.data.data || response.data)
        },
        async createCodepromo(data: any) {
            const api = useApi()
            const response = await api.post('/codepromos', data)
            return response.data
        },
        async deleteCodepromo(id: string | number) {
            const api = useApi()
            await api.delete(`/codepromos/${id}`)
        }
    }
})
