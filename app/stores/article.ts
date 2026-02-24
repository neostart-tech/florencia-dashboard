import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: [] as any[],
        article: null as any
    }),
    actions: {
        setArticles(articles: any) {
            this.articles = articles
        },
        async fetchArticles() {
            const api = useApi()
            const response = await api.get('/articles')
            this.setArticles(response.data.data || response.data)
        },
        async createArticle(data: any) {
            const api = useApi()
            const response = await api.post('/articles', data)
            return response.data
        },
        async deleteArticle(article: any) {
            const api = useApi()
            await api.delete(`/articles/${article.id}`)
        }
    }
})