<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Service {
  id: string | number
  nom: string
  type: 'simple' | 'pack'
  duree: number
  price?: string | number
}

const serviceStore = useServiceStore()
const { services } = storeToRefs(serviceStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  serviceStore.fetchServices().catch(() => {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les services.', color: 'error' })
  })
})

const columns = [{
  accessorKey: 'nom',
  header: 'Service'
}, {
  accessorKey: 'type',
  header: 'Type'
}, {
  accessorKey: 'duree',
  header: 'Durée'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const isModalOpen = ref(false)
const isSubmitting = ref(false)

const newService = ref({
  nom: '',
  type: 'simple' as const,
  duree: 60
})

const resetForm = () => {
  newService.value = { nom: '', type: 'simple', duree: 60 }
}

const handleCreateService = async () => {
  if (!newService.value.nom || !newService.value.duree) {
    toast.add({ title: 'Champs requis', description: 'Le nom et la durée sont obligatoires.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await serviceStore.createService(newService.value)
    toast.add({ title: 'Succès', description: 'Le service a été créé.', color: 'success' })
    isModalOpen.value = false
    resetForm()
    serviceStore.fetchServices()
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.response?.data?.message || 'Impossible de créer le service.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (row: Service) => {
  if (!confirm(`Supprimer le service ${row.nom} ?`)) return
  try {
    await serviceStore.deleteService(row.id as string)
    toast.add({ title: 'Supprimé', description: 'Le service a été retiré.', color: 'success' })
    serviceStore.fetchServices()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const items = (row: Service) => [
  [{
    label: 'Modifier le service',
    icon: 'i-lucide-pencil',
    onSelect: () => console.log('Edit', row.id)
  }], [{
    label: 'Supprimer',
    icon: 'i-lucide-trash',
    color: 'error' as const,
    onSelect: () => handleDelete(row)
  }]
]
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Prestations & Rituels</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Services</h1>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Nouveau Service"
        class="bg-neutral-900 hover:bg-black font-sans tracking-widest uppercase text-[0.65rem] px-6 py-3 shadow-xl"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[0.6rem] font-sans uppercase tracking-widest text-neutral-400 mb-1">Total Services</p>
            <p class="text-xl font-serif text-neutral-800 tracking-wide">{{ services.length }} Prestations</p>
          </div>
          <div class="p-2 bg-cafe-50 rounded-lg">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-cafe-600" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Services Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="services" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #nom-data="{ row }">
          <div class="flex flex-col max-w-xs">
            <span class="font-medium text-neutral-800 leading-tight">{{ row.original.nom }}</span>
            <span class="text-[0.65rem] text-cafe-500 uppercase tracking-tighter mt-1">{{ row.original.type }}</span>
          </div>
        </template>

        <template #duree-data="{ row }">
          <div class="flex items-center gap-1.5 text-neutral-500">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            <span class="text-xs">{{ row.original.duree }} min</span>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdownMenu :items="items(row.original as unknown as Service)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdownMenu>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-scissors" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucune prestation trouvée</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal for new service -->
    <UModal v-model="isModalOpen" size="lg" prevent-close>
      <UCard :ui="{ body: 'p-8', header: 'border-b border-neutral-100 px-8 py-4', footer: 'border-t border-neutral-100 px-8 py-4' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h3 class="font-serif text-2xl tracking-wide uppercase">Créer une prestation</h3>
              <p class="text-[0.65rem] text-neutral-400 uppercase tracking-[0.2em]">Ajoutez un nouveau rituel à votre carte</p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false; resetForm()" />
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="handleCreateService">
          <UFormField label="Nom du service (Public)" required>
            <UInput v-model="newService.nom" placeholder="Ex: Rituel Cléopâtre" size="md" variant="outline" class="font-serif italic text-lg" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Type">
              <select
                v-model="newService.type"
                class="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm font-sans text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-cafe-300 focus:border-cafe-400 transition"
              >
                <option value="simple">Simple</option>
                <option value="pack">Pack</option>
              </select>
            </UFormField>
            <UFormField label="Durée (Min)" required>
              <UInput v-model="newService.duree" type="number" placeholder="60" size="md" variant="outline" />
            </UFormField>
          </div>

          <div class="flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 rounded-2xl p-6 bg-neutral-50/50 group hover:border-cafe-200 transition-colors cursor-pointer relative overflow-hidden">
            <UIcon name="i-lucide-image-plus" class="w-10 h-10 text-neutral-300 group-hover:text-cafe-300 transition-colors mb-2" />
            <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest">Image de couverture</p>
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" multiple />
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false; resetForm()" />
            <UButton
              label="Publier le service"
              class="bg-cafe-700 hover:bg-cafe-800 px-8 py-3 font-sans uppercase tracking-[0.2em] text-xs shadow-lg shadow-cafe-100"
              :loading="isSubmitting"
              @click="handleCreateService"
            />
          </div>
        </template>
      </UCard>
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
