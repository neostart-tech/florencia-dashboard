<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Article {
  id: string | number
  nom: string
  prix: number
  description?: string
  images?: { url: string; path: string }[]
  sous_categorie?: { libelle: string }
}

const articleStore = useArticleStore()
const sousCategorieStore = useSousCategorieStore()

const { articles } = storeToRefs(articleStore)
const { sousCategories } = storeToRefs(sousCategorieStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  articleStore.fetchArticles()
  sousCategorieStore.fetchSousCategories()
})

const columns = [{
  accessorKey: 'image',
  header: '',
  id: 'image'
}, {
  accessorKey: 'nom',
  header: 'Désignation'
}, {
  accessorKey: 'prix',
  header: 'Prix'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const search = ref('')
const selectedSubCat = ref('all')

const newArticle = ref({
  nom: '',
  prix: 0,
  description: '',
  stock: 0,
  sous_categorie_id: ''
})

const filteredArticles = computed(() => {
  let list = articles.value || []
  if (selectedSubCat.value !== 'all') {
    list = list.filter((a: any) => a.sous_categorie_id?.toString() === selectedSubCat.value)
  }
  if (search.value) {
    list = list.filter((a: any) => a.nom?.toLowerCase().includes(search.value.toLowerCase()))
  }
  return list
})

const resetForm = () => {
  newArticle.value = { nom: '', prix: 0, description: '', stock: 0, sous_categorie_id: '' }
}

const handleCreateArticle = async () => {
  if (!newArticle.value.nom || !newArticle.value.prix || !newArticle.value.sous_categorie_id) {
    toast.add({ title: 'Champs requis', description: 'Le nom, le prix et la catégorie sont obligatoires.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await articleStore.createArticle(newArticle.value)
    toast.add({ title: 'Succès', description: 'Article ajouté au catalogue.', color: 'success' })
    isModalOpen.value = false
    resetForm()
    articleStore.fetchArticles()
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.response?.data?.message || 'Impossible d\'ajouter l\'article.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (row: Article) => {
  if (!confirm(`Supprimer l'article ${row.nom} ?`)) return
  try {
    await articleStore.deleteArticle(row)
    toast.add({ title: 'Supprimé', description: 'Article retiré du catalogue.', color: 'success' })
    articleStore.fetchArticles()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const items = (row: Article) => [
  [{
    label: 'Éditer l\'article',
    icon: 'i-lucide-edit-3',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'Archiver',
    icon: 'i-lucide-archive',
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
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Catalogue Boutique</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Articles</h1>
      </div>
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-folder-tree"
          label="Sous-Catégories"
          variant="outline"
          class="font-sans tracking-widest uppercase text-[0.65rem] border-neutral-200"
        />
        <UButton
          icon="i-lucide-plus"
          label="Nouvel Article"
          class="bg-cafe-700 hover:bg-cafe-800 font-sans tracking-widest uppercase text-[0.65rem] px-6 shadow-lg"
          @click="isModalOpen = true"
        />
      </div>
    </div>

    <!-- Filters -->
    <UCard class="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-2xl" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Rechercher un produit..."
          size="md"
          class="flex-1 font-sans"
          variant="outline"
        />
        <select
          v-model="selectedSubCat"
          class="w-full md:w-64 h-9 rounded-md border border-neutral-200 px-3 text-sm font-sans text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-cafe-300 transition"
        >
          <option value="all">Toutes les catégories</option>
          <option v-for="sc in sousCategories" :key="sc.id" :value="sc.id.toString()">{{ sc.libelle }}</option>
        </select>
      </div>
    </UCard>

    <!-- Articles Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <UTable :rows="filteredArticles" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #image-data="{ row }">
          <img 
            :src="(row.original as any).images?.[0]?.url 
              ? (row.original as any).images[0].url 
              : `https://ui-avatars.com/api/?name=${(row.original as any).nom}&background=FDFCFB&color=6C4239`" 
            class="w-12 h-12 rounded-xl object-cover border border-neutral-100 shadow-sm" 
          />
        </template>

        <template #nom-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-neutral-800">{{ row.original.nom }}</span>
            <span class="text-[0.65rem] text-cafe-500 uppercase tracking-tighter mt-0.5">{{ row.original.sous_categorie?.libelle || 'Catalogue' }}</span>
          </div>
        </template>

        <template #prix-data="{ row }">
          <span class="font-serif text-cafe-700">{{ row.original.prix }} Fcfa</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row.original as unknown as Article)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
          </UDropdown>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-package" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun article dans le catalogue</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal for new article -->
    <UModal v-model="isModalOpen" size="lg" prevent-close>
      <UCard :ui="{ body: 'p-8', header: 'border-b border-neutral-100 px-8 py-4', footer: 'border-t border-neutral-100 px-8 py-4' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-serif text-2xl tracking-wide uppercase text-neutral-800">Ajouter au catalogue</h3>
              <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-0.5">Nouveau produit pour la boutique</p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false; resetForm()" />
          </div>
        </template>

        <form class="space-y-6" @submit.prevent="handleCreateArticle">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <UFormField label="Nom de l'article" required>
                <UInput v-model="newArticle.nom" placeholder="Ex: Sérum Revitalisant" size="md" variant="outline" />
              </UFormField>
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Prix (Fcfa)" required>
                  <UInput v-model="newArticle.prix" type="number" placeholder="0" size="md" variant="outline" />
                </UFormField>
                <UFormField label="Stock Initial">
                  <UInput v-model="newArticle.stock" type="number" placeholder="0" size="md" variant="outline" />
                </UFormField>
              </div>
              <UFormField label="Catégorie" required>
                <select
                  v-model="newArticle.sous_categorie_id"
                  class="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm font-sans text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-cafe-300 transition"
                >
                  <option value="">Sélectionner une sous-catégorie</option>
                  <option v-for="sc in sousCategories" :key="sc.id" :value="sc.id.toString()">{{ sc.libelle }}</option>
                </select>
              </UFormField>
            </div>
            
            <div class="flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 rounded-3xl p-8 bg-neutral-50/50 group hover:border-cafe-200 transition-colors cursor-pointer relative overflow-hidden">
              <UIcon name="i-lucide-image-plus" class="w-12 h-12 text-neutral-300 group-hover:text-cafe-300 transition-colors mb-4" />
              <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest">Téléverser l'image</p>
              <p class="text-[0.5rem] text-neutral-300 mt-2">JPG, PNG (Max 2MB)</p>
              <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <UFormField label="Description (Optionnel)">
            <UTextarea v-model="newArticle.description" placeholder="Détails du produit, bienfaits, conseils d'utilisation..." variant="outline" :rows="3" />
          </UFormField>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false; resetForm()" />
            <UButton
              label="Ajouter l'article"
              class="bg-cafe-700 hover:bg-cafe-800 px-8 py-3 font-sans uppercase tracking-[0.2em] text-xs shadow-lg"
              :loading="isSubmitting"
              @click="handleCreateArticle"
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
