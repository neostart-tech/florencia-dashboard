<script setup lang="ts">
const selectedType = ref<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('monthly')

const reportStats = computed(() => {
  // Mock data for the report
  return {
    revenue: 2450000,
    bookings: 124,
    newCustomers: 18,
    avgBasket: 19750,
    topServices: [
      { name: 'Soin Visage Signature', count: 42, revenue: 840000 },
      { name: 'Massage Relaxant', count: 28, revenue: 560000 },
      { name: 'Manucure Spa', count: 25, revenue: 250000 }
    ],
    expenses: 850000,
    margin: 1600000
  }
})

const types = [
  { label: 'Journalier', value: 'daily', icon: 'i-lucide-calendar' },
  { label: 'Hebdomadaire', value: 'weekly', icon: 'i-lucide-calendar-days' },
  { label: 'Mensuel', value: 'monthly', icon: 'i-lucide-calendar-range' },
  { label: 'Trimestriel', value: 'quarterly', icon: 'i-lucide-layout-grid' },
  { label: 'Annuel', value: 'annual', icon: 'i-lucide-landmark' }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'Fcfa')
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Analyse Financière</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Rapports d'Activité</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1">Générez des rapports précis pour piloter votre croissance.</p>
      </div>
      
      <div class="flex bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm">
        <button 
          v-for="t in types" 
          :key="t.value"
          @click="selectedType = t.value as any"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.65rem] uppercase tracking-widest transition-all"
          :class="selectedType === t.value ? 'bg-cafe-700 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-600'"
        >
          <UIcon :name="t.icon" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ t.label }}</span>
        </button>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="card in [
        { label: 'Chiffre d\'Affaires', value: formatCurrency(reportStats.revenue), icon: 'i-lucide-banknote', color: 'text-cafe-700' },
        { label: 'Réservations', value: reportStats.bookings, icon: 'i-lucide-calendar-check', color: 'text-neutral-800' },
        { label: 'Panier Moyen', value: formatCurrency(reportStats.avgBasket), icon: 'i-lucide-shopping-cart', color: 'text-neutral-800' },
        { label: 'Marge Nette', value: formatCurrency(reportStats.margin), icon: 'i-lucide-trending-up', color: 'text-green-600' }
      ]" :key="card.label" class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-1">{{ card.label }}</p>
            <p class="text-2xl font-serif" :class="card.color">{{ card.value }}</p>
          </div>
          <div class="p-3 bg-neutral-50 rounded-xl">
             <UIcon :name="card.icon" class="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Top Services Table -->
      <UCard class="lg:col-span-8 border-none shadow-[0_20px_60px_rgba(0,0,0,0.03)] bg-white rounded-3xl overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl text-neutral-800">Top Services (Volume & Revenu)</h3>
            <UButton icon="i-lucide-download" variant="ghost" label="Exporter PDF" class="text-[0.65rem] uppercase tracking-widest" />
          </div>
        </template>
        
        <UTable :rows="reportStats.topServices" :columns="[
          { accessorKey: 'name', header: 'Service' },
          { accessorKey: 'count', header: 'Volume' },
          { accessorKey: 'revenue', header: 'C.A Généré' }
        ]" :ui="{ td: 'font-sans py-4' }">
           <template #revenue-data="{ row }">
             <span class="font-medium text-cafe-700">{{ formatCurrency(row.original.revenue) }}</span>
           </template>
        </UTable>
      </UCard>

      <!-- Distribution / Alerts -->
      <div class="lg:col-span-4 space-y-6">
        <UCard class="border-none shadow-sm bg-cafe-900 text-white rounded-3xl overflow-hidden relative">
          <div class="relative z-10 space-y-4">
            <div class="flex items-center gap-2 text-cafe-300">
               <UIcon name="i-lucide-zap" class="w-4 h-4" />
               <span class="text-[0.65rem] uppercase tracking-[0.2em] font-sans">Focus Clientèle</span>
            </div>
            <p class="text-3xl font-serif">+{{ reportStats.newCustomers }}</p>
            <p class="text-sm text-neutral-400 font-sans leading-relaxed">Nouveaux clients acquis sur cette période.</p>
            <UButton block class="bg-white/10 hover:bg-white/20 text-white border-none text-[0.65rem] uppercase tracking-widest transition-all py-3 rounded-xl mt-4">
              Voir le détail
            </UButton>
          </div>
          <div class="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-cafe-500/20 rounded-full blur-2xl"></div>
        </UCard>

        <UCard class="border-none shadow-sm bg-white rounded-3xl">
          <template #header>
            <h3 class="text-sm font-sans uppercase tracking-widest text-neutral-800">Alertes Paiements</h3>
          </template>
          <div class="space-y-4">
            <div v-for="i in 2" :key="i" class="flex items-start gap-3 p-3 bg-red-50/50 rounded-2xl group border border-transparent hover:border-red-100 transition-all">
              <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-red-500 mt-1" />
              <div>
                <p class="text-xs font-semibold text-neutral-800">Paiement en attente</p>
                <p class="text-[0.65rem] text-neutral-400">Commande #CMD-2490 • 15 500 Fcfa</p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
