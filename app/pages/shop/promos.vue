<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface CodePromo {
  id: string | number
  code: string
  pourcentage: number
  date_debut: string
  date_fin: string
}

const promoStore = useCodePromoStore()
const { codepromos: promos } = storeToRefs(promoStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  promoStore.fetchCodepromos().catch(() => {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les codes promos.', color: 'error' })
  })
})

const columns = [{
  accessorKey: 'code',
  header: 'Code'
}, {
  accessorKey: 'pourcentage',
  header: 'Réduction'
}, {
  accessorKey: 'validity',
  header: 'Validité'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const isModalOpen = ref(false)
const isSubmitting = ref(false)

const newPromo = ref({
  date_debut: '',
  date_fin: '',
  pourcentage: 10
})

const resetForm = () => {
  newPromo.value = { date_debut: '', date_fin: '', pourcentage: 10 }
}

const handleCreatePromo = async () => {
  if (!newPromo.value.date_debut || !newPromo.value.date_fin || !newPromo.value.pourcentage) {
    toast.add({ title: 'Champs requis', description: 'Veuillez remplir toutes les dates et le pourcentage.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await promoStore.createCodepromo(newPromo.value)
    toast.add({ title: 'Succès', description: 'Le code promo a été généré.', color: 'success' })
    isModalOpen.value = false
    resetForm()
    promoStore.fetchCodepromos()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.response?.data?.errors?.date_fin?.[0] || 'Erreur lors de la création', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id: string | number) => {
  if (!confirm('Supprimer ce code promo ?')) return
  try {
    await promoStore.deleteCodepromo(id)
    toast.add({ title: 'Supprimé', description: 'Le code promo a été retiré.', color: 'success' })
    promoStore.fetchCodepromos()
  } catch (error) {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-6 animate-page-in">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Offres Spéciales</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Codes Promo</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1">Gérez les réductions et avantages clients.</p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Nouveau Code"
        class="bg-cafe-700 hover:bg-cafe-800 text-white rounded-full px-6 py-3 transition-all duration-300 shadow-xl shadow-cafe-100 uppercase tracking-widest text-[0.65rem] font-sans"
        @click="isModalOpen = true"
      />
    </div>

    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.04)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="promos" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #code-data="{ row }">
          <div class="flex items-center gap-2">
            <span class="font-mono bg-cafe-50 text-cafe-700 px-3 py-1 rounded-md text-sm font-bold border border-cafe-100/50">{{ row.original.code }}</span>
          </div>
        </template>

        <template #pourcentage-data="{ row }">
          <UBadge color="success" variant="subtle" size="md" class="font-serif px-3">
            -{{ row.original.pourcentage }}%
          </UBadge>
        </template>

        <template #validity-data="{ row }">
          <div class="flex flex-col">
            <span class="text-[0.7rem] text-neutral-500 uppercase tracking-widest">Période de validité</span>
            <div class="text-xs text-neutral-800 font-medium">
              du {{ formatDate(row.original.date_debut) }} au {{ formatDate(row.original.date_fin) }}
            </div>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UButton 
            color="error" 
            variant="ghost" 
            icon="i-lucide-trash-2" 
            size="sm"
            class="hover:bg-error-50"
            @click="handleDelete(row.original.id)"
          />
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-ticket" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun code promo actif</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen" prevent-close>
      <UCard :ui="{ body: 'p-8', header: 'border-b border-neutral-100 px-8 py-4', footer: 'border-t border-neutral-100 px-8 py-4' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-serif text-xl tracking-wide uppercase text-neutral-800">Générer une Offre</h3>
              <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-0.5">Le code sera généré automatiquement</p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false; resetForm()" />
          </div>
        </template>

        <form class="space-y-6" @submit.prevent="handleCreatePromo">
          <UFormField label="Réduction brute (%)" required>
            <div class="flex items-center gap-4">
              <URange v-model="newPromo.pourcentage" :min="1" :max="99" class="flex-1" color="cafe" />
              <span class="text-lg font-serif text-cafe-700 w-12 text-right">{{ newPromo.pourcentage }}%</span>
            </div>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Date de lancement" required>
              <UInput v-model="newPromo.date_debut" type="date" size="md" variant="outline" icon="i-lucide-calendar" />
            </UFormField>
            <UFormField label="Date d'expiration" required>
              <UInput v-model="newPromo.date_fin" type="date" size="md" variant="outline" icon="i-lucide-calendar" />
            </UFormField>
          </div>
          
          <div class="p-4 bg-cafe-50/30 rounded-2xl border border-cafe-100/50 flex items-start gap-3">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-cafe-500 mt-0.5" />
            <p class="text-[0.65rem] text-cafe-600 leading-relaxed italic">
              Les clients pourront utiliser ce code lors du paiement pour bénéficier d'une réduction immédiate sur leur panier.
            </p>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false; resetForm()" />
            <UButton 
              label="Activer l'Offre" 
              class="bg-cafe-700 hover:bg-cafe-800 text-white px-8 py-3 font-sans uppercase tracking-[0.2em] text-xs shadow-lg" 
              :loading="isSubmitting"
              @click="handleCreatePromo" 
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
