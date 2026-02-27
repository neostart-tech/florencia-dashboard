export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()
    const token = authStore.token

    // 1. Si on n'est pas sur /login et qu'on n'a pas de token -> redirection forcée
    if (!token && to.path !== '/login') {
        return navigateTo('/login')
    }

    // 2. Si on est connecté
    if (token) {
        // Rediriger loin de /login
        if (to.path === '/login') {
            if (authStore.user?.role?.role === 'receptionnist') {
                return navigateTo('/receptionnist')
            }
            return navigateTo('/')
        }

        // Protection des routes selon le rôle (si le profil est chargé)
        if (authStore.user) {
            const isReceptionnist = authStore.user.role?.role === 'receptionnist'

            if (isReceptionnist) {
                const allowedReceptionPaths = ['/receptionnist', '/crm/directory', '/login']
                const isAllowed = allowedReceptionPaths.some(path => to.path.startsWith(path))

                if (!isAllowed) {
                    return navigateTo('/receptionnist')
                }
            }
        }
    }
})
