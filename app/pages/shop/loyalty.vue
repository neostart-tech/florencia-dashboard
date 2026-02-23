<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Fidelite {
  id: string | number
  code: string
  pourcentage: number
  is_active: boolean
  user?: { nom: string; prenom: string }
  created_at: string
}

const fideliteStore = useFideliteStore()
const { fidelites } = storeToRefs(fideliteStore)
const toast = useToast()

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const newFidelite = ref({ pourcentage: 10 })

onMounted(() => {
  fideliteStore.fetchFidelites()
})

const handleCreate = async () => {
  isSubmitting.value = true
  try {
    await fideliteStore.createFidelite(newFidelite.value)
    toast.add({ title: 'Succès', description: 'Carte de fidélité générée', color: 'success' })
    isModalOpen.value = false
    fideliteStore.fetchFidelites()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id: string | number) => {
  if (!confirm('Révoquer ce code fidélité ?')) return
  try {
    await fideliteStore.deleteFidelite(id)
    toast.add({ title: 'Révoqué', color: 'success' })
    fideliteStore.fetchFidelites()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const columns = [{
  accessorKey: 'code',
  header: 'Code Fidélité'
}, {
  accessorKey: 'pourcentage',
  header: 'Remise'
}, {
  accessorKey: 'client',
  header: 'Attribué à'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Programme de Récompense</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Fidélité Clients</h1>
      </div>
      <UButton
        icon="i-lucide-award"
        label="Nouveau Code"
        class="bg-cafe-700 hover:bg-cafe-800 text-white px-6 py-3 shadow-xl uppercase tracking-widest text-[0.65rem] font-sans"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Cards Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <UCard class="border-none shadow-sm bg-white rounded-2xl">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-cafe-50 rounded-xl text-cafe-600">
               <UIcon name="i-lucide-ticket" class="w-6 h-6" />
            </div>
            <div>
               <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400">Codes Actifs</p>
               <p class="text-2xl font-serif text-neutral-800">{{ (fidelites as any[]).length }}</p>
            </div>
          </div>
       </UCard>
    </div>

    <!-- Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
      <UTable :rows="fidelites" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #code-data="{ row }">
          <div class="flex items-center gap-2">
             <span class="font-mono bg-neutral-900 text-white px-3 py-1 rounded text-xs tracking-widest">{{ (row.original as any).code }}</span>
          </div>
        </template>

        <template #pourcentage-data="{ row }">
           <UBadge color="primary" variant="subtle" class="font-serif">-{{ (row.original as any).pourcentage }}%</UBadge>
        </template>

        <template #client-data="{ row }">
           <span v-if="(row.original as any).user" class="text-xs text-neutral-700 font-medium">
             {{ (row.original as any).user.prenom }} {{ (row.original as any).user.nom }}
           </span>
           <span v-else class="text-[0.65rem] text-neutral-400 italic font-sans uppercase tracking-widest">Générique (Non attribué)</span>
        </template>

        <template #actions-data="{ row }">
           <div class="flex items-center justify-end gap-2">
             <span class="text-[0.6rem] text-neutral-300 font-sans mr-2">Créé le {{ formatDate((row.original as any).created_at) }}</span>
             <UButton color="error" variant="ghost" icon="i-lucide-trash-2" size="xs" @click="handleDelete((row.original as any).id)" />
           </div>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-award" class="w-10 h-10 text-neutral-100" />
            <p class="text-sm text-neutral-400 font-sans">Aucun programme de fidélité actif</p>
          </div>
        </template>
      </UTable>
      </div>
    </UCard>

    <!-- Modal Nouveau Code -->
    <UModal v-model="isModalOpen">
      <UCard :ui="{ body: 'p-8' }">
        <h3 class="font-serif text-xl mb-6 uppercase tracking-wide">Générer un Avantage</h3>
        <p class="text-xs text-neutral-500 mb-6 leading-relaxed">
          Le code généré pourra être utilisé par les clients pour bénéficier d'une remise exclusive sur l'ensemble de la boutique et du salon.
        </p>
        
        <UFormField label="Pourcentage de remise (%)" required>
          <div class="flex items-center gap-4">
             <URange v-model="newFidelite.pourcentage" :min="5" :max="50" color="cafe" class="flex-1" />
             <span class="font-serif text-lg text-cafe-700 w-12 text-right">{{ newFidelite.pourcentage }}%</span>
          </div>
        </UFormField>

        <div class="flex justify-end gap-3 pt-8">
          <UButton label="Annuler" variant="ghost" @click="isModalOpen = false" />
          <UButton label="Générer le Code" class="bg-cafe-700 shadow-lg px-8" :loading="isSubmitting" @click="handleCreate" />
        </div>
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
