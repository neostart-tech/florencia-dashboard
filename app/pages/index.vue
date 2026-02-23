<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Appel des stores pour les stats réelles
const userStore = useUserStore()
const articleStore = useArticleStore()
const serviceStore = useServiceStore()

const { users } = storeToRefs(userStore)
const { articles } = storeToRefs(articleStore)
const { services } = storeToRefs(serviceStore)

const analyticStore = useAnalyticsStore()
const { periodicReports } = storeToRefs(analyticStore)

onMounted(() => {
  // Charger les données pour alimenter les stats
  Promise.all([
    userStore.fetchUsers(),
    articleStore.fetchArticles(),
    serviceStore.fetchServices(),
    analyticStore.fetchPeriodicReport('monthly')
  ])
})

const stats = computed(() => [
  { label: 'Utilisateurs', value: users.value.length.toString(), icon: 'i-lucide-users', trend: 'Total', color: 'cafe' },
  { label: 'Services', value: services.value.length.toString(), icon: 'i-lucide-scissors', trend: 'Catalogue', color: 'cafe' },
  { label: 'Articles Boutique', value: articles.value.length.toString(), icon: 'i-lucide-package', trend: 'Stock', color: 'cafe' },
  { label: 'Chiffre Mensuel', value: periodicReports.value.monthly ? `${periodicReports.value.monthly.revenue} Fcfa` : '— Fcfa', icon: 'i-lucide-coins', trend: 'Mois en cours', color: 'cafe' }
])

// On garde les rendez-vous mockés car le controller n'est pas encore prêt backend
const recentBookings = [
  { id: 1, service: 'Soin Visage Signature', client: 'Camille L.', time: '14:30', status: 'confirmé', price: '— Fcfa' },
  { id: 2, service: 'Manucure Spa', client: 'Léa M.', time: '15:15', status: 'en attente', price: '— Fcfa' },
  { id: 3, service: 'Massage Relaxant', client: 'Inès R.', time: '16:00', status: 'confirmé', price: '— Fcfa' }
]

const topServices = computed(() => [
  { name: services.value[0]?.nom || 'Soin Visage', share: 45, color: 'bg-cafe-600' },
  { name: services.value[1]?.nom || 'Massage', share: 30, color: 'bg-cafe-400' },
  { name: 'Autres', share: 25, color: 'bg-cafe-200' }
])
</script>

<template>
  <div class="p-4 sm:p-8 lg:p-12 space-y-12 animate-page-in bg-[#FAFAF9]">
    <!-- Welcome Header -->
    <header class="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 text-white shadow-2xl">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="space-y-2">
          <p class="text-[0.7rem] uppercase tracking-[0.4em] text-cafe-300 font-sans">Maison Florencia • Admin</p>
          <h1 class="text-4xl md:text-5xl font-serif tracking-wide leading-tight">Bonjour, <span class="italic text-cafe-200">Florencia</span></h1>
          <p class="text-neutral-400 font-sans max-w-md text-sm leading-relaxed">
            Votre plateforme est désormais connectée au backend. Gérez votre activité en temps réel.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <UButton 
            icon="i-lucide-calendar" 
            label="Agenda" 
            variant="outline" 
            to="/reservations/calendar"
            class="text-white border-white/20 hover:bg-white/10 px-6 py-3 font-sans uppercase tracking-widest text-[0.65rem]" 
          />
          <UButton 
            icon="i-lucide-plus" 
            label="Nouveau Service" 
            to="/reservations/services"
            class="bg-cafe-300 hover:bg-cafe-400 text-neutral-900 px-6 py-3 font-sans uppercase tracking-widest text-[0.65rem] border-none shadow-xl" 
          />
        </div>
      </div>
      <div class="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-cafe-700/20 rotate-12 blur-3xl pointer-events-none"></div>
    </header>

    <!-- Stat Cards Dynamic -->
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
      <!-- Activity Report -->
      <section class="lg:col-span-8 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-xl font-serif tracking-widest uppercase">Performance Hebdomadaire</h2>
        </div>
        <UCard class="border-none shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden bg-white/60 backdrop-blur-sm rounded-3xl">
          <div class="p-2 sm:p-6 space-y-8 text-center text-neutral-300 italic py-24 font-sans text-sm">
            Statistiques de vente en cours de synchronisation...
          </div>
        </UCard>
      </section>

      <!-- Side Section -->
      <section class="lg:col-span-4 space-y-8">
        <div class="space-y-6">
          <h2 class="text-lg font-serif tracking-widest uppercase px-2 text-center lg:text-left">Services Populaires</h2>
          <UCard class="border-none shadow-[0_15px_40px_rgba(0,0,0,0.02)] bg-white rounded-3xl">
            <div class="p-2 space-y-6">
              <div v-for="service in topServices" :key="service.name" class="space-y-2">
                <div class="flex justify-between items-end">
                  <span class="text-[0.7rem] font-sans uppercase tracking-widest text-neutral-600">{{ service.name }}</span>
                  <span class="text-xs font-serif italic text-cafe-600">{{ service.share }}%</span>
                </div>
                <div class="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-cafe-600" :style="{ width: `${service.share}%` }"></div>
                </div>
              </div>
            </div>
          </UCard>
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
</style>
