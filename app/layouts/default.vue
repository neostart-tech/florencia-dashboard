<script setup lang="ts">
const isMobileMenuOpen = ref(false)
const route = useRoute()

// Fermer le menu mobile à chaque changement de route
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

const navItems = [
  { label: 'Tableau de bord', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Utilisateurs', icon: 'i-lucide-users', to: '/users' },
  { label: 'Personnel', icon: 'i-lucide-contact-2', to: '/staff' },
]

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { totalAlerts, allNotifications } = storeToRefs(notificationStore)

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}

const profileItems = computed(() => [
  [
    { label: authStore.user?.nom || 'Mon Profil', icon: 'i-lucide-user', disabled: true },
    { label: 'Paramètres', icon: 'i-lucide-settings', to: '/settings' }
  ],
  [
    { label: 'Déconnexion', icon: 'i-lucide-log-out', onSelect: handleLogout, color: 'text-red-500' }
  ]
])

onMounted(() => {
  notificationStore.fetchAllAlerts()
  // Activer l'audio au premier clic sur la page pour contourner les blocages navigateurs
  const enableAudio = () => {
    notificationStore.initAudio()
    window.removeEventListener('click', enableAudio)
  }
  window.addEventListener('click', enableAudio)
  
  setInterval(() => notificationStore.fetchAllAlerts(), 1 * 60 * 1000) // Rafraîchir toutes les minutes
})

const shopItems = [
  { label: 'Articles', icon: 'i-lucide-package', to: '/shop/articles' },
  { label: 'Stock', icon: 'i-lucide-box', to: '/shop/stock' },
  { label: 'Catégories', icon: 'i-lucide-folder-tree', to: '/shop/categories' },
  { label: 'Fidélité', icon: 'i-lucide-award', to: '/shop/loyalty' },
  { label: 'Commandes', icon: 'i-lucide-shopping-bag', to: '/shop/orders' },
  { label: 'Codes Promo', icon: 'i-lucide-ticket', to: '/shop/promos' },
]

const reservationItems = [
  { label: 'Services', icon: 'i-lucide-scissors', to: '/reservations/services' },
  { label: 'Réservations', icon: 'i-lucide-calendar', to: '/reservations' },
  { label: 'Calendrier', icon: 'i-lucide-calendar-days', to: '/reservations/calendar' },
]

const crmItems = [
  { label: 'Répertoire client', icon: 'i-lucide-users-2', to: '/crm/directory' },
  { label: 'Catégories', icon: 'i-lucide-tag', to: '/crm/categories' },
  { label: 'Alertes Nouveaux', icon: 'i-lucide-user-plus-2', to: '/crm/alerts' },
]

const analyticsItems = [
  { label: 'Rendements', icon: 'i-lucide-trending-up', to: '/analytics/yields' },
  { label: 'Interventions', icon: 'i-lucide-clipboard-list', to: '/analytics/interventions' },
]

const reportItems = [
  { label: 'Alertes Paiements', icon: 'i-lucide-bell-ring', to: '/reports/payments' },
  { label: 'Rapports Périodiques', icon: 'i-lucide-file-bar-chart', to: '/reports/periodic' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const sidebarGroups = computed(() => [
  {
    label: 'Boutique',
    icon: 'i-lucide-shopping-bag',
    slot: 'shop',
    defaultOpen: route.path.startsWith('/shop')
  },
  {
    label: 'Réservations',
    icon: 'i-lucide-calendar-days',
    slot: 'reservations',
    defaultOpen: route.path.startsWith('/reservations')
  },
  {
    label: 'CRM Clients',
    icon: 'i-lucide-contact-2',
    slot: 'crm',
    defaultOpen: route.path.startsWith('/crm')
  },
  {
    label: 'Analyses Personnel',
    icon: 'i-lucide-gauge',
    slot: 'analytics',
    defaultOpen: route.path.startsWith('/analytics')
  },
  {
    label: 'Finance & Rapports',
    icon: 'i-lucide-pie-chart',
    slot: 'reports',
    defaultOpen: route.path.startsWith('/reports')
  }
])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 flex">

    <!-- ===== SIDEBAR DESKTOP ===== -->
    <aside class="w-64 border-r border-neutral-100 bg-white hidden lg:flex flex-col sticky top-0 h-screen z-40">
      <div class="p-8">
        <NuxtLink to="/" class="flex flex-col">
          <span class="text-3xl font-serif text-cafe-700 uppercase tracking-[0.2em]">Florencia</span>
          <span class="text-[0.7rem] text-neutral-400 font-sans uppercase tracking-[0.3em] mt-1">Admin Dashboard</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <UNavigationMenu orientation="vertical" :items="navItems" class="font-sans mb-4" />

        <UAccordion 
          :items="sidebarGroups" 
          multiple
          :ui="{ 
            item: 'p-0 mb-2',
            trigger: 'px-4 py-3 text-[0.8rem] font-sans uppercase tracking-[0.2em] text-neutral-500 hover:text-cafe-700 hover:bg-cafe-50/30 rounded-xl transition-all',
            content: 'pl-4 py-1'
          }"
        >
          <template #shop>
            <UNavigationMenu orientation="vertical" :items="shopItems" />
          </template>
          <template #reservations>
            <UNavigationMenu orientation="vertical" :items="reservationItems" />
          </template>
          <template #crm>
            <UNavigationMenu orientation="vertical" :items="crmItems" />
          </template>
          <template #analytics>
            <UNavigationMenu orientation="vertical" :items="analyticsItems" />
          </template>
          <template #reports>
            <UNavigationMenu orientation="vertical" :items="reportItems" />
          </template>
        </UAccordion>
      </nav>

      <div class="p-4 border-t border-neutral-100">
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-cafe-50/50">
          <UAvatar src="https://i.pravatar.cc/150?u=admin" size="sm" />
          <div class="flex flex-col truncate">
            <span class="text-sm font-medium text-neutral-800">Admin Florencia</span>
            <span class="text-[0.7rem] text-neutral-400 uppercase tracking-tighter">Super Admin</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ===== MOBILE DRAWER OVERLAY ===== -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/40 z-40 lg:hidden"
        @click="isMobileMenuOpen = false"
      />
    </Transition>

    <!-- ===== MOBILE SIDEBAR DRAWER ===== -->
    <Transition name="slide">
      <aside
        v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden"
      >
        <!-- Logo + Close -->
        <div class="p-6 flex items-center justify-between border-b border-neutral-100">
          <NuxtLink to="/" class="flex flex-col" @click="isMobileMenuOpen = false">
            <span class="text-2xl font-serif text-cafe-700 uppercase tracking-[0.2em]">Florencia</span>
            <span class="text-[0.6rem] text-neutral-400 font-sans uppercase tracking-[0.3em] mt-0.5">Admin Dashboard</span>
          </NuxtLink>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isMobileMenuOpen = false" />
        </div>

        <!-- Navigation mobile -->
        <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <!-- Liens directs pour mobile -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-4 px-4 py-3 rounded-xl text-[0.95rem] font-sans transition-all duration-300"
            :class="isActive(item.to) ? 'bg-cafe-800 text-white shadow-lg' : 'text-neutral-600 hover:bg-neutral-50 hover:text-cafe-700'"
            @click="isMobileMenuOpen = false"
          >
            <UIcon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </NuxtLink>

          <UAccordion 
            :items="sidebarGroups" 
            multiple
            class="mt-4"
            :ui="{ 
              item: 'p-0',
              trigger: 'px-4 py-4 text-[0.85rem] font-sans uppercase tracking-[0.2em] text-neutral-400 hover:text-cafe-700 transition-all border-none shadow-none',
              content: 'pl-4'
            }"
          >
            <template #shop>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in shopItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-4 px-4 py-3 rounded-xl text-[0.95rem] font-sans transition-all duration-300"
                  :class="isActive(item.to) ? 'bg-cafe-800 text-white shadow-lg' : 'text-neutral-600 hover:bg-neutral-50 hover:text-cafe-700'"
                  @click="isMobileMenuOpen = false"
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </NuxtLink>
              </div>
            </template>
            <template #reservations>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in reservationItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-4 px-4 py-3 rounded-xl text-[0.95rem] font-sans transition-all duration-300"
                  :class="isActive(item.to) ? 'bg-cafe-800 text-white shadow-lg' : 'text-neutral-600 hover:bg-neutral-50 hover:text-cafe-700'"
                  @click="isMobileMenuOpen = false"
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </NuxtLink>
              </div>
            </template>
            <template #crm>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in crmItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-4 px-4 py-3 rounded-xl text-[0.95rem] font-sans transition-all duration-300"
                  :class="isActive(item.to) ? 'bg-cafe-800 text-white shadow-lg' : 'text-neutral-600 hover:bg-neutral-50 hover:text-cafe-700'"
                  @click="isMobileMenuOpen = false"
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </NuxtLink>
              </div>
            </template>
            <template #analytics>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in analyticsItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-4 px-4 py-3 rounded-xl text-[0.95rem] font-sans transition-all duration-300"
                  :class="isActive(item.to) ? 'bg-cafe-800 text-white shadow-lg' : 'text-neutral-600 hover:bg-neutral-50 hover:text-cafe-700'"
                  @click="isMobileMenuOpen = false"
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </NuxtLink>
              </div>
            </template>
            <template #reports>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in reportItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-4 px-4 py-3 rounded-xl text-[0.95rem] font-sans transition-all duration-300"
                  :class="isActive(item.to) ? 'bg-cafe-800 text-white shadow-lg' : 'text-neutral-600 hover:bg-neutral-50 hover:text-cafe-700'"
                  @click="isMobileMenuOpen = false"
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </NuxtLink>
              </div>
            </template>
          </UAccordion>
        </nav>

        <!-- Profil mobile -->
        <div class="p-4 border-t border-neutral-100">
          <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-cafe-50/50">
            <UAvatar src="https://i.pravatar.cc/150?u=admin" size="sm" />
            <div class="flex flex-col truncate">
              <span class="text-sm font-medium text-neutral-800">Admin Florencia</span>
              <span class="text-[0.7rem] text-neutral-400 uppercase tracking-tighter">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Header -->
      <header class="h-14 lg:h-16 border-b border-neutral-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <!-- Hamburger (mobile) + Logo abrégé -->
        <div class="flex items-center gap-3 lg:hidden">
          <UButton
            id="btn-mobile-menu"
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            @click="isMobileMenuOpen = true"
          />
          <span class="text-xl font-serif text-cafe-700 tracking-widest">Florencia</span>
        </div>

        <!-- Spacer desktop -->
        <div class="hidden lg:block" />

        <!-- Actions header droite -->
        <div class="flex items-center gap-2 lg:gap-4 ml-auto">
          <UColorModeButton />
          <UDropdownMenu 
            :items="[allNotifications.length > 0 ? allNotifications.map(n => ({ ...n, onSelect: () => navigateTo(n.to) })) : [{ label: 'Aucune notification', disabled: true, icon: 'i-lucide-info' }]]" 
            :ui="{ content: 'w-80 z-50' }"
          >
            <UButton
              icon="i-lucide-bell"
              color="neutral"
              variant="ghost"
              class="relative hover:bg-cafe-50 transition-all duration-200"
            >
              <span v-if="totalAlerts > 0" class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-[0.6rem] flex items-center justify-center rounded-full border-2 border-white font-bold animate-pulse">
                {{ totalAlerts }}
              </span>
            </UButton>

            <template #item="{ item }">
              <div v-if="item.id" class="w-full flex items-start gap-4 p-4 hover:bg-neutral-50 transition-all duration-200 cursor-pointer border-b border-neutral-50 last:border-0 border-none">
                <div class="p-2.5 bg-neutral-100 rounded-2xl shrink-0">
                  <UIcon :name="item.icon" :class="['w-5 h-5', (item as any).color]" />
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                  <div class="flex items-center justify-between mb-0.5">
                    <span class="text-xs font-bold text-neutral-800">{{ item.label }}</span>
                    <!-- @ts-ignore -->
                    <span v-if="item.time" class="text-[0.6rem] text-neutral-400">{{ (useTimeAgo(item.time as string)).value }}</span>
                  </div>
                  <span class="text-[0.7rem] text-neutral-500 leading-relaxed truncate">{{ item.description }}</span>
                </div>
              </div>
              <div v-else class="flex items-center gap-2 p-2 px-3">
                <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 text-neutral-400" />
                <span class="text-xs text-neutral-500">{{ item.label }}</span>
              </div>
            </template>
          </UDropdownMenu>
          <UDropdownMenu :items="profileItems" :ui="{ content: 'w-56' }">
            <UButton color="neutral" variant="ghost" trailing class="hover:bg-cafe-50">
              <UAvatar :src="`https://ui-avatars.com/api/?name=${authStore.user?.nom || 'Admin'}&background=6C4239&color=fff`" size="2xs" />
              <UIcon name="i-lucide-chevron-down" class="w-3 h-3 ml-1 hidden sm:block" />
            </UButton>
          </UDropdownMenu>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="p-4 lg:p-6 border-t border-neutral-100 bg-white text-center">
        <p class="text-[0.65rem] text-neutral-400 font-sans uppercase tracking-[0.2em]">
          Florencia Dashboard &copy; {{ new Date().getFullYear() }} • By Neostart Tech
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Overlay overlay fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Sidebar slide */
.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
