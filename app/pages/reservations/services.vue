<script setup lang="ts">
interface Service {
  id: string
  nom: string
  type: 'simple' | 'pack'
  duree: number
  images?: { path: string }[]
}

const config = useRuntimeConfig()
const token = typeof window !== 'undefined' ? localStorage.getItem('florencia_admin_token') : null

// Récupération dynamique des services
const { data: servicesResponse, refresh } = await useFetch<any>(`${config.public.apiBase}/services`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const services = computed(() => servicesResponse.value?.data || [])

const columns = [{
  accessorKey: 'nom', // Changed from 'name' to 'nom' to match Service interface
  header: 'Service'
}, {
  accessorKey: 'type',
  header: 'Type'
}, {
  accessorKey: 'duree', // Changed from 'duration' to 'duree' to match Service interface
  header: 'Durée'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const isModalOpen = ref(false)

const items = (row: Service) => [ // Changed row type to Service
  [{
    label: 'Modifier le service',
    icon: 'i-lucide-pencil',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'Supprimer',
    icon: 'i-lucide-trash',
    color: 'red' as const,
    click: () => console.log('Delete', row.id)
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="cat in ['Visage', 'Corps', 'Massage']" :key="cat" class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[0.6rem] font-sans uppercase tracking-widest text-neutral-400 mb-1">{{ cat }}</p>
            <p class="text-xl font-serif text-neutral-800 tracking-wide">
              {{ services.filter(s => s.category === cat).length }} Services
            </p>
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
        <template #name-data="{ row }">
          <div class="flex flex-col max-w-xs">
            <span class="font-medium text-neutral-800 leading-tight">{{ row.original.name }}</span>
            <span class="text-[0.65rem] text-cafe-500 uppercase tracking-tighter mt-1">{{ row.original.category }}</span>
          </div>
        </template>

        <template #duration-data="{ row }">
          <div class="flex items-center gap-1.5 text-neutral-500">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            <span class="text-xs">{{ row.original.duration }}</span>
          </div>
        </template>

        <template #price-data="{ row }">
          <span class="font-serif text-neutral-700 tracking-wide">{{ row.original.price }}</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row.original)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal for new service -->
    <UModal v-model="isModalOpen" size="lg">
      <div class="p-8">
        <div class="flex items-center justify-between mb-10">
          <div class="space-y-1">
            <h3 class="font-serif text-2xl tracking-wide uppercase">Créer une prestation</h3>
            <p class="text-[0.65rem] text-neutral-400 uppercase tracking-[0.2em]">Ajoutez un nouveau rituel à votre carte</p>
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false" />
        </div>

        <form class="space-y-8">
          <UFormField label="Nom du service (Public)">
            <UInput placeholder="Ex: Rituel Cléopâtre" size="xl" variant="subtle" class="font-serif italic text-lg" />
          </UFormField>

          <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <UFormField label="Catégorie">
              <USelect :options="['Visage', 'Massage', 'Onglerie', 'Épilation']" size="lg" variant="subtle" />
            </UFormField>
            <UFormField label="Prix (Fcfa)">
              <UInput type="number" placeholder="0" size="lg" variant="subtle" />
            </UFormField>
            <UFormField label="Durée (Min)">
              <UInput type="number" placeholder="60" size="lg" variant="subtle" />
            </UFormField>
          </div>

          <UFormField label="Description">
            <UTextarea placeholder="Présentez les bienfaits de ce soin..." variant="subtle" :rows="3" />
          </UFormField>

          <div class="flex justify-end gap-3 pt-6 border-t border-neutral-50">
            <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false" />
            <UButton label="Publier le service" class="bg-cafe-700 px-8 py-4 font-sans uppercase tracking-[0.2em] text-xs shadow-lg shadow-cafe-100" @click="isModalOpen = false" />
          </div>
        </form>
      </div>
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
