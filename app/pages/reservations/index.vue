<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Reservation {
  id: string | number
  code: string
  created_at: string
  user?: { nom: string; prenom: string }
  service?: { nom: string }
  horaire?: { heure_debut: string; jour: { libelle: string } }
}

const reservationStore = useReservationStore()
const { reservations: bookings } = storeToRefs(reservationStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  reservationStore.fetchReservations().catch(() => {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les réservations.', color: 'error' })
  })
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
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const handleDelete = async (row: Reservation) => {
  if (!confirm('Annuler cette réservation ?')) return
  try {
    await reservationStore.deleteReservation(row.id as string)
    toast.add({ title: 'Succès', description: 'Réservation annulée', color: 'success' })
    reservationStore.fetchReservations()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-6 animate-page-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-tight uppercase">Réservations</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1 italic">Gérez les rendez-vous de la maison</p>
      </div>
      <div class="flex gap-3">
        <UButton
          variant="outline"
          icon="i-lucide-calendar"
          label="Voir l'agenda"
          class="border-neutral-200 text-neutral-600 font-sans uppercase tracking-widest text-[0.65rem] px-6"
          to="/reservations/calendar"
        />
      </div>
    </div>

    <!-- Booking Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="bookings" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #code-data="{ row }">
          <span class="font-mono text-xs font-bold text-cafe-700 tracking-wider">#{{ (row.original as Reservation).code }}</span>
        </template>

        <template #service-data="{ row }">
          <span class="text-xs font-medium text-neutral-800">{{ (row.original as Reservation).service?.nom }}</span>
        </template>

        <template #client-data="{ row }">
          <span class="text-xs text-neutral-600">{{ (row.original as Reservation).user?.prenom }} {{ (row.original as Reservation).user?.nom }}</span>
        </template>

        <template #dateTime-data="{ row }">
          <div class="flex flex-col">
            <span class="text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">{{ (row.original as Reservation).horaire?.jour?.libelle }}</span>
            <div class="flex items-center gap-1.5 text-xs text-neutral-800 font-medium">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-cafe-400" />
              <span>{{ (row.original as Reservation).horaire?.heure_debut }}</span>
              <span class="text-[0.6rem] text-neutral-400 ml-1">({{ formatDate((row.original as Reservation).created_at) }})</span>
            </div>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="[[{ label: 'Annuler le RDV', icon: 'i-lucide-trash', color: 'error', click: () => handleDelete(row.original as Reservation) }]]">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdown>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-calendar-x" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun rendez-vous trouvé</p>
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
