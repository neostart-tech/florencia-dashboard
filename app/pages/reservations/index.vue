<script setup lang="ts">
import { storeToRefs } from 'pinia'

const reservationStore = useReservationStore()
const { reservations: bookings } = storeToRefs(reservationStore)

// Initialisation
onMounted(() => {
  // reservationStore.fetchReservations() // Décommenter quand le controller sera prêt
})

const columns = [{
  accessorKey: 'code',
  header: 'Code'
}, {
  accessorKey: 'service',
  header: 'Service'
}, {
  accessorKey: 'client',
  header: 'Client'
}, {
  accessorKey: 'dateTime',
  header: 'Date & Heure'
}, {
  accessorKey: 'statut',
  header: 'Statut'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case 'confirmé': return 'green'
    case 'en_attente': return 'orange'
    case 'annulé': return 'red'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-6 animate-page-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-serif text-neutral-900 tracking-tight">Réservations</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1 italic">Gérez les rendez-vous de la maison</p>
      </div>
      <div class="flex gap-3">
        <UButton
          variant="ghost"
          icon="i-lucide-filter"
          label="Filtrer"
          color="neutral"
        />
        <UButton
          icon="i-lucide-calendar"
          label="Voir l'agenda"
          color="neutral"
          to="/reservations/calendar"
        />
      </div>
    </div>

    <!-- Booking Cards (Mobile View) / Table (Desktop) -->
    <UCard class="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="bookings" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #code-data="{ row }">
          <span class="font-mono text-xs font-bold text-cafe-700">{{ row.original.code }}</span>
        </template>

        <template #statut-data="{ row }">
          <div class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full" :class="`bg-${getStatusColor(row.original.statut as string | undefined)}-500`"></span>
            <span class="text-xs font-medium capitalize">{{ (row.original.statut as string | undefined)?.replace('_', ' ') ?? '-' }}</span>
          </div>
        </template>

        <template #service-data="{ row }">
          <UBadge variant="subtle" color="neutral" class="font-sans">
            {{ row.original.service }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>
