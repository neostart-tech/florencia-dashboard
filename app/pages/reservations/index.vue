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
const serviceStore = useServiceStore()
const userStore = useUserStore()
const horaireStore = useHoraireStore()
const personnelStore = usePersonnelStore()

const { reservations: bookings, loading } = storeToRefs(reservationStore)
const { services } = storeToRefs(serviceStore)
const { clients } = storeToRefs(userStore)
const { horaires } = storeToRefs(horaireStore)
const { personnels } = storeToRefs(personnelStore)

const toast = useToast()
const isModalOpen = ref(false)
const isSubmitting = ref(false)

const newBooking = ref({
  user_id: '',
  service_id: '',
  horaire_id: '',
  personnel_id: ''
})

// Initialisation
onMounted(async () => {
  await Promise.all([
    reservationStore.fetchReservations(),
    serviceStore.fetchServices(),
    userStore.fetchClients(),
    horaireStore.fetchHoraires(),
    personnelStore.fetchPersonnels()
  ]).catch(() => {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les données.', color: 'error' })
  })
})

const filteredHoraires = computed(() => {
  if (!newBooking.value.service_id) return []
  return horaires.value.filter((h: any) => h.service_id.toString() === newBooking.value.service_id.toString())
})

const selectedHoraire = computed<any>(() => {
  if (!newBooking.value.horaire_id) return null
  return horaires.value.find((h: any) => h.id.toString() === newBooking.value.horaire_id.toString())
})

const handleCreateReservation = async () => {
  if (!newBooking.value.user_id || !newBooking.value.service_id || !newBooking.value.horaire_id || !newBooking.value.personnel_id) {
    toast.add({ title: 'Champs requis', description: 'Veuillez remplir tous les champs.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await reservationStore.createReservation(newBooking.value)
    toast.add({ title: 'Succès', description: 'Réservation créée avec succès', color: 'success' })
    isModalOpen.value = false
    newBooking.value = { user_id: '', service_id: '', horaire_id: '', personnel_id: '' }
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.response?.data?.message || 'Erreur lors de la création', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

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
  accessorKey: 'payment',
  header: 'Paiement'
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
        <UButton
          icon="i-lucide-plus"
          label="Nouveau RDV"
          class="bg-cafe-700 hover:bg-cafe-800 text-white font-sans uppercase tracking-widest text-[0.65rem] px-6 shadow-lg shadow-cafe-100/50"
          @click="isModalOpen = true"
        />
      </div>
    </div>

    <!-- Booking Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :data="bookings" :columns="columns" :loading="loading" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #code-cell="{ row }">
          <span class="font-mono text-xs font-bold text-cafe-700 tracking-wider">#{{ (row.original as any).code }}</span>
        </template>

        <template #service-cell="{ row }">
          <span class="text-xs font-medium text-neutral-800">{{ (row.original as any).service?.nom }}</span>
        </template>

        <template #client-cell="{ row }">
          <span class="text-xs text-neutral-600">{{ (row.original as any).user?.nom }}</span>
        </template>

        <template #dateTime-cell="{ row }">
          <div class="flex flex-col">
            <span class="text-[0.65rem] font-sans uppercase tracking-widest text-neutral-400">{{ (row.original as any).horaire?.jour?.libelle }}</span>
            <div class="flex items-center gap-1.5 text-xs text-neutral-800 font-medium">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-cafe-400" />
              <span>{{ (row.original as any).horaire?.heure_debut }}</span>
              <span class="text-[0.6rem] text-neutral-400 ml-1">({{ formatDate((row.original as any).created_at) }})</span>
            </div>
          </div>
        </template>

        <template #payment-cell="{ row }">
          <div class="flex flex-col">
            <span class="text-xs font-semibold text-neutral-800">
              {{ (row.original as any).paiements?.reduce((acc: any, p: any) => acc + p.montant, 0) || 0 }} Fcfa
            </span>
            <UBadge 
              :color="(row.original as any).paiements?.length > 0 ? 'success' : 'warning'" 
              variant="subtle" 
              size="sm" 
              class="w-fit text-[0.6rem] uppercase px-2 mt-1"
            >
              {{ (row.original as any).paiements?.length > 0 ? 'Réglé' : 'En attente' }}
            </UBadge>
          </div>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="[[{ label: 'Annuler le RDV', icon: 'i-lucide-trash', color: 'error', onSelect: () => handleDelete(row.original as any) }]]">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdownMenu>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-calendar-x" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun rendez-vous trouvé</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Nouvelle Réservation -->
    <UModal v-model:open="isModalOpen" size="lg" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-serif text-2xl tracking-wide uppercase text-neutral-800">Prise de RDV manuelle</h3>
            <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-0.5">Enregistrement pour un client</p>
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false" />
        </div>
      </template>

      <template #body>
        <form class="space-y-6" @submit.prevent="handleCreateReservation">
          <!-- Client -->
          <UFormField label="Client" required>
            <select v-model="newBooking.user_id" class="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cafe-200 transition">
              <option value="">Sélectionner un client</option>
              <option v-for="u in clients" :key="u.id" :value="u.id">{{ u.nom }} ({{ u.email }})</option>
            </select>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Service -->
            <UFormField label="Prestation" required>
              <select v-model="newBooking.service_id" @change="newBooking.horaire_id = ''; newBooking.personnel_id = ''" class="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cafe-200 transition">
                <option value="">Choisir un service</option>
                <option v-for="s in services" :key="s.id" :value="s.id">{{ s.nom }}</option>
              </select>
            </UFormField>

            <!-- Créneau -->
            <UFormField label="Créneau horaire" required>
              <select v-model="newBooking.horaire_id" @change="newBooking.personnel_id = ''" :disabled="!newBooking.service_id" class="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cafe-200 transition disabled:opacity-50 disabled:bg-neutral-50">
                <option value="">Sélectionner l'heure</option>
                <option v-for="h in filteredHoraires" :key="h.id" :value="h.id">{{ h.jour?.libelle }} à {{ h.heure_debut }}</option>
              </select>
            </UFormField>
          </div>

          <!-- Personnel -->
          <UFormField label="Attribuer à un employé" required>
            <select v-model="newBooking.personnel_id" :disabled="!newBooking.horaire_id" class="w-full h-11 rounded-xl border border-neutral-200 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cafe-200 transition disabled:opacity-50 disabled:bg-neutral-50">
              <option value="">Choisir le collaborateur</option>
              <template v-if="selectedHoraire">
                <option v-for="p in selectedHoraire.personnels" :key="p.id" :value="p.id">{{ p.prenom }} {{ p.nom }}</option>
              </template>
            </select>
          </UFormField>

          <div class="p-4 bg-cafe-50/50 rounded-2xl border border-cafe-100 flex items-start gap-3">
             <UIcon name="i-lucide-info" class="w-5 h-5 text-cafe-500 mt-0.5" />
             <p class="text-[0.7rem] text-cafe-600 leading-relaxed">
               La réservation sera générée et pourra être consultée dans le calendrier. Le client recevra une notification si configuré.
             </p>
          </div>
        </form>
      </template>

      <template #footer>
        <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false" />
        <UButton
          label="Confirmer le RDV"
          class="bg-cafe-700 hover:bg-cafe-800 text-white px-8 font-sans uppercase tracking-[0.2em] text-xs shadow-lg"
          :loading="isSubmitting"
          @click="handleCreateReservation"
        />
      </template>
    </UModal>
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
