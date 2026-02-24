<script setup lang="ts">
import { storeToRefs } from 'pinia'

const crmStore = useCrmStore()
const { categories } = storeToRefs(crmStore)

const isOpen = ref(false)
const newCategory = ref({ label: '', color: 'neutral' })

const colorOptions = [
  { label: 'Marron (Café)', value: 'primary' },
  { label: 'Gris', value: 'neutral' },
  { label: 'Vert', value: 'success' },
  { label: 'Orange', value: 'warning' },
  { label: 'Bleu', value: 'info' }
]

const addCategory = () => {
  if (newCategory.value.label) {
    categories.value.push({
      id: categories.value.length + 1,
      ...newCategory.value
    })
    isOpen.value = false
    newCategory.value = { label: '', color: 'neutral' }
  }
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <div class="flex items-end justify-between">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">CRM & Segmentation</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Catégories Clients</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1">Définissez les segments de votre clientèle pour un meilleur ciblage.</p>
      </div>
      <UButton 
        icon="i-lucide-plus" 
        label="Ajouter une catégorie" 
        class="bg-cafe-800 hover:bg-cafe-900 text-white text-[0.7rem] uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg"
        @click="isOpen = true"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard 
        v-for="cat in categories" 
        :key="cat.id" 
        class="border-none shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl group"
      >
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <UBadge :color="(cat.color as any)" variant="subtle" class="uppercase tracking-widest text-[0.6rem] font-bold">
              {{ cat.label }}
            </UBadge>
            <UDropdownMenu :items="[[{ label: 'Modifier', icon: 'i-lucide-edit' }, { label: 'Supprimer', icon: 'i-lucide-trash', color: 'error' }]]">
              <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" size="xs" />
            </UDropdownMenu>
          </div>
          
          <div class="pt-2">
            <p class="text-xs text-neutral-400 font-sans italic">Définie selon le volume d'achat et la fréquence.</p>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <UIcon name="i-lucide-users" class="w-4 h-4 text-neutral-300" />
            <span class="text-xs font-semibold text-neutral-800">45 clients</span>
          </div>
        </div>
      </UCard>
    </div>

    <UModal v-model:open="isOpen" :ui="{ footer: 'justify-end' }">
      <template #header>
        <h3 class="font-serif text-lg text-neutral-800 uppercase tracking-widest">Nouvelle Catégorie</h3>
      </template>
      
      <template #body>
        <div class="space-y-4">
          <UFormField label="Nom de la catégorie">
            <UInput v-model="newCategory.label" placeholder="ex: Client de passage" class="font-sans" />
          </UFormField>
          
          <UFormField label="Couleur distinctive">
            <USelect v-model="newCategory.color" :options="colorOptions" class="font-sans" />
          </UFormField>
        </div>
      </template>

      <template #footer>
        <UButton color="neutral" variant="ghost" label="Annuler" @click="isOpen = false" />
        <UButton color="primary" label="Enregistrer" class="bg-cafe-800 text-white" @click="addCategory" />
      </template>
    </UModal>
  </div>
</template>
