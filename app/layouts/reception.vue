<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { label: 'Accueil', icon: 'i-lucide-home', to: '/receptionnist' },
  { label: 'Caisse / Vente', icon: 'i-lucide-calculator', to: '/receptionnist/caisse' },
  { label: 'Historique Reçus', icon: 'i-lucide-receipt', to: '/receptionnist/factures' },
  { label: 'Clients', icon: 'i-lucide-users', to: '/crm/directory' }, // Réutiliser le répertoire existant
]

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}

const profileItems = computed(() => [
  [
    { label: authStore.user?.nom || 'Réceptionniste', icon: 'i-lucide-user', disabled: true },
  ],
  [
    { label: 'Déconnexion', icon: 'i-lucide-log-out', onSelect: handleLogout, color: 'text-red-500' }
  ]
])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
    <!-- Sidebar Desktop -->
    <aside class="w-64 border-r border-neutral-100 bg-white hidden md:flex flex-col sticky top-0 h-screen z-40">
      <div class="p-8">
        <NuxtLink to="/receptionnist" class="flex flex-col">
          <span class="text-2xl font-serif text-cafe-700 uppercase tracking-[0.2em]">Florencia</span>
          <span class="text-[0.6rem] text-neutral-400 font-sans uppercase tracking-[0.3em] mt-1">Espace Réception</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <UNavigationMenu orientation="vertical" :items="navItems" class="font-sans" />
      </nav>

      <div class="p-4 border-t border-neutral-100">
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-cafe-50/50">
          <UAvatar :src="`https://ui-avatars.com/api/?name=${authStore.user?.nom || 'Reception'}&background=6C4239&color=fff`" size="sm" />
          <div class="flex flex-col truncate">
            <span class="text-sm font-medium text-neutral-800">{{ authStore.user?.nom || 'Réceptionniste' }}</span>
            <span class="text-[0.6rem] text-neutral-400 uppercase tracking-tighter">Session Ouverte</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Header Mobile -->
    <header class="md:hidden h-16 border-b border-neutral-100 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
        <span class="text-xl font-serif text-cafe-700 tracking-widest uppercase">Florencia</span>
        <UDropdownMenu :items="profileItems">
            <UAvatar :src="`https://ui-avatars.com/api/?name=${authStore.user?.nom || 'Reception'}&background=6C4239&color=fff`" size="xs" />
        </UDropdownMenu>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 p-4 lg:p-8 overflow-y-auto">
        <slot />
      </main>
      
      <!-- Bottom Navigation for Mobile -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-100 flex items-center justify-around px-4 z-40">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex flex-col items-center gap-1 text-neutral-400" :class="{ 'text-cafe-700': route.path === item.to }">
          <UIcon :name="item.icon" class="w-6 h-6" />
          <span class="text-[0.6rem] uppercase tracking-tighter font-sans">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.font-serif { font-family: var(--font-serif); }
.font-sans { font-family: var(--font-sans); }
</style>
