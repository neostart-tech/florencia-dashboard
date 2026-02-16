<template>
  <div class="min-h-screen bg-neutral-50 flex">
    <!-- Sidebar Navigation -->
    <aside class="w-64 border-r border-neutral-100 bg-white hidden lg:flex flex-col sticky top-0 h-screen">
      <div class="p-8">
        <NuxtLink to="/" class="flex flex-col">
          <span class="text-3xl font-serif text-cafe-700 uppercase tracking-[0.2em]">Florencia</span>
          <span class="text-[0.6rem] text-neutral-400 font-sans uppercase tracking-[0.3em] mt-1">Admin Dashboard</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 space-y-1">
        <UNavigationMenu
          orientation="vertical"
          :items="[
            { label: 'Tableau de bord', icon: 'i-lucide-layout-dashboard', to: '/' },
            { label: 'Utilisateurs', icon: 'i-lucide-users', to: '/users' },
            { label: 'Personnel', icon: 'i-lucide-contact-2', to: '#' },
          ]"
          class="font-sans"
        />
        
        <div class="pt-6 pb-2 px-4 text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">E-Commerce</div>
        <UNavigationMenu
          orientation="vertical"
          :items="[
            { label: 'Articles', icon: 'i-lucide-package', to: '#' },
            { label: 'Commandes', icon: 'i-lucide-shopping-bag', to: '#' },
            { label: 'Codes Promo', icon: 'i-lucide-ticket', to: '#' },
          ]"
        />

        <div class="pt-6 pb-2 px-4 text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">Réservations</div>
        <UNavigationMenu
          orientation="vertical"
          :items="[
            { label: 'Services', icon: 'i-lucide-scissors', to: '#' },
            { label: 'Réservations', icon: 'i-lucide-calendar', to: '#' },
            { label: 'Calendrier', icon: 'i-lucide-calendar-days', to: '#' },
          ]"
        />
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

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-16 border-b border-neutral-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
        <div class="lg:hidden flex items-center gap-3">
          <span class="text-xl font-serif text-cafe-700 tracking-widest">F.</span>
        </div>
        
        <div class="flex items-center gap-4 ml-auto">
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
            <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-down" trailing>
              <UAvatar src="https://i.pravatar.cc/150?u=admin" size="2xs" />
            </UButton>
          </UDropdown>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>

      <footer class="p-6 border-t border-neutral-100 bg-white text-center">
        <p class="text-[0.65rem] text-neutral-400 font-sans uppercase tracking-[0.2em]">
          Florencia Dashboard &copy; {{ new Date().getFullYear() }} • By Neostart Tech
        </p>
      </footer>
    </div>
  </div>
</template>
