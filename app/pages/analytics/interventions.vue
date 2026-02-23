<script setup lang="ts">
import { storeToRefs } from 'pinia'

const analyticStore = useAnalyticsStore()
const { interventions } = storeToRefs(analyticStore)

onMounted(() => {
  analyticStore.fetchInterventions()
})

const columns = [
  { accessorKey: 'date', header: 'Date & Heure' },
  { accessorKey: 'personnel', header: 'Employé / Client' },
  { accessorKey: 'service', header: 'Prestation' },
  { accessorKey: 'amount', header: 'Montant' },
  { accessorKey: 'status', header: 'Statut' }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'Fcfa')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('fr-FR', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <div>
      <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Suivi Opérationnel</p>
      <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Relevé des Interventions</h1>
      <p class="text-sm text-neutral-500 font-sans mt-1">Historique précis des prestations réalisées par chaque employé.</p>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="stat in [
        { label: 'Interventions aujourd\'hui', value: '12', icon: 'i-lucide-activity', color: 'text-blue-500' },
        { label: 'Temps moyen / service', value: '45 min', icon: 'i-lucide-clock', color: 'text-amber-500' },
        { label: 'Satisfaction Client', value: '4.8/5', icon: 'i-lucide-star', color: 'text-green-500' }
      ]" :key="stat.label" class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-neutral-50 rounded-xl">
            <UIcon :name="stat.icon" class="w-5 h-5" :class="stat.color" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-0.5">{{ stat.label }}</p>
            <p class="text-xl font-serif text-neutral-800">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
      <UTable :rows="interventions" :columns="columns" :ui="{ td: 'font-sans py-4' }">
        <template #date-data="{ row }">
          <div class="flex flex-col">
            <span class="text-xs font-medium text-neutral-800">{{ formatDate(row.original.date) }}</span>
            <span class="text-[0.65rem] text-neutral-400 capitalize">{{ useTimeAgo(row.original.date).value }}</span>
          </div>
        </template>

        <template #personnel-data="{ row }">
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-neutral-800">{{ row.original.employee }}</span>
              <UIcon name="i-lucide-arrow-right" class="w-3 h-3 text-neutral-300" />
            </div>
            <span class="text-[0.7rem] text-cafe-600 font-medium">{{ row.original.client }}</span>
          </div>
        </template>

        <template #service-data="{ row }">
          <UBadge variant="subtle" color="neutral" class="font-sans text-[0.65rem]">{{ row.original.service }}</UBadge>
        </template>

        <template #amount-data="{ row }">
          <span class="font-serif text-sm">{{ formatCurrency(row.original.amount) }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge 
            :color="row.original.status === 'terminé' ? 'success' : 'warning'" 
            variant="soft" 
            size="xs" 
            class="uppercase tracking-widest text-[0.6rem] font-bold"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-clipboard-x" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucune intervention enregistrée</p>
          </div>
        </template>
      </UTable>
      </div>
    </UCard>
  </div>
</template>
