<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Order {
  id: string | number
  reference: string
  prix_total: number
  statut: string
  created_at: string
  user?: { nom: string; prenom: string; email: string }
}

const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  orderStore.fetchOrders().catch(() => {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les commandes.', color: 'error' })
  })
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

const handleUpdateStatus = async (order: Order, newStatus: string) => {
  try {
    await orderStore.updateOrderStatus(order.id, newStatus)
    toast.add({ title: 'Succès', description: 'Statut mis à jour', color: 'success' })
    orderStore.fetchOrders()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'termine':
    case 'livré': return 'success'
    case 'en_cours':
    case 'payé': return 'primary'
    case 'attente': return 'warning'
    default: return 'neutral'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Ventes & Expéditions</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Commandes</h1>
      </div>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cafe-50 rounded-xl text-cafe-600">
            <UIcon name="i-lucide-shopping-bag" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400">Total Commandes</p>
            <p class="text-2xl font-serif text-neutral-800">{{ orders.length }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Orders Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="orders" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #reference-data="{ row }">
          <span class="font-mono text-xs font-bold text-cafe-700 tracking-wider">#{{ (row.original as any).reference.substring(0, 8) }}</span>
        </template>

        <template #client-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-neutral-800">{{ (row.original as any).user?.prenom }} {{ (row.original as any).user?.nom }}</span>
            <span class="text-[0.65rem] text-neutral-400">{{ (row.original as any).user?.email }}</span>
          </div>
        </template>

        <template #date-data="{ row }">
          <span class="text-xs text-neutral-600">{{ formatDate((row.original as any).created_at) }}</span>
        </template>

        <template #total-data="{ row }">
          <span class="font-serif text-neutral-800">{{ (row.original as any).prix_total }} Fcfa</span>
        </template>

        <template #statut-data="{ row }">
          <UBadge :color="getStatusColor((row.original as any).statut)" variant="subtle" size="sm" class="uppercase text-[0.6rem] tracking-widest px-2">
            {{ (row.original as any).statut }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdownMenu :items="[
            [{ label: 'Marquer comme Livré', icon: 'i-lucide-check-circle', onSelect: () => handleUpdateStatus(row.original as any, 'Livré') }],
            [{ label: 'Annuler', icon: 'i-lucide-x-circle', color: 'error' as const }]
          ]">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdownMenu>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-package-open" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucune commande enregistrée</p>
          </div>
        </template>
      </UTable>
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
