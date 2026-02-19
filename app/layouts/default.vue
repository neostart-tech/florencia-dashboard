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

const shopItems = [
  { label: 'Articles', icon: 'i-lucide-package', to: '/shop/articles' },
  { label: 'Commandes', icon: 'i-lucide-shopping-bag', to: '/shop/orders' },
  { label: 'Codes Promo', icon: 'i-lucide-ticket', to: '/shop/promos' },
]

const reservationItems = [
  { label: 'Services', icon: 'i-lucide-scissors', to: '/reservations/services' },
  { label: 'Réservations', icon: 'i-lucide-calendar', to: '/reservations' },
  { label: 'Calendrier', icon: 'i-lucide-calendar-days', to: '/reservations/calendar' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 flex">

    <!-- ===== SIDEBAR DESKTOP ===== -->
    <aside class="w-64 border-r border-neutral-100 bg-white hidden lg:flex flex-col sticky top-0 h-screen z-40">
      <div class="p-8">
        <NuxtLink to="/" class="flex flex-col">
          <span class="text-3xl font-serif text-cafe-700 uppercase tracking-[0.2em]">Florencia</span>
          <span class="text-[0.6rem] text-neutral-400 font-sans uppercase tracking-[0.3em] mt-1">Admin Dashboard</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
        <UNavigationMenu orientation="vertical" :items="navItems" class="font-sans" />

        <div class="pt-6 pb-2 px-4 text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">E-Commerce</div>
        <UNavigationMenu orientation="vertical" :items="shopItems" />

        <div class="pt-6 pb-2 px-4 text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">Réservations</div>
        <UNavigationMenu orientation="vertical" :items="reservationItems" />
      </nav>

      <div class="p-4 border-t border-neutral-100">
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-cafe-50/50">
          <UAvatar src="https://i.pravatar.cc/150?u=admin" size="sm" />
          <div class="flex flex-col truncate">
            <span class="text-xs font-medium text-neutral-800">Admin Florencia</span>
            <span class="text-[0.6rem] text-neutral-400 uppercase tracking-tighter">Super Admin</span>
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
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors"
            :class="isActive(item.to) ? 'bg-cafe-50 text-cafe-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'"
            @click="isMobileMenuOpen = false"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>

          <div class="pt-4 pb-1 px-3 text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">E-Commerce</div>
          <NuxtLink
            v-for="item in shopItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors"
            :class="isActive(item.to) ? 'bg-cafe-50 text-cafe-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'"
            @click="isMobileMenuOpen = false"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>

          <div class="pt-4 pb-1 px-3 text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">Réservations</div>
          <NuxtLink
            v-for="item in reservationItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors"
            :class="isActive(item.to) ? 'bg-cafe-50 text-cafe-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'"
            @click="isMobileMenuOpen = false"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Profil mobile -->
        <div class="p-4 border-t border-neutral-100">
          <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-cafe-50/50">
            <UAvatar src="https://i.pravatar.cc/150?u=admin" size="sm" />
            <div class="flex flex-col truncate">
              <span class="text-xs font-medium text-neutral-800">Admin Florencia</span>
              <span class="text-[0.6rem] text-neutral-400 uppercase tracking-tighter">Super Admin</span>
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
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
            class="relative"
          >
            <span class="absolute top-2 right-2 w-2 h-2 bg-cafe-500 rounded-full border-2 border-white"></span>
          </UButton>
          <UDropdown :items="[[{ label: 'Profil', icon: 'i-lucide-user' }, { label: 'Déconnexion', icon: 'i-lucide-log-out', to: '/login' }]]">
            <UButton color="neutral" variant="ghost" trailing>
              <UAvatar src="https://i.pravatar.cc/150?u=admin" size="2xs" />
              <UIcon name="i-lucide-chevron-down" class="w-3 h-3 ml-1 hidden sm:block" />
            </UButton>
          </UDropdown>
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
