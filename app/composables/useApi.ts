import axios from 'axios'

export const useApi = () => {
    const runtimeConfig = useRuntimeConfig()
    const apiBase = runtimeConfig.public.apiBase || 'http://localhost:8000/api'

    const instance = axios.create({
        baseURL: apiBase.endsWith('/') ? apiBase : `${apiBase}/`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    // Intercepteur pour normaliser les URLs (éviter les doubles slashes)
    instance.interceptors.request.use((config) => {
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1)
        }
        return config
    })

    // Ajouter le token si existant
    if (import.meta.client) {
        const token = localStorage.getItem('admin_token')
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }

    return instance
}
