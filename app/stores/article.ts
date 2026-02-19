import { defineStore } from 'pinia'
import axios from 'axios'
export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: [],
        article: null
    }),
    actions: {
        setArticles(articles) {
            this.articles = articles
        },
        setArticle(article) {
            this.article = article
        },
        async fetchArticles() {
            const response = await axios.get('/articles')
            this.setArticles(response.data)
        },
        async fetchArticle(id) {
            const response = await axios.get('/articles/' + id)
            this.setArticle(response.data)
        },
        async createArticle(article) {
            const response = await axios.post('/articles', article)
            this.setArticle(response.data)
        },
        async updateArticle(article) {
            const response = await axios.put('/articles/' + article.id, article)
            this.setArticle(response.data)
        },
        async deleteArticle(article) {
            const response = await axios.delete('/articles/' + article.id)
            this.setArticle(null)
        }
    }
})