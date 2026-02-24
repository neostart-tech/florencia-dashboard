<script setup lang="ts">
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { newCustomerAlerts } = storeToRefs(notificationStore)

onMounted(() => {
  notificationStore.fetchAllAlerts()
})

const columns = [
  { accessorKey: 'date', header: 'Date d\'inscription' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'info', header: 'Contact' },
  { accessorKey: 'actions', header: '', id: 'actions' }
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <div>
      <p class="text-[0.7rem] uppercase tracking-[0.3em] text-blue-500 font-sans mb-1">Acquisition</p>
      <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Alertes Nouveaux Clients</h1>
      <p class="text-sm text-neutral-500 font-sans mt-1">Identifiez et accueillez vos derniers inscrits.</p>
    </div>

    <UCard class="border-none shadow-[0_20px_60px_rgba(59,130,246,0.03)] bg-white rounded-3xl overflow-hidden">
      <UTable :data="newCustomerAlerts" :columns="columns" :ui="{ td: 'font-sans py-5' }">
        <template #date-cell="{ row }">
          <span class="text-xs text-neutral-500">{{ formatDate(row.original.created_at) }}</span>
        </template>

        <template #client-cell="{ row }">
          <div class="flex items-center gap-3">
             <UAvatar :src="`https://ui-avatars.com/api/?name=${row.original.nom}&background=EFF6FF&color=3B82F6`" size="sm" />
             <span class="font-medium text-neutral-800">{{ row.original.nom }}</span>
          </div>
        </template>

        <template #info-cell="{ row }">
          <div class="flex flex-col">
            <span class="text-xs text-neutral-600">{{ row.original.email || 'Email non fourni' }}</span>
            <span class="text-[0.65rem] text-neutral-400 italic">Prénom: {{ row.original.prenom || 'N/A' }}</span>
          </div>
        </template>

        <template #actions-cell="{ row }">
          <UButton 
            size="xs" 
            color="primary" 
            variant="ghost" 
            icon="i-lucide-gift" 
            label="Offrir cadeau bienvenue" 
            class="text-[0.6rem] uppercase tracking-widest bg-cafe-50 hover:bg-cafe-100 text-cafe-700 font-bold border-none"
          />
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-user-check" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun nouveau client sur la période</p>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
