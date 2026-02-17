<script setup lang="ts">
interface PromoCode {
  id: string
  code: string
  pourcentage: number
  date_debut: string
  date_fin: string
}

const config = useRuntimeConfig()
const token = typeof window !== 'undefined' ? localStorage.getItem('florencia_admin_token') : null

const { data: promosResponse, refresh } = await useFetch<any>(`${config.public.apiBase}/codepromos`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const promos = computed(() => promosResponse.value || [])

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
const toast = useToast()

const newPromo = ref({
  date_debut: '',
  date_fin: '',
  pourcentage: 10
})

const handleCreatePromo = async () => {
  try {
    await $fetch(`${config.public.apiBase}/codepromos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: newPromo.value
    })
    toast.add({ title: 'Succès', description: 'Code promo généré', color: 'green' })
    isModalOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.data?.message || 'Erreur lors de la création', color: 'red' })
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Supprimer ce code promo ?')) return
  try {
    await $fetch(`${config.public.apiBase}/codepromos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.add({ title: 'Supprimé', color: 'green' })
    refresh()
  } catch (error) {
    toast.add({ title: 'Erreur', color: 'red' })
  }
}
</script>

<template>
  <div class="p-8 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-serif text-neutral-900 tracking-tight">Codes Promo</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1 italic">Gérez les offres spéciales et réductions</p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Nouveau Code"
        class="bg-cafe-700 hover:bg-cafe-800 text-white rounded-full px-6 transition-all duration-300 shadow-lg shadow-cafe-100"
        @click="isModalOpen = true"
      />
    </div>

    <UCard class="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="promos" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #code-data="{ row }">
          <div class="flex items-center gap-2">
            <span class="font-mono bg-cafe-50 text-cafe-700 px-3 py-1 rounded text-sm font-bold border border-cafe-100">{{ row.original.code }}</span>
          </div>
        </template>

        <template #pourcentage-data="{ row }">
          <UBadge color="green" variant="subtle" size="md" class="font-serif">
            -{{ row.original.pourcentage }}%
          </UBadge>
        </template>

        <template #validity-data="{ row }">
          <div class="text-[0.7rem] text-neutral-500">
            Du {{ new Date(row.original.date_debut).toLocaleDateString() }} au {{ new Date(row.original.date_fin).toLocaleDateString() }}
          </div>
        </template>

        <template #actions-data="{ row }">
          <UButton 
            color="red" 
            variant="ghost" 
            icon="i-lucide-trash-2" 
            size="sm"
            @click="handleDelete(row.original.id)"
          />
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard title="Générer un code promo">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-neutral-900">Nouvelle Offre</h3>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4 py-4">
          <UFormField label="Réduction (%)">
            <UInput v-model="newPromo.pourcentage" type="number" min="1" max="100" />
          </UFormField>
          <UFormField label="Date de début">
            <UInput v-model="newPromo.date_debut" type="date" />
          </UFormField>
          <UFormField label="Date de fin">
            <UInput v-model="newPromo.date_fin" type="date" />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" @click="isModalOpen = false" />
            <UButton label="Générer le code" class="bg-cafe-700 text-white" @click="handleCreatePromo" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
