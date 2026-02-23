<script setup lang="ts">
import { storeToRefs } from 'pinia'

const crmStore = useCrmStore()
const { customers, categories } = storeToRefs(crmStore)
const toast = useToast()

const search = ref('')
const selectedCategory = ref('all')

onMounted(() => {
  crmStore.fetchCustomers()
})

const filteredCustomers = computed(() => {
  return (customers.value || []).filter((c: any) => {
    const matchesSearch = c.nom.toLowerCase().includes(search.value.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesCat = selectedCategory.value === 'all' || c.category_id.toString() === selectedCategory.value
    return matchesSearch && matchesCat
  })
})

const columns = [
  { accessorKey: 'customer', header: 'Client' },
  { accessorKey: 'category', header: 'Catégorie' },
  { accessorKey: 'stats', header: 'Visites / Chiffre' },
  { accessorKey: 'actions', header: '', id: 'actions' }
]

const getCategory = (id: any) => {
  const cat = categories.value.find(c => c.id?.toString() === id?.toString())
  return cat || { label: 'Client', color: 'neutral' }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'Fcfa')
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">CRM & Fidélisation</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Répertoire Client</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1">Suivez l'activité et la valeur de chaque client.</p>
      </div>
    </div>

    <UCard class="border-none shadow-sm bg-white/80 backdrop-blur-sm" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Rechercher un client..."
          size="lg"
          variant="outline"
          class="flex-1"
        />
        <USelect
          v-model="selectedCategory"
          :options="[
            { label: 'Toutes les catégories', value: 'all' },
            ...categories.map(c => ({ label: c.label, value: c.id.toString() }))
          ]"
          size="lg"
          variant="outline"
          class="w-full md:w-56"
        />
      </div>
    </UCard>

    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
      <UTable :rows="filteredCustomers" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #customer-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="`https://ui-avatars.com/api/?name=${row.original.nom}&background=FDF8F6&color=6C4239`" size="md" />
            <div class="flex flex-col">
              <span class="font-medium text-neutral-800">{{ row.original.nom }}</span>
              <span class="text-xs text-neutral-400">{{ row.original.tel }}</span>
            </div>
          </div>
        </template>

        <template #category-data="{ row }">
          <UBadge 
            :color="getCategory((row.original as any).category_id).color as any" 
            variant="subtle" 
            class="uppercase tracking-widest text-[0.6rem]"
          >
            {{ getCategory((row.original as any).category_id).label }}
          </UBadge>
        </template>

        <template #stats-data="{ row }">
          <div class="flex flex-col">
            <span class="text-xs font-medium text-neutral-800">{{ row.original.visits }} passages</span>
            <span class="text-[0.65rem] text-cafe-600 font-serif italic">{{ formatCurrency(row.original.spent) }} cumulé</span>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UButton 
            color="neutral" 
            variant="ghost" 
            icon="i-lucide-history" 
            label="Détails"
            class="text-[0.6rem] uppercase tracking-widest font-sans"
            :to="`/crm/customer/${row.original.id}`"
          />
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-users" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun client trouvé</p>
          </div>
        </template>
      </UTable>
      </div>
    </UCard>
  </div>
</template>
