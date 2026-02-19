<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Personnel {
  id: string | number
  nom: string
  prenom: string
  email: string
  tel: string
  poste?: string
}

const personnelStore = usePersonnelStore()
const { personnels: staff } = storeToRefs(personnelStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  personnelStore.fetchPersonnels()
})

const isModalOpen = ref(false)
const isSubmitting = ref(false)

const newMember = ref({
  nom: '',
  prenom: '',
  email: '',
  tel: '',
  poste: 'Esthéticienne'
})

const resetForm = () => {
  newMember.value = { nom: '', prenom: '', email: '', tel: '', poste: 'Esthéticienne' }
}

const handleCreatePersonnel = async () => {
  if (!newMember.value.nom || !newMember.value.prenom || !newMember.value.email) {
    toast.add({ title: 'Champs requis', description: 'Veuillez remplir le nom, le prénom et l\'email.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await personnelStore.createPersonnel(newMember.value)
    toast.add({ title: 'Succès', description: `${newMember.value.prenom} a été ajouté à l'équipe.`, color: 'success' })
    isModalOpen.value = false
    resetForm()
    personnelStore.fetchPersonnels()
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.response?.data?.message || 'Impossible d\'ajouter le membre.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (row: Personnel) => {
  if (!confirm(`Retirer ${row.prenom} ${row.nom} du personnel ?`)) return
  try {
    await personnelStore.deletePersonnel(row.id as string)
    toast.add({ title: 'Supprimé', description: 'Membre retiré avec succès.', color: 'success' })
    personnelStore.fetchPersonnels()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

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

const items = (row: Personnel) => [
  [{
    label: 'Modifier le profil',
    icon: 'i-lucide-user-cog',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'Retirer du personnel',
    icon: 'i-lucide-user-minus',
    color: 'error' as const,
    click: () => handleDelete(row)
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
        class="bg-cafe-700 hover:bg-cafe-800 font-sans tracking-widest uppercase text-xs px-6 py-3 shadow-lg"
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
            <UAvatar :src="`https://ui-avatars.com/api/?name=${row.original.prenom}+${row.original.nom}&background=EFE9E6&color=56352E`" :alt="row.original.nom" size="md" class="ring-2 ring-cafe-50" />
            <div class="flex flex-col">
              <span class="font-medium text-neutral-800">{{ row.original.prenom }} {{ row.original.nom }}</span>
              <span class="text-[0.65rem] text-cafe-500 uppercase tracking-tighter">{{ row.original.poste || 'Collaborateur' }}</span>
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
          <UDropdown :items="items(row.original as unknown as Personnel)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-horizontal" />
          </UDropdown>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-users" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun membre dans l'équipe</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal for new staff -->
    <UModal v-model="isModalOpen" prevent-close>
      <UCard :ui="{ body: 'p-6', header: 'border-b border-neutral-100 px-6 py-4', footer: 'border-t border-neutral-100 px-6 py-4' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-serif text-xl tracking-wide uppercase text-neutral-800">Recruter un talent</h3>
              <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-0.5">Ajouter un nouveau membre à l'équipe</p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false; resetForm()" />
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="handleCreatePersonnel">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Prénom" required>
              <UInput v-model="newMember.prenom" placeholder="Prénom" size="md" variant="outline" icon="i-lucide-user" />
            </UFormField>
            <UFormField label="Nom" required>
              <UInput v-model="newMember.nom" placeholder="Nom" size="md" variant="outline" icon="i-lucide-user" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Email professionnel" required>
              <UInput v-model="newMember.email" type="email" placeholder="nom@florencia.com" size="md" variant="outline" icon="i-lucide-mail" />
            </UFormField>
            <UFormField label="Téléphone" required>
              <UInput v-model="newMember.tel" placeholder="+228..." size="md" variant="outline" icon="i-lucide-phone" />
            </UFormField>
          </div>

          <UFormField label="Poste">
            <select
              v-model="newMember.poste"
              class="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm font-sans text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-cafe-300 focus:border-cafe-400 transition"
            >
              <option v-for="p in ['Esthéticienne', 'Masseur', 'Prothésiste', 'Réceptionniste']" :key="p" :value="p">{{ p }}</option>
            </select>
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false; resetForm()" />
            <UButton
              label="Valider l'embauche"
              class="bg-cafe-700 hover:bg-cafe-800 font-sans uppercase tracking-widest text-xs px-6 shadow-lg"
              :loading="isSubmitting"
              @click="handleCreatePersonnel"
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
