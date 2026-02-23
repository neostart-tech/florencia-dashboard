<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Article {
  id: string | number
  nom: string
}

interface Stock {
  id: string | number
  quantite: number
  article: Article
}

interface Mouvement {
  id: string | number
  type: 'entree' | 'sortie'
  quantite: number
  commentaire?: string
  created_at: string
}

const stockStore = useStockStore()
const articleStore = useArticleStore()
const { stocks, mouvements } = storeToRefs(stockStore)
const { articles } = storeToRefs(articleStore)
const toast = useToast()

const isModalOpen = ref(false)
const isHistoryOpen = ref(false)
const isSubmitting = ref(false)
const selectedArticleId = ref('')

const newMouvement = ref({
  article_id: '',
  type: 'entree' as 'entree' | 'sortie',
  quantite: 1,
  commentaire: ''
})

onMounted(() => {
  stockStore.fetchStocks()
  articleStore.fetchArticles()
})

const handleCreateMouvement = async () => {
  if (!newMouvement.value.article_id || !newMouvement.value.quantite) {
    toast.add({ title: 'Erreur', description: 'Veuillez remplir tous les champs.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await stockStore.createMouvement(newMouvement.value)
    toast.add({ title: 'Succès', description: 'Mouvement enregistré.', color: 'success' })
    isModalOpen.value = false
    newMouvement.value = { article_id: '', type: 'entree', quantite: 1, commentaire: '' }
    stockStore.fetchStocks()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.response?.data?.message || 'Une erreur est survenue', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const showHistory = async (articleId: string | number) => {
  selectedArticleId.value = articleId.toString()
  await stockStore.fetchMouvements(articleId)
  isHistoryOpen.value = true
}

const getArticleName = (id: string | number) => {
  return (articles.value as any[]).find(a => a.id === id)?.nom || 'Article inconnu'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const columns = [
  { accessorKey: 'article', header: 'Produit' },
  { accessorKey: 'quantite', header: 'En Stock' },
  { accessorKey: 'actions', header: '', id: 'actions' }
]
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Inventaire & Logistique</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Stocks</h1>
      </div>
      <UButton
        icon="i-lucide-arrow-up-down"
        label="Mouvement Stock"
        class="bg-cafe-700 hover:bg-cafe-800 text-white px-6 py-3 shadow-xl uppercase tracking-widest text-[0.65rem] font-sans"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Stock Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <UCard class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cafe-50 rounded-xl text-cafe-600">
            <UIcon name="i-lucide-alert-triangle" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400">Alertes Stock Bas</p>
            <p class="text-2xl font-serif text-neutral-800">{{ (stocks as any[]).filter(s => s.quantite < 5).length }}</p>
          </div>
        </div>
      </UCard>
      <UCard class="border-none shadow-sm bg-white rounded-2xl">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cafe-50 rounded-xl text-cafe-600">
            <UIcon name="i-lucide-box" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400">Total Références</p>
            <p class="text-2xl font-serif text-neutral-800">{{ stocks.length }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Stock Table -->
    <UCard class="border-none shadow-[0_20px_60px_rgba(108,66,57,0.05)] bg-white rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
      <UTable :rows="stocks" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.6rem] tracking-[0.2em]',
        td: 'font-sans py-5'
      }">
        <template #article-data="{ row }">
          <span class="font-medium text-neutral-800">{{ (row.original as any).article?.nom }}</span>
        </template>

        <template #quantite-data="{ row }">
          <UBadge 
            :color="(row.original as any).quantite < 5 ? 'error' : (row.original as any).quantite < 15 ? 'warning' : 'success'" 
            variant="subtle" 
            class="font-mono px-3"
          >
            {{ (row.original as any).quantite }} unités
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <UButton 
            color="neutral" 
            variant="ghost" 
            icon="i-lucide-history" 
            label="Historique"
            class="text-[0.6rem] uppercase tracking-widest font-sans"
            @click="showHistory((row.original as any).article.id)" 
          />
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-package-x" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun stock répertorié</p>
          </div>
        </template>
      </UTable>
      </div>
    </UCard>

    <!-- Modal Mouvement -->
    <UModal v-model="isModalOpen">
      <UCard :ui="{ body: 'p-8' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl uppercase tracking-wide">Mouvement de stock</h3>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false" />
          </div>
        </template>

        <form class="space-y-6" @submit.prevent="handleCreateMouvement">
          <UFormField label="Article" required>
            <select v-model="newMouvement.article_id" class="w-full h-10 border rounded-xl px-4 text-sm bg-white focus:ring-2 focus:ring-cafe-200 outline-none transition-all">
              <option value="">Sélectionner un produit</option>
              <option v-for="a in (articles as any[])" :key="a.id" :value="a.id">{{ a.nom }}</option>
            </select>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Type" required>
              <div class="flex bg-neutral-100 p-1 rounded-xl">
                <button 
                  type="button"
                  @click="newMouvement.type = 'entree'"
                  class="flex-1 py-1.5 text-[0.6rem] uppercase tracking-widest rounded-lg transition-all"
                  :class="newMouvement.type === 'entree' ? 'bg-white text-cafe-700 shadow-sm' : 'text-neutral-400'"
                >Entrée</button>
                <button 
                  type="button"
                  @click="newMouvement.type = 'sortie'"
                  class="flex-1 py-1.5 text-[0.6rem] uppercase tracking-widest rounded-lg transition-all"
                  :class="newMouvement.type === 'sortie' ? 'bg-white text-error-600 shadow-sm' : 'text-neutral-400'"
                >Sortie</button>
              </div>
            </UFormField>
            <UFormField label="Quantité" required>
              <UInput v-model="newMouvement.quantite" type="number" min="1" size="md" variant="outline" />
            </UFormField>
          </div>

          <UFormField label="Commentaire (facultatif)">
            <UTextarea v-model="newMouvement.commentaire" placeholder="Ex: Arrivage fournisseur, casse, retour client..." variant="outline" :rows="2" />
          </UFormField>

          <UButton 
            type="submit" 
            block 
            class="bg-cafe-700 hover:bg-cafe-800 py-3 uppercase tracking-widest text-xs shadow-lg"
            :loading="isSubmitting"
          >
            Enregistrer le mouvement
          </UButton>
        </form>
      </UCard>
    </UModal>

    <!-- Slideover Historique -->
    <USlideover v-model="isHistoryOpen" title="Historique des mouvements">
       <div class="p-6 h-full flex flex-col">
         <div class="mb-8">
           <h3 class="font-serif text-2xl text-neutral-800">Historique</h3>
           <p class="text-xs text-neutral-400 font-sans uppercase tracking-[0.2em] mt-1">{{ getArticleName(selectedArticleId) }}</p>
         </div>

         <div class="flex-1 overflow-y-auto space-y-4 pr-2">
            <div v-for="mov in mouvements" :key="mov.id" class="p-4 rounded-2xl border border-neutral-100 bg-white relative overflow-hidden group">
               <div class="absolute left-0 top-0 bottom-0 w-1" :class="mov.type === 'entree' ? 'bg-green-500' : 'bg-red-500'"></div>
               <div class="flex justify-between items-start mb-2">
                  <span class="text-[0.6rem] uppercase tracking-widest font-sans text-neutral-400">{{ formatDate(mov.created_at) }}</span>
                  <span class="text-xs font-serif italic" :class="mov.type === 'entree' ? 'text-green-600' : 'text-red-600'">
                    {{ mov.type === 'entree' ? '+' : '-' }}{{ mov.quantite }}
                  </span>
               </div>
               <p class="text-sm text-neutral-700">{{ mov.commentaire || (mov.type === 'entree' ? 'Ajustement positif' : 'Ajustement négatif') }}</p>
            </div>

            <div v-if="mouvements.length === 0" class="text-center py-20 italic text-neutral-300 text-sm">
              Aucun mouvement enregistré pour cet article.
            </div>
         </div>
       </div>
    </USlideover>
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
