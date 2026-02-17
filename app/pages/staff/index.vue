<script setup lang="ts">
interface StaffMember {
  id: string
  nom: string
  prenom: string
  email: string
  tel: string
}

const config = useRuntimeConfig()
const token = typeof window !== 'undefined' ? localStorage.getItem('florencia_admin_token') : null

// Récupération dynamique des personnels depuis Laravel
const { data: staffResponse, refresh } = await useFetch<any>(`${config.public.apiBase}/personnels`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const staff = computed(() => staffResponse.value?.data || [])

const columns = [{
  accessorKey: 'personnel',
  header: 'Personnel'
}, {
  accessorKey: 'contact',
  header: 'Contact'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const isModalOpen = ref(false)

const items = (row: any) => [
  [{
    label: 'Modifier le profil',
    icon: 'i-lucide-user-cog',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'Retirer du personnel',
    icon: 'i-lucide-user-minus',
    color: 'red' as const,
    click: () => console.log('Remove', row.id)
  }]
]
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Équipe Florencia</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion du Personnel</h1>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Nouveau Membre"
        class="bg-cafe-700 hover:bg-cafe-800 font-sans tracking-widest uppercase text-xs px-6 py-3"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Staff List -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="staff" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #personnel-data="{ row }">
          <div class="flex items-center gap-4">
            <UAvatar :src="`https://ui-avatars.com/api/?name=${row.original.prenom}+${row.original.nom}&background=random`" :alt="row.original.nom" size="md" class="ring-2 ring-cafe-50" />
            <div class="flex flex-col">
              <span class="font-medium text-neutral-800">{{ row.original.prenom }} {{ row.original.nom }}</span>
              <span class="text-[0.65rem] text-cafe-500 uppercase tracking-tighter">Collaborateur</span>
            </div>
          </div>
        </template>

        <template #contact-data="{ row }">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-1.5 text-xs text-neutral-600">
              <UIcon name="i-lucide-mail" class="w-3 h-3 text-neutral-400" />
              <span>{{ row.original.email }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-neutral-600">
              <UIcon name="i-lucide-phone" class="w-3 h-3 text-neutral-400" />
              <span>{{ row.original.tel }}</span>
            </div>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row.original)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal for new staff -->
    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-neutral-100', rounded: 'rounded-2xl' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl tracking-wide uppercase">Recruter un talent</h3>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="isModalOpen = false" />
          </div>
        </template>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Nom" class="font-sans">
              <UInput placeholder="Prénom Nom" size="md" variant="subtle" />
            </UFormField>
            <UFormField label="Poste">
              <USelect :options="['Esthéticienne', 'Masseur', 'Prothésiste', 'Réceptionniste']" size="md" variant="subtle" />
            </UFormField>
          </div>
          <UFormField label="Email professionnel">
            <UInput type="email" placeholder="nom@florencia.com" size="md" variant="subtle" />
          </UFormField>
          <UFormField label="Spécialités">
            <p class="text-[0.65rem] text-neutral-400 mb-2">Sélectionnez les domaines d'expertise du collaborateur</p>
            <div class="flex flex-wrap gap-2">
              <UCheckbox label="Visage" />
              <UCheckbox label="Corps" />
              <UCheckbox label="Massage" />
              <UCheckbox label="Onglerie" />
            </div>
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3 px-2">
            <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false" />
            <UButton label="Valider l'embauche" class="bg-cafe-700 font-sans uppercase tracking-widest text-xs px-6" @click="isModalOpen = false" />
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
