<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()

const handleLogin = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<any>(`${config.public.apiBase}/admin/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    if (response.token) {
      // Stockage du token et des infos utilisateur
      localStorage.setItem('florencia_admin_token', response.token)
      localStorage.setItem('florencia_admin_user', JSON.stringify(response.user))
      
      toast.add({
        title: 'Connexion réussie',
        description: `Bienvenue, ${response.user.name}`,
        color: 'green'
      })

      navigateTo('/')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    toast.add({
      title: 'Échec de l\'authentification',
      description: error.data?.message || 'Identifiants invalides ou erreur serveur',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center p-6 sm:p-12">
    <div class="max-w-md w-full login-card-container">
      <!-- Logo Section avec Animation -->
      <div class="text-center mb-12 animate-fade-down">
        <h1 class="text-5xl font-serif text-cafe-700 mb-3 uppercase tracking-[0.2em] leading-tight">Florencia</h1>
        <div class="flex items-center justify-center gap-4 mb-4">
          <div class="h-[1px] w-8 bg-cafe-200"></div>
          <p class="text-[0.7rem] text-neutral-400 font-sans uppercase tracking-[0.3em]">Maison de Beauté</p>
          <div class="h-[1px] w-8 bg-cafe-200"></div>
        </div>
      </div>

      <UCard 
        class="glass-card border-white/40 shadow-[0_20px_50px_rgba(108,66,57,0.15)] overflow-hidden animate-fade-up"
        :ui="{ 
          body: 'p-8 sm:p-10', 
          header: 'border-b border-cafe-50/50 px-8 py-6',
          footer: 'bg-cafe-50/30 px-8 py-4 border-t border-cafe-50/50'
        }"
      >
        <template #header>
          <div class="text-center">
            <h2 class="text-xl font-serif text-neutral-800 tracking-wide">Espace Administrateur</h2>
            <p class="text-xs text-neutral-400 font-sans mt-1">Veuillez vous identifier pour continuer</p>
          </div>
        </template>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UFormField label="Adresse Email" name="email" :ui="{ label: 'text-[0.7rem] uppercase tracking-widest text-neutral-500 mb-2' }">
            <UInput
              v-model="email"
              type="email"
              placeholder="admin@florencia.com"
              icon="i-lucide-mail"
              size="xl"
              variant="subtle"
              class="font-sans border-b border-neutral-100 hover:border-cafe-200 focus:border-cafe-500 transition-all duration-300"
            />
          </UFormField>

          <UFormField label="Mot de passe" name="password" :ui="{ label: 'text-[0.7rem] uppercase tracking-widest text-neutral-500 mb-2' }">
            <UInput
              v-model="password"
              type="password"
              icon="i-lucide-lock"
              size="xl"
              variant="subtle"
              class="font-sans border-b border-neutral-100 hover:border-cafe-200 focus:border-cafe-500 transition-all duration-300"
            />
          </UFormField>

          <div class="flex items-center justify-end text-xs pt-1">
            <ULink to="#" class="text-neutral-400 hover:text-cafe-600 transition-colors uppercase tracking-widest text-[0.65rem]">
              Oublié ?
            </ULink>
          </div>

          <UButton
            type="submit"
            block
            size="xl"
            :loading="loading"
            class="mt-8 bg-cafe-700 hover:bg-cafe-800 text-white font-sans uppercase tracking-[0.2em] text-xs py-4 transition-all duration-500 shadow-lg hover:shadow-cafe-200"
          >
            S'authentifier
          </UButton>
        </form>

        <template #footer>
          <div class="flex items-center justify-center gap-2 opacity-60">
            <UIcon name="i-lucide-shield-check" class="text-cafe-500 w-3 h-3" />
            <p class="text-[0.6rem] text-neutral-500 font-sans uppercase tracking-[0.1em]">
              Connexion sécurisée SSL
            </p>
          </div>
        </template>
      </UCard>

      <div class="mt-12 text-center animate-fade-in opacity-40 hover:opacity-100 transition-opacity duration-700">
        <p class="text-[0.65rem] text-neutral-400 font-sans uppercase tracking-[0.2em]">
          &copy; {{ new Date().getFullYear() }} Florencia • Designed by Neostart
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
}

.animate-fade-up {
  animation: fadeUp 0.8s ease-out forwards;
}

.animate-fade-down {
  animation: fadeDown 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-out forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.4; } /* Matches the initial opacity of the footer text */
}

/* Custom focus styles to match Florencia style */
:deep(.u-input-input) {
  border-radius: 0;
  box-shadow: none !important;
}
</style>

<style scoped>
.font-serif {
  font-family: var(--font-serif);
}
.font-sans {
  font-family: var(--font-sans);
}
</style>
