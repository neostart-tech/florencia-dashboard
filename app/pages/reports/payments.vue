<script setup lang="ts">
import { storeToRefs } from 'pinia'

const analyticStore = useAnalyticsStore()
const { paymentAlerts } = storeToRefs(analyticStore)

onMounted(() => {
  analyticStore.fetchPaymentAlerts()
})

const columns = [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'details', header: 'Référence / Client' },
  { accessorKey: 'amount', header: 'Montant' },
  { accessorKey: 'status', header: 'Statut' },
  { accessorKey: 'actions', header: '', id: 'actions' }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'Fcfa')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <div>
      <p class="text-[0.7rem] uppercase tracking-[0.3em] text-red-500 font-sans mb-1">Attention requise</p>
      <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Alertes Paiements</h1>
      <p class="text-sm text-neutral-500 font-sans mt-1">Gérez les transactions en attente ou ayant échoué.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard class="border-none shadow-sm bg-red-50/50">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-red-100 rounded-xl">
            <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-serif text-red-700">40 500 Fcfa</p>
            <p class="text-[0.65rem] uppercase tracking-widest text-red-400">Total à recouvrer</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="border-none shadow-sm bg-amber-50/50">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-amber-100 rounded-xl">
            <UIcon name="i-lucide-hourglass" class="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-serif text-amber-700">2 dossiers</p>
            <p class="text-[0.65rem] uppercase tracking-widest text-amber-400">En attente de traitement</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="border-none shadow-[0_20px_60px_rgba(239,68,68,0.03)] bg-white rounded-3xl overflow-hidden">
      <UTable :data="paymentAlerts" :columns="columns" :ui="{ td: 'font-sans py-5' }">
        <template #date-cell="{ row }">
          <span class="text-xs text-neutral-500">{{ formatDate(row.original.date) }}</span>
        </template>

        <template #details-cell="{ row }">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-neutral-800">{{ row.original.code }}</span>
            <span class="text-[0.7rem] text-neutral-400">{{ row.original.client }} • {{ row.original.type }}</span>
          </div>
        </template>

        <template #amount-cell="{ row }">
          <span class="font-serif font-medium" :class="row.original.status === 'échoué' ? 'text-red-600' : 'text-amber-600'">
            {{ formatCurrency(row.original.amount) }}
          </span>
        </template>

        <template #status-cell="{ row }">
          <div class="flex flex-col">
            <UBadge 
              :color="row.original.status === 'échoué' ? 'error' : 'warning'" 
              variant="soft" 
              class="uppercase tracking-widest text-[0.55rem] w-fit"
            >
              {{ row.original.status }}
            </UBadge>
            <span class="text-[0.6rem] text-neutral-400 mt-1 italic">{{ row.original.reason }}</span>
          </div>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-check-circle" label="Valider" class="text-[0.6rem] uppercase tracking-widest" />
            <UButton size="xs" color="error" variant="ghost" icon="i-lucide-trash-2" class="text-[0.6rem]" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
