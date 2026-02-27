<script setup lang="ts">
definePageMeta({
  layout: 'reception'
})

const authStore = useAuthStore()
const date = new Date()
const formattedDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)

const quickStats = [
  { label: 'Ventes du jour', value: '145 000 FCFA', icon: 'i-lucide-banknote', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Reçus émis', value: '12', icon: 'i-lucide-receipt', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'RDV en attente', value: '4', icon: 'i-lucide-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const recentActions = [
  { label: 'Nouvelle Vente', icon: 'i-lucide-plus-circle', to: '/receptionnist/caisse' },
  { label: 'Voir Historique', icon: 'i-lucide-history', to: '/receptionnist/factures' },
  { label: 'Ajouter Client', icon: 'i-lucide-user-plus', to: '/crm/directory' }, // Simplifié pour rediriger
]
</script>

<template>
  <div class="space-y-8 animate-page-in">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">{{ formattedDate }}</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Bonjour, {{ authStore.user?.prenom || 'Réception' }}</h1>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="stat in quickStats" :key="stat.label" class="border-none shadow-sm hover:shadow-md transition-shadow duration-300 rounded-3xl">
        <div class="flex items-center gap-5">
          <div :class="[stat.bg, 'p-4 rounded-2xl flex-shrink-0']">
            <UIcon :name="stat.icon" :class="[stat.color, 'w-8 h-8']" />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs text-neutral-400 font-sans uppercase tracking-widest">{{ stat.label }}</span>
            <span class="text-2xl font-serif text-neutral-800 truncate">{{ stat.value }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UButton
        v-for="action in recentActions"
        :key="action.label"
        :to="action.to"
        block
        size="xl"
        variant="outline"
        class="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-neutral-200 hover:border-cafe-300 hover:bg-cafe-50/50 rounded-3xl transition-all group"
      >
        <UIcon :name="action.icon" class="w-10 h-10 text-neutral-300 group-hover:text-cafe-500 transition-colors" />
        <span class="text-sm font-serif uppercase tracking-widest text-neutral-600 group-hover:text-neutral-800 px-4 text-center">{{ action.label }}</span>
      </UButton>
    </div>

    <!-- Info Section -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden p-2">
      <template #header>
        <div class="flex items-center justify-between px-4 py-2">
          <h3 class="font-serif text-lg text-neutral-800 uppercase tracking-widest">Aperçu Journalier</h3>
          <UIcon name="i-lucide-activity" class="w-5 h-5 text-neutral-300" />
        </div>
      </template>
      <div class="py-12 text-center text-neutral-400 font-sans italic">
        Aucune activité inhabituelle pour le moment.
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.animate-page-in {
  animation: pageIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
