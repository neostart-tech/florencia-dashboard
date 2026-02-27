<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCrmStore } from '~/stores/crm'

const route = useRoute()
const crmStore = useCrmStore()
const authStore = useAuthStore()
const { customers, categories, customerHistory } = storeToRefs(crmStore)

if (authStore.user?.role?.role === 'receptionnist') {
  setPageLayout('reception')
}

const customerId = route.params.id as string

const customer = computed(() => {
  return customers.value.find(c => c.id.toString() === customerId)
})

onMounted(async () => {
  if (customers.value.length === 0) {
    await crmStore.fetchCustomers()
  }
  await crmStore.fetchCustomerHistory(customerId)
})

const getCategory = (id: any) => {
  const cat = categories.value.find(c => c.id?.toString() === id?.toString())
  return cat || { label: 'Client', color: 'neutral' }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount).replace('XOF', 'Fcfa')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in" v-if="customer">
    <!-- Header Client -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-6">
        <UAvatar 
          :src="`https://ui-avatars.com/api/?name=${customer.nom}&background=6C4239&color=fff&size=128`" 
          size="xl" 
          class="ring-4 ring-cafe-50 shadow-xl w-24 h-24"
        />
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-3xl font-serif text-neutral-800 tracking-wide">{{ customer.nom }}</h1>
            <UBadge 
              :color="getCategory(customer.category_id).color as any" 
              variant="subtle" 
              class="uppercase tracking-widest text-[0.6rem] font-bold"
            >
              {{ getCategory(customer.category_id).label }}
            </UBadge>
          </div>
          <p class="text-sm text-neutral-500 font-sans flex items-center gap-4">
            <span class="flex items-center gap-1.5"><UIcon name="i-lucide-mail" class="w-4 h-4 text-cafe-400" /> {{ customer.email }}</span>
            <span class="flex items-center gap-1.5"><UIcon name="i-lucide-phone" class="w-4 h-4 text-cafe-400" /> {{ customer.tel }}</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UButton icon="i-lucide-edit" variant="outline" label="Modifier" color="neutral" class="rounded-xl px-4 py-2" />
        <UButton icon="i-lucide-award" label="Offrir une promo" color="primary" class="bg-cafe-800 hover:bg-cafe-900 border-none rounded-xl px-4 py-2" />
      </div>
    </div>

    <!-- Stats Rapides -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <UCard v-for="stat in [
        { label: 'Total Dépendé', value: formatCurrency(customer.spent), icon: 'i-lucide-banknote', color: 'text-cafe-700' },
        { label: 'Visites Totales', value: `${customer.visits} passages`, icon: 'i-lucide-calendar-check', color: 'text-neutral-800' },
        { label: 'Fidèle depuis', value: formatDate(customer.created_at), icon: 'i-lucide-user-plus', color: 'text-neutral-800' }
      ]" :key="stat.label" class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-neutral-50 rounded-xl">
            <UIcon :name="stat.icon" class="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-0.5">{{ stat.label }}</p>
            <p class="text-lg font-serif" :class="stat.color">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Historique Reservations -->
      <UCard class="lg:col-span-12 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl text-neutral-800">Historique des prestations</h3>
            <UIcon name="i-lucide-history" class="w-5 h-5 text-neutral-300" />
          </div>
        </template>
        
        <UTable v-if="(customerHistory as any).reservations" :data="(customerHistory as any).reservations" :columns="[
          { accessorKey: 'date', header: 'Date' },
          { accessorKey: 'service', header: 'Prestation' },
          { accessorKey: 'montant', header: 'Prix' },
          { accessorKey: 'status', header: 'Statut' }
        ]" :ui="{ td: 'font-sans py-4' }">
          <template #date-cell="{ row }">
            <span class="text-xs text-neutral-500">{{ formatDate(row.original.created_at) }}</span>
          </template>
          <template #service-cell="{ row }">
            <span class="font-medium text-neutral-800">{{ row.original.service?.nom || 'Service' }}</span>
          </template>
          <template #montant-cell="{ row }">
            <span class="text-cafe-700">{{ formatCurrency(row.original.paiements?.reduce((acc: any, p: any) => acc + p.montant, 0) || 0) }}</span>
          </template>
          <template #status-cell="{ row }">
            <UBadge color="success" variant="subtle" size="sm" class="rounded-full">Effectué</UBadge>
          </template>
        </UTable>

        <div v-else class="py-12 text-center text-neutral-400 italic font-sans text-sm">
          Chargement de l'historique...
        </div>
      </UCard>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-40 gap-4">
    <UIcon name="i-lucide-loader-2" class="w-10 h-10 text-cafe-300 animate-spin" />
    <span class="text-sm text-neutral-400 font-sans tracking-widest uppercase">Récupération des données...</span>
  </div>
</template>

<style scoped>
.animate-page-in {
  animation: pageIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes pageIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
