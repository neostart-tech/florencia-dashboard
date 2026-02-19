import config from "../config"
import * as axios from "axios"
import { defineNuxtPlugin } from "#app"
import { useAuthStore } from "~/app/stores/auth"

const baseUrl = config.app_local ? config.app_dev_url : config.app_prod_url

export default defineNuxtPlugin((nuxtApp) => {
    axios.default.defaults.baseURL = baseUrl

    // Injecter automatiquement le token Bearer à chaque requête
    axios.default.interceptors.request.use((axiosConfig) => {
        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('admin_token')
        if (token) {
            axiosConfig.headers.Authorization = `Bearer ${token}`
        }
        return axiosConfig
    })

    return { provide: { axios } }
})