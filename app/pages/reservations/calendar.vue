<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Calendar {
  id: string | number
  debut: string
  fin: string
  is_active: boolean
}

interface Horaire {
  id: string | number
  heure_debut: string
  heure_fin: string
  nbre_clients: number
  jour: { libelle: string }
  service: { nom: string }
}

const calendrierStore = useCalendrierStore()
const horaireStore = useHoraireStore()
const serviceStore = useServiceStore()
const personnelStore = usePersonnelStore()

const { calendriers: calendars } = storeToRefs(calendrierStore)
const { horaires } = storeToRefs(horaireStore)
const { services } = storeToRefs(serviceStore)
const { personnels } = storeToRefs(personnelStore)

const toast = useToast()
const isModalOpen = ref(false)
const isHoraireModalOpen = ref(false)
const selectedCalendarId = ref<string | number | null>(null)

// Formulaires
const newCalendar = ref({ debut: '', fin: '' })
const newHoraire = ref({
  calendrier_id: '',
  service_id: '',
  personnels: [] as string[],
  jour_numero: 1,
  heure_debut: '09:00',
  heure_fin: '10:00',
  nbre_clients: 1
})

onMounted(() => {
  calendrierStore.fetchCalendriers()
  horaireStore.fetchHoraires()
  serviceStore.fetchServices()
  personnelStore.fetchPersonnels()
})

const handleCreateCalendar = async () => {
  try {
    await calendrierStore.createCalendrier(newCalendar.value)
    toast.add({ title: 'Succès', description: 'Période planifiée', color: 'success' })
    isModalOpen.value = false
    calendrierStore.fetchCalendriers()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: 'Vérifiez les dates', color: 'error' })
  }
}

const handleCreateHoraire = async () => {
  if (!selectedCalendarId.value) return
  newHoraire.value.calendrier_id = selectedCalendarId.value.toString()
  
  try {
    await horaireStore.createHoraire(newHoraire.value)
    toast.add({ title: 'Succès', description: 'Créneau ajouté', color: 'success' })
    isHoraireModalOpen.value = false
    horaireStore.fetchHoraires()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: 'Impossible d\'ajouter ce créneau', color: 'error' })
  }
}

const toggleActive = async (cal: Calendar) => {
  try {
    await calendrierStore.updateCalendrier({ ...cal, is_active: !cal.is_active })
    calendrierStore.fetchCalendriers()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const deleteCal = async (id: string | number) => {
  if (confirm('Supprimer cette période et tous ses horaires ?')) {
    await calendrierStore.deleteCalendrier(id as string)
    calendrierStore.fetchCalendriers()
  }
}

const deleteHr = async (id: string | number) => {
  await horaireStore.deleteHoraire(id as string)
  horaireStore.fetchHoraires()
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Planning Maison</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Calendrier & Disponibilités</h1>
      </div>
      <UButton
        icon="i-lucide-calendar-plus"
        label="Nouvelle Période"
        class="bg-cafe-700 hover:bg-cafe-800 text-white px-6 py-3 shadow-xl uppercase tracking-widest text-[0.65rem] font-sans"
        @click="isModalOpen = true"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Liste des périodes -->
      <div class="lg:col-span-4 space-y-4">
        <h2 class="text-xs font-sans uppercase tracking-[0.2em] text-neutral-400 px-2">Périodes de validité</h2>
        <div v-for="cal in calendars" :key="cal.id" 
          class="p-5 rounded-2xl border-2 transition-all cursor-pointer group"
          :class="[
            cal.is_active ? 'border-cafe-200 bg-cafe-50/50 shadow-md' : 'border-neutral-100 bg-white opacity-70 hover:opacity-100',
            selectedCalendarId === cal.id ? 'ring-2 ring-cafe-400 shadow-lg' : ''
          ]"
          @click="selectedCalendarId = cal.id"
        >
          <div class="flex justify-between items-start mb-3">
            <UBadge :color="cal.is_active ? 'primary' : 'neutral'" variant="subtle" size="sm" class="uppercase text-[0.6rem]">
              {{ cal.is_active ? 'Active' : 'Archivée' }}
            </UBadge>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton color="neutral" variant="ghost" icon="i-lucide-toggle-left" size="xs" @click.stop="toggleActive(cal)" />
              <UButton color="error" variant="ghost" icon="i-lucide-trash" size="xs" @click.stop="deleteCal(cal.id)" />
            </div>
          </div>
          <p class="text-sm font-serif text-neutral-800">Du {{ new Date(cal.debut).toLocaleDateString() }}</p>
          <p class="text-sm font-serif text-neutral-800">Au {{ new Date(cal.fin).toLocaleDateString() }}</p>
          
          <UButton 
            v-if="selectedCalendarId === cal.id"
            label="Ajouter un créneau" 
            variant="link" 
            icon="i-lucide-plus"
            size="xs"
            class="p-0 mt-4 text-cafe-600 font-sans uppercase tracking-widest text-[0.6rem]"
            @click.stop="isHoraireModalOpen = true"
          />
        </div>
      </div>

      <!-- Créneaux de la période sélectionnée -->
      <div class="lg:col-span-8">
        <UCard v-if="selectedCalendarId" class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-serif text-lg text-neutral-800">Créneaux horaires</h3>
              <UButton icon="i-lucide-plus" label="Ajouter" size="xs" color="neutral" @click="isHoraireModalOpen = true" />
            </div>
          </template>

          <div class="overflow-x-auto">
            <UTable :rows="horaires.filter((h: any) => h.calendrier_id === selectedCalendarId)" :columns="[
              { accessorKey: 'jour', header: 'Jour' },
              { accessorKey: 'temps', header: 'Heures' },
              { accessorKey: 'service', header: 'Prestation' },
              { accessorKey: 'actions', header: '', id: 'actions' }
            ]">
              <template #jour-data="{ row }">
                 <span class="font-sans font-medium uppercase text-[0.7rem] tracking-widest">{{ row.original.jour?.libelle }}</span>
              </template>
              <template #temps-data="{ row }">
                 <span class="text-xs text-neutral-600">{{ row.original.heure_debut }} - {{ row.original.heure_fin }}</span>
              </template>
              <template #service-data="{ row }">
                 <span class="text-xs italic text-cafe-600">{{ row.original.service?.nom }}</span>
              </template>
              <template #actions-data="{ row }">
                <UButton color="error" variant="ghost" icon="i-lucide-trash" size="xs" @click="deleteHr(row.original.id)" />
              </template>
            </UTable>
          </div>
        </UCard>
        
        <div v-else class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 rounded-3xl text-neutral-300">
           <UIcon name="i-lucide-mouse-pointer-2" class="w-8 h-8 mb-2" />
           <p class="text-sm font-sans uppercase tracking-widest">Sélectionnez une période à gauche</p>
        </div>
      </div>
    </div>

    <!-- Modal Période -->
    <UModal v-model="isModalOpen">
      <UCard :ui="{ body: 'p-8' }">
        <h3 class="font-serif text-xl mb-6 uppercase tracking-wide">Nouvelle Période</h3>
        <div class="space-y-4">
          <UFormField label="Date de début"><UInput v-model="newCalendar.debut" type="date" /></UFormField>
          <UFormField label="Date de fin"><UInput v-model="newCalendar.fin" type="date" /></UFormField>
          <div class="flex justify-end gap-3 pt-4">
            <UButton label="Annuler" variant="ghost" @click="isModalOpen = false" />
            <UButton label="Créer" class="bg-cafe-700" @click="handleCreateCalendar" />
          </div>
        </div>
      </UCard>
    </UModal>

    <!-- Modal Créneau -->
    <UModal v-model="isHoraireModalOpen">
      <UCard :ui="{ body: 'p-8' }">
        <h3 class="font-serif text-xl mb-6 uppercase tracking-wide">Ajouter un créneau</h3>
        <form class="space-y-4" @submit.prevent="handleCreateHoraire">
          <UFormField label="Jour de la semaine">
            <select v-model="newHoraire.jour_numero" class="w-full border rounded-md p-2 text-sm">
              <option v-for="(day, i) in ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']" :key="i" :value="i+1">{{ day }}</option>
            </select>
          </UFormField>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Début"><UInput v-model="newHoraire.heure_debut" type="time" /></UFormField>
            <UFormField label="Fin"><UInput v-model="newHoraire.heure_fin" type="time" /></UFormField>
          </div>

          <UFormField label="Service concerné">
            <select v-model="newHoraire.service_id" class="w-full border rounded-md p-2 text-sm">
              <option v-for="s in services" :key="s.id" :value="s.id">{{ s.nom }}</option>
            </select>
          </UFormField>

          <UFormField label="Employés affectés">
            <div class="flex flex-wrap gap-2">
              <UCheckbox v-for="p in personnels" :key="p.id" :label="p.prenom" :value="p.id" v-model="newHoraire.personnels" />
            </div>
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton label="Annuler" variant="ghost" @click="isHoraireModalOpen = false" />
            <UButton label="Valider" class="bg-cafe-700" type="submit" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>
