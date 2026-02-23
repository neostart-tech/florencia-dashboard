<script setup lang="ts">
import { storeToRefs } from 'pinia'

const analyticStore = useAnalyticsStore()
const { yields } = storeToRefs(analyticStore)
const personnelStore = usePersonnelStore()
const { personnels } = storeToRefs(personnelStore)

onMounted(() => {
  personnelStore.fetchPersonnels()
  analyticStore.fetchEmployeeYields()
})

const columns = [
  { accessorKey: 'personnel', header: 'Employé' } ,
  { accessorKey: 'stats', header: 'Interventions / Total' },
  { accessorKey: 'specialty', header: 'Service Phare' },
  { accessorKey: 'actions', header: '', id: 'actions' }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'Fcfa')
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <div>
      <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Performance & RH</p>
      <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Rendements du Personnel</h1>
      <p class="text-sm text-neutral-500 font-sans mt-1">Sachez quel employé s'est occupé de quel client et avec quelle efficacité.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="y in yields" :key="y.id" class="border-none shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
        <div class="p-2 space-y-4">
          <div class="flex items-center gap-3">
             <UAvatar :src="`https://ui-avatars.com/api/?name=${y.name}&background=343434&color=fff`" size="lg" />
             <div>
               <h3 class="font-medium text-neutral-800">{{ y.name }}</h3>
               <p class="text-[0.65rem] uppercase tracking-widest text-neutral-400">Collaborateur</p>
             </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-50">
            <div>
              <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-1">Interventions</p>
              <p class="text-xl font-serif text-neutral-800">{{ y.interventions }}</p>
            </div>
            <div>
              <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-1">Chiffre Généré</p>
              <p class="text-xl font-serif text-cafe-600">{{ formatCurrency(y.yield) }}</p>
            </div>
          </div>

          <div class="bg-neutral-50 p-3 rounded-xl">
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-500 mb-1">Secteur dominant</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-neutral-700">{{ y.top_service }}</span>
              <UIcon name="i-lucide-award" class="text-cafe-400 w-4 h-4" />
            </div>
          </div>

          <UButton 
            variant="ghost" 
            block 
            class="text-[0.65rem] uppercase tracking-widest border border-neutral-100 hover:bg-neutral-900 hover:text-white transition-all py-2.5 rounded-xl"
            :to="`/analytics/employee/${y.id}`"
          >
            Voir le relevé détaillé
          </UButton>
        </div>
      </UCard>
    </div>

    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden mt-8">
      <template #header>
        <h3 class="font-serif text-xl text-neutral-800">Classement des rendements</h3>
      </template>
      <div class="overflow-x-auto">
        <UTable :rows="yields" :columns="columns" :ui="{ td: 'font-sans py-4' }">
          <template #personnel-data="{ row }">
            <span class="font-medium">{{ row.original.name }}</span>
          </template>
          <template #stats-data="{ row }">
            <div class="flex gap-4">
               <span class="text-xs text-neutral-500">{{ row.original.interventions }} actes</span>
               <span class="text-xs font-bold text-cafe-700">{{ formatCurrency(row.original.yield) }}</span>
            </div>
          </template>
          <template #specialty-data="{ row }">
            <UBadge color="neutral" variant="subtle" size="sm">{{ row.original.top_service }}</UBadge>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>
