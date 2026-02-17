<script setup lang="ts">
interface Article {
  id: string
  nom: string
  prix: number
  description: string
  images?: { path: string }[]
}

const config = useRuntimeConfig()
const token = typeof window !== 'undefined' ? localStorage.getItem('florencia_admin_token') : null

// Récupération dynamique des articles
const { data: articlesResponse, refresh } = await useFetch<any>(`${config.public.apiBase}/articles`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const articles = computed(() => articlesResponse.value?.data || [])

const columns = [{
  accessorKey: 'image',
  header: '',
  id: 'image'
}, {
  accessorKey: 'name',
  header: 'Désignation'
}, {
  accessorKey: 'price',
  header: 'Prix'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const isModalOpen = ref(false)
const search = ref('')

const items = (row: any) => [
  [{
    label: 'Éditer l\'article',
    icon: 'i-lucide-edit-3',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'Archiver',
    icon: 'i-lucide-archive',
    color: 'red' as const,
    click: () => console.log('Archive', row.id)
  }]
]
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Catalogue Boutique</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Articles</h1>
      </div>
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-folder-tree"
          label="Catégories"
          variant="outline"
          class="font-sans tracking-widest uppercase text-[0.65rem] border-neutral-200"
          to="#"
        />
        <UButton
          icon="i-lucide-plus"
          label="Nouvel Article"
          class="bg-cafe-700 hover:bg-cafe-800 font-sans tracking-widest uppercase text-[0.65rem] px-6"
          @click="isModalOpen = true"
        />
      </div>
    </div>

    <!-- Filters -->
    <UCard class="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-2xl" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row gap-4">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Rechercher un produit..."
          size="lg"
          class="flex-1 font-sans"
          variant="subtle"
        />
        <USelect
          placeholder="Toutes les catégories"
          :options="['Soin Visage', 'Corps', 'Maquillage', 'Accessoires']"
          size="lg"
          variant="subtle"
          class="w-full md:w-64 font-sans"
        />
      </div>
    </UCard>

    <!-- Articles Table -->
    <UCard class="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="articles" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #image-data="{ row }">
          <img 
            :src="row.original.images?.[0]?.path 
              ? `http://127.0.0.1:8000/storage/${row.original.images[0].path}` 
              : `https://ui-avatars.com/api/?name=${row.original.nom}&background=FDFCFB&color=6C4239`" 
            class="w-12 h-12 rounded-xl object-cover border border-neutral-100 shadow-sm" 
          />
        </template>

        <template #name-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-neutral-800">{{ row.original.nom }}</span>
            <span class="text-[0.65rem] text-neutral-400 uppercase tracking-tighter truncate max-w-[200px]">{{ row.original.description }}</span>
          </div>
        </template>

        <template #price-data="{ row }">
          <span class="font-serif text-cafe-700">{{ row.original.prix }} Fcfa</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row.original)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal for new article -->
    <UModal v-model="isModalOpen" size="lg">
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <h3 class="font-serif text-2xl tracking-wide uppercase">Ajouter au catalogue</h3>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false" />
        </div>

        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <UFormField label="Nom de l'article">
                <UInput placeholder="Ex: Sérum Revitalisant" size="lg" variant="subtle" />
              </UFormField>
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Prix (Fcfa)">
                  <UInput type="number" placeholder="0" size="lg" variant="subtle" />
                </UFormField>
                <UFormField label="Stock Initial">
                  <UInput type="number" placeholder="0" size="lg" variant="subtle" />
                </UFormField>
              </div>
              <UFormField label="Catégorie">
                <USelect :options="['Soin Visage', 'Corps', 'Maquillage']" size="lg" variant="subtle" />
              </UFormField>
            </div>
            
            <div class="flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 rounded-3xl p-8 bg-neutral-50/50 group hover:border-cafe-200 transition-colors cursor-pointer">
              <UIcon name="i-lucide-image-plus" class="w-12 h-12 text-neutral-300 group-hover:text-cafe-300 transition-colors mb-4" />
              <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest">Téléverser l'image</p>
              <p class="text-[0.5rem] text-neutral-300 mt-2">JPG, PNG (Max 2MB)</p>
            </div>
          </div>

          <UFormField label="Description (Optionnel)">
            <UTextarea placeholder="Détails du produit, bienfaits, conseils d'utilisation..." variant="subtle" :rows="4" />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <UButton label="Annuler" color="neutral" variant="ghost" @click="isModalOpen = false" />
            <UButton label="Ajouter l'article" class="bg-cafe-700 px-8 py-4 font-sans uppercase tracking-[0.2em] text-xs" @click="isModalOpen = false" />
          </div>
        </form>
      </div>
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
