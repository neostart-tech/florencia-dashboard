<script setup lang="ts">
definePageMeta({
  layout: 'reception'
})

const search = ref('')
const receipts = ref([
  { id: 'FAC-4592', date: '2025-02-24', total: 45000, client: 'Yao Kouassi', items: 2 },
  { id: 'FAC-8812', date: '2025-02-24', total: 12000, client: 'Awa Traoré', items: 1 },
  { id: 'FAC-3211', date: '2025-02-23', total: 25000, client: 'Jean Marc', items: 3 },
  { id: 'FAC-1002', date: '2025-02-23', total: 85000, client: 'Marie Claire', items: 5 },
])

const columns = [
  { accessorKey: 'id', header: 'Référence' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'items', header: 'Items' },
  { accessorKey: 'total', header: 'Montant' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'actions', header: '' },
]
</script>

<template>
  <div class="space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Comptabilité Réception</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Historique des Reçus</h1>
      </div>
      <div class="flex gap-2">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Rechercher une facture..." size="md" class="w-full md:w-64" variant="outline" />
      </div>
    </div>

    <!-- Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :data="receipts" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #total-cell="{ row }">
          <span class="font-serif text-cafe-700">{{ (row.original as any).total }} FCFA</span>
        </template>
        
        <template #date-cell="{ row }">
          <span class="text-xs text-neutral-500">{{ (row.original as any).date }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-eye" label="Détails" />
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-printer" label="Imprimer" />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-receipt" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun reçu trouvé</p>
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
