<script setup lang="ts">
interface Calendar {
  id: string
  debut: string
  fin: string
  is_active: boolean
  horaires?: any[]
}

const config = useRuntimeConfig()
const token = typeof window !== 'undefined' ? localStorage.getItem('florencia_admin_token') : null

const { data: calendars, refresh } = await useFetch<Calendar[]>(`${config.public.apiBase}/calendriers`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const isModalOpen = ref(false)
const toast = useToast()

const newCalendar = ref({
  debut: '',
  fin: ''
})

const handleCreate = async () => {
  try {
    await $fetch(`${config.public.apiBase}/calendriers`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: newCalendar.value
    })
    toast.add({ title: 'Succès', description: 'Calendrier planifié', color: 'green' })
    isModalOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.data?.message || 'Erreur', color: 'red' })
  }
}

const toggleActive = async (cal: Calendar) => {
  try {
    await $fetch(`${config.public.apiBase}/calendriers/${cal.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { is_active: !cal.is_active }
    })
    refresh()
  } catch (error) {
    toast.add({ title: 'Erreur', color: 'red' })
  }
}

const columns = [{
  accessorKey: 'period',
  header: 'Période'
}, {
  accessorKey: 'status',
  header: 'Statut'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-serif text-neutral-900 tracking-tight">Calendrier</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1 italic">Planifiez les périodes de disponibilité</p>
      </div>
      <UButton
        icon="i-lucide-calendar-plus"
        label="Nouvelle Période"
        class="bg-cafe-700 hover:bg-cafe-800 text-white rounded-full px-6 transition-all duration-300 shadow-lg shadow-cafe-100"
        @click="isModalOpen = true"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Active Calendar Spotlight -->
      <div class="lg:col-span-1 space-y-6">
        <UCard v-for="cal in calendars?.filter(c => c.is_active)" :key="cal.id" 
          class="border-2 border-cafe-200 bg-cafe-50 shadow-xl overflow-hidden relative">
          <div class="absolute top-0 right-0 p-4">
            <UBadge color="cafe" variant="solid" size="sm" class="animate-pulse">Actif</UBadge>
          </div>
          <div class="p-4 space-y-4">
            <h3 class="text-cafe-800 font-serif text-xl">Période Actuelle</h3>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-neutral-600">
                <UIcon name="i-lucide-calendar-days" class="w-4 h-4" />
                <span>Du {{ new Date(cal.debut).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center gap-2 text-neutral-600">
                <UIcon name="i-lucide-calendar-days" class="w-4 h-4" />
                <span>Au {{ new Date(cal.fin).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- History / list -->
      <div class="lg:col-span-2">
        <UCard class="border-none shadow-sm rounded-3xl overflow-hidden">
          <UTable :rows="calendars || []" :columns="columns" :ui="{ 
            thead: 'bg-neutral-50 uppercase text-[0.6rem] tracking-widest',
            td: 'font-sans py-4'
          }">
            <template #period-data="{ row }">
              <div class="flex flex-col">
                <span class="text-neutral-800">Semaine du {{ new Date(row.original.debut).toLocaleDateString() }}</span>
                <span class="text-[0.6rem] text-neutral-400">Jusqu'au {{ new Date(row.original.fin).toLocaleDateString() }}</span>
              </div>
            </template>

            <template #status-data="{ row }">
              <USwitch 
                :model-value="row.original.is_active" 
                color="cafe" 
                @update:model-value="toggleActive(row.original)"
              />
            </template>

            <template #actions-data="{ row }">
              <UButton color="neutral" variant="ghost" icon="i-lucide-trash" @click="toggleActive(row.original)" />
            </template>
          </UTable>
        </UCard>
      </div>
    </div>

    <UModal v-model="isModalOpen">
      <UCard title="Planifier une nouvelle période">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-neutral-900">Nouvelle Période</h3>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4 py-4">
          <UFormField label="Date de début">
            <UInput v-model="newCalendar.debut" type="date" />
          </UFormField>
          <UFormField label="Date de fin">
            <UInput v-model="newCalendar.fin" type="date" />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" @click="isModalOpen = false" />
            <UButton label="Planifier" class="bg-cafe-700 text-white" @click="handleCreate" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
