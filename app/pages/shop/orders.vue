<script setup lang="ts">
import { storeToRefs } from 'pinia'

const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)

// Initialisation
onMounted(() => {
  // orderStore.fetchOrders() // Décommenter quand le controller sera prêt
})

const columns = [{
  accessorKey: 'reference',
  header: 'Référence'
}, {
  accessorKey: 'client',
  header: 'Client'
}, {
  accessorKey: 'date',
  header: 'Date'
}, {
  accessorKey: 'total',
  header: 'Montant'
}, {
  accessorKey: 'statut',
  header: 'Statut'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const stats = [
  { label: 'Total Commandes', value: '124', icon: 'i-lucide-shopping-cart' },
  { label: 'En attente', value: '8', icon: 'i-lucide-clock' },
  { label: 'Revenu du mois', value: '1.2M Fcfa', icon: 'i-lucide-banknote' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'termine': return 'green'
    case 'en_cours': return 'orange'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-serif text-neutral-900 tracking-tight">Commandes</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1 italic">Suivez vos ventes et livraisons</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="stat in stats" :key="stat.label" class="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-cafe-50 text-cafe-600">
            <UIcon :name="stat.icon" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-neutral-400 uppercase tracking-widest font-sans">{{ stat.label }}</p>
            <p class="text-2xl font-serif text-neutral-900">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="orders" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #reference-data="{ row }">
          <span class="font-mono text-xs font-bold text-cafe-700">{{ row.original.reference }}</span>
        </template>

        <template #statut-data="{ row }">
          <UBadge :color="getStatusColor(row.original.statut)" variant="subtle" size="sm" class="uppercase text-[0.6rem] tracking-tighter">
            {{ row.original.statut === 'en_cours' ? 'En cours' : 'Terminé' }}
          </UBadge>
        </template>

        <template #total-data="{ row }">
          <span class="font-serif text-neutral-800">{{ row.original.total }}</span>
        </template>

        <template #actions-data="{ row }">
          <UButton color="neutral" variant="ghost" icon="i-lucide-eye" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>
