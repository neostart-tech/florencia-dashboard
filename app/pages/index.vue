<script setup lang="ts">
const stats = [
  { label: 'Chiffre d\'Affaires', value: '4 850,00 Fcfa', icon: 'i-lucide-coins', trend: '+15%', color: 'cafe' },
  { label: 'Rendez-vous', value: '24', icon: 'i-lucide-calendar-heart', trend: 'Aujourd\'hui', color: 'cafe' },
  { label: 'Panier Moyen', value: '85,00 Fcfa', icon: 'i-lucide-shopping-bag', trend: '+8%', color: 'cafe' },
  { label: 'Satisfaction', value: '98%', icon: 'i-lucide-sparkles', trend: '+2%', color: 'cafe' }
]

const recentBookings = [
  { id: 1, service: 'Soin Visage Signature', client: 'Camille L.', time: '14:30', status: 'confirmé', price: '75 Fcfa' },
  { id: 2, service: 'Manucure Spa', client: 'Léa M.', time: '15:15', status: 'en attente', price: '45 Fcfa' },
  { id: 3, service: 'Massage Relaxant', client: 'Inès R.', time: '16:00', status: 'confirmé', price: '90 Fcfa' }
]

const topServices = [
  { name: 'Soin Visage Signature', share: 45, color: 'bg-cafe-600' },
  { name: 'Massage Californien', share: 30, color: 'bg-cafe-400' },
  { name: 'Manucure & Pose', share: 25, color: 'bg-cafe-200' }
]
</script>

<template>
  <div class="p-4 sm:p-8 lg:p-12 space-y-12 animate-page-in bg-[#FAFAF9]">
    <!-- Welcome Header: More Editorial/Luxury Style -->
    <header class="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 text-white">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="space-y-2">
          <p class="text-[0.7rem] uppercase tracking-[0.4em] text-cafe-300 font-sans">Aperçu Hebdomadaire</p>
          <h1 class="text-4xl md:text-5xl font-serif tracking-wide leading-tight">Bonjour, <span class="italic text-cafe-200">Florencia</span></h1>
          <p class="text-neutral-400 font-sans max-w-md text-sm leading-relaxed">
            Votre maison de beauté rayonne aujourd'hui. Voici les chiffres clés de votre succès.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <UButton 
            icon="i-lucide-calendar" 
            label="Agenda" 
            variant="outline" 
            class="text-white border-white/20 hover:bg-white/10 px-6 py-3 font-sans uppercase tracking-widest text-[0.65rem]" 
          />
          <UButton 
            icon="i-lucide-plus" 
            label="Nouvelle Vente" 
            class="bg-cafe-300 hover:bg-cafe-400 text-neutral-900 px-6 py-3 font-sans uppercase tracking-widest text-[0.65rem] border-none shadow-xl" 
          />
        </div>
      </div>
      <!-- Decorative background elements -->
      <div class="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-cafe-700/20 rotate-12 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-[-50%] left-[-5%] w-[30%] h-[100%] bg-cafe-500/10 -rotate-12 blur-3xl pointer-events-none"></div>
    </header>

    <!-- Stat Cards: Minimalist & Clean -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.label" 
        class="group relative bg-white p-8 rounded-2xl border border-neutral-100 hover:border-cafe-100 transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_rgba(108,66,57,0.05)]"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-cafe-50 rounded-xl group-hover:bg-cafe-600 group-hover:text-white transition-colors duration-500">
            <UIcon :name="stat.icon" class="w-5 h-5" />
          </div>
          <span class="text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400 group-hover:text-cafe-500 transition-colors">
            {{ stat.trend }}
          </span>
        </div>
        <h3 class="text-[0.7rem] font-sans uppercase tracking-[0.2em] text-neutral-400 mb-1">{{ stat.label }}</h3>
        <p class="text-2xl font-serif text-neutral-800 tracking-wider">{{ stat.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
      <!-- Activity Report: Sophisticated Bar Chart -->
      <section class="lg:col-span-8 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-xl font-serif tracking-widest uppercase">Performance Hebdomadaire</h2>
          <ULink to="#" class="text-[0.6rem] uppercase tracking-widest text-cafe-500 hover:text-cafe-600 transition-colors">Détails</ULink>
        </div>
        
        <UCard class="border-none shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden bg-white/60 backdrop-blur-sm rounded-3xl">
          <div class="p-2 sm:p-6 space-y-8">
            <div class="h-64 flex items-end justify-between gap-3 sm:gap-6 px-2">
              <div v-for="i in 7" :key="i" class="relative group flex-1 flex flex-col justify-end items-center h-full">
                <!-- Hover value -->
                <div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span class="bg-neutral-900 text-white text-[10px] px-3 py-1.5 rounded-full font-sans tracking-tight shadow-xl whitespace-nowrap">
                    {{ Math.floor(Math.random() * 500 + 200) }}€
                  </span>
                </div>
                <!-- The Bar -->
                <div 
                  class="w-full bg-neutral-50 rounded-t-xl group-hover:bg-cafe-100 transition-all duration-700 ease-out origin-bottom border-b border-white" 
                  :style="{ height: `${Math.random() * 60 + 30}%` }"
                >
                  <div class="h-full w-full bg-gradient-to-t from-cafe-50/20 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
                </div>
              </div>
            </div>
            <div class="flex justify-between px-4 text-[0.6rem] font-sans uppercase tracking-[0.3em] text-neutral-300">
              <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
            </div>
          </div>
        </UCard>
      </section>

      <!-- Side Section: Rankings & Quick Info -->
      <section class="lg:col-span-4 space-y-8">
        <!-- Top Services -->
        <div class="space-y-6">
          <h2 class="text-lg font-serif tracking-widest uppercase px-2 text-center lg:text-left">Top Services</h2>
          <UCard class="border-none shadow-[0_15px_40px_rgba(0,0,0,0.02)] bg-white rounded-3xl">
            <div class="p-2 space-y-6">
              <div v-for="service in topServices" :key="service.name" class="space-y-2">
                <div class="flex justify-between items-end">
                  <span class="text-[0.7rem] font-sans uppercase tracking-widest text-neutral-600">{{ service.name }}</span>
                  <span class="text-xs font-serif italic text-cafe-600">{{ service.share }}%</span>
                </div>
                <div class="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-1000 ease-in-out" 
                    :class="service.color"
                    :style="{ width: `${service.share}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Recent Reservations: Simple List -->
        <div class="space-y-6">
          <h2 class="text-lg font-serif tracking-widest uppercase px-2 text-center lg:text-left">Rendez-vous</h2>
          <div class="space-y-3">
            <div 
              v-for="booking in recentBookings" 
              :key="booking.id"
              class="flex items-center justify-between p-4 bg-white border border-neutral-50 rounded-2xl hover:border-cafe-100 transition-colors shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div class="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-cafe-50 text-cafe-600">
                  <span class="text-[0.6rem] font-sans font-bold leading-none">{{ booking.time.split(':')[0] }}h</span>
                  <span class="text-[0.5rem] font-sans tracking-tight">{{ booking.time.split(':')[1] }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-medium text-neutral-800">{{ booking.service }}</span>
                  <span class="text-[0.65rem] text-neutral-400 font-sans tracking-wide">avec {{ booking.client }}</span>
                </div>
              </div>
              <span class="text-[0.7rem] font-serif italic text-cafe-500">{{ booking.price }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.animate-page-in {
  animation: pageIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Custom Scrollbar for better UI */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #EFE9E6;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #D69069;
}
</style>

