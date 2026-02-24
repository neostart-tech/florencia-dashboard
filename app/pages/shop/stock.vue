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
const isLoading = ref(false)
const selectedArticleId = ref('')
const search = ref('')

const newMouvement = ref({
  article_id: '',
  type: 'entree' as 'entree' | 'sortie',
  quantite: 1,
  commentaire: ''
})

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      stockStore.fetchStocks(),
      articleStore.fetchArticles()
    ])
  } finally {
    isLoading.value = false
  }
})

const filteredStocks = computed(() => {
  if (!search.value) return stocks.value
  return stocks.value.filter(s => 
    s.article?.nom?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const handleCreateMouvement = async () => {
  if (!newMouvement.value.article_id || !newMouvement.value.quantite) {
    toast.add({ title: 'Champs manquants', description: 'Veuillez sélectionner un article et une quantité.', color: 'warning' })
    return
  }

  isSubmitting.value = true
  try {
    await stockStore.createMouvement(newMouvement.value)
    toast.add({ title: 'Mouvement enregistré', description: `Le stock a été mis à jour avec succès.`, color: 'success' })
    isModalOpen.value = false
    newMouvement.value = { article_id: '', type: 'entree', quantite: 1, commentaire: '' }
    await stockStore.fetchStocks()
  } catch (error: any) {
    toast.add({ title: 'Erreur', description: error.response?.data?.message || 'Impossible d\'enregistrer le mouvement.', color: 'error' })
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
  return articles.value.find(a => a.id.toString() === id.toString())?.nom || 'Article inconnu'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount).replace('XOF', 'Fcfa')
}

const totalValue = computed(() => {
  return (stocks.value as any[]).reduce((acc, s) => acc + (s.quantite * (s.article?.prix || 0)), 0)
})

const columns = [
  { accessorKey: 'article', header: 'Produit' },
  { accessorKey: 'quantite', header: 'Stock Actuel' },
  { accessorKey: 'actions', header: '', id: 'actions' }
]
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-8 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Inventaire & Logistique</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Stocks</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1">Gérez vos entrées et sorties de produits en temps réel.</p>
      </div>
      <UButton
        icon="i-lucide-arrow-up-down"
        label="Nouveau Mouvement"
        class="bg-cafe-800 hover:bg-cafe-900 text-white px-8 py-4 shadow-xl uppercase tracking-widest text-[0.7rem] font-sans border-none transition-all hover:scale-105 active:scale-95"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Stock Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard class="border-none shadow-sm bg-white rounded-2xl relative overflow-hidden group">
        <div class="flex items-center gap-5">
          <div class="p-4 bg-red-50 rounded-2xl text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
            <UIcon name="i-lucide-alert-triangle" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-0.5">Alertes Stock Bas</p>
            <p class="text-2xl font-serif text-neutral-800">{{ stocks.filter(s => s.quantite < 5).length }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="border-none shadow-sm bg-white rounded-2xl relative overflow-hidden group">
        <div class="flex items-center gap-5">
          <div class="p-4 bg-cafe-50 rounded-2xl text-cafe-600 transition-colors group-hover:bg-cafe-600 group-hover:text-white">
            <UIcon name="i-lucide-box" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-neutral-400 mb-0.5">Total Références</p>
            <p class="text-2xl font-serif text-neutral-800">{{ stocks.length }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="border-none shadow-sm bg-cafe-900 text-white rounded-2xl relative overflow-hidden">
        <div class="flex items-center gap-5">
          <div class="p-4 bg-white/10 rounded-2xl text-cafe-200">
            <UIcon name="i-lucide-package-check" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-[0.6rem] uppercase tracking-widest text-cafe-300 mb-0.5">Valeur estimée</p>
            <p class="text-2xl font-serif">{{ formatCurrency(totalValue) }}</p>
          </div>
        </div>
        <div class="absolute right-[-10%] bottom-[-20%] w-24 h-24 bg-cafe-500/20 rounded-full blur-xl"></div>
      </UCard>
    </div>

    <!-- Filters -->
    <UCard class="border-none shadow-sm bg-white/60 backdrop-blur-sm rounded-2xl" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Filtrer par produit..."
          size="lg"
          variant="outline"
          class="flex-1 font-sans"
        />
      </div>
    </UCard>

    <!-- Stock Table -->
    <UCard class="border-none shadow-[0_25px_50px_-12px_rgba(108,66,57,0.08)] bg-white rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
        <UTable :data="filteredStocks" :columns="columns" :loading="isLoading" :ui="{ 
          thead: 'bg-neutral-50/80 uppercase text-[0.6rem] tracking-[0.2em] py-4',
          td: 'font-sans py-6 border-b border-neutral-50 last:border-0'
        }">
          <template #article-cell="{ row }">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-cafe-400">
                <UIcon name="i-lucide-package" class="w-5 h-5" />
              </div>
              <span class="font-medium text-neutral-800">{{ row.original.article?.nom }}</span>
            </div>
          </template>

          <template #quantite-cell="{ row }">
            <div class="flex items-center gap-3">
              <UBadge 
                :color="(row.original.quantite as number) < 5 ? 'error' : (row.original.quantite as number) < 15 ? 'warning' : 'success'" 
                variant="subtle" 
                class="font-mono px-4 py-1 rounded-full text-xs"
              >
                {{ row.original.quantite }} unités
              </UBadge>
              <UIcon 
                v-if="(row.original.quantite as number) < 5" 
                name="i-lucide-alert-circle" 
                class="w-4 h-4 text-red-500 animate-pulse" 
              />
            </div>
          </template>

          <template #actions-cell="{ row }">
            <UButton 
              color="neutral" 
              variant="ghost" 
              icon="i-lucide-history" 
              label="Historique"
              class="text-[0.65rem] uppercase tracking-widest font-bold text-cafe-600 hover:bg-cafe-50"
              @click="showHistory(row.original.article_id)" 
            />
          </template>

          <template #empty>
            <div class="flex flex-col items-center justify-center py-24 gap-4">
              <UIcon name="i-lucide-package-x" class="w-12 h-12 text-neutral-200" />
              <div class="text-center">
                <p class="text-sm text-neutral-500 font-sans font-medium">Aucun stock répertorié</p>
                <p class="text-xs text-neutral-400 font-sans mt-1">Commencez par ajouter des articles ou enregistrer un mouvement.</p>
              </div>
            </div>
          </template>
        </UTable>
      </div>
    </UCard>

    <!-- Modal Mouvement -->
    <UModal v-model:open="isModalOpen" size="lg" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-serif text-2xl text-neutral-800 uppercase tracking-wide">Mouvement de stock</h3>
            <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-1">Ajuster l'inventaire manuellement</p>
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="rounded-full" @click="isModalOpen = false" />
        </div>
      </template>

      <template #body>
        <form class="space-y-8" @submit.prevent="handleCreateMouvement">
          <UFormField label="Produit concerné" required>
            <select v-model="newMouvement.article_id" class="w-full h-12 border border-neutral-200 rounded-2xl px-4 text-sm bg-white focus:ring-2 focus:ring-cafe-100 outline-none transition-all appearance-none cursor-pointer">
              <option value="">Sélectionner un produit du catalogue</option>
              <option v-for="a in articles" :key="a.id" :value="a.id">{{ a.nom }}</option>
            </select>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Type d'ajustement" required>
              <div class="flex bg-neutral-100 p-1 rounded-2xl">
                <button 
                  type="button"
                  @click="newMouvement.type = 'entree'"
                  class="flex-1 py-2.5 text-[0.65rem] uppercase tracking-widest rounded-xl transition-all font-bold"
                  :class="newMouvement.type === 'entree' ? 'bg-white text-cafe-800 shadow-md' : 'text-neutral-400 hover:text-neutral-500'"
                >
                  <UIcon name="i-lucide-arrow-down-to-dot" class="w-4 h-4 mr-1 inline" /> Entrée
                </button>
                <button 
                  type="button"
                  @click="newMouvement.type = 'sortie'"
                  class="flex-1 py-2.5 text-[0.65rem] uppercase tracking-widest rounded-xl transition-all font-bold"
                  :class="newMouvement.type === 'sortie' ? 'bg-white text-red-600 shadow-md' : 'text-neutral-400 hover:text-neutral-500'"
                >
                  <UIcon name="i-lucide-arrow-up-from-dot" class="w-4 h-4 mr-1 inline" /> Sortie
                </button>
              </div>
            </UFormField>
            <UFormField label="Quantité" required>
              <UInput v-model="newMouvement.quantite" type="number" min="1" size="xl" variant="outline" class="font-mono" />
            </UFormField>
          </div>

          <UFormField label="Note explicative">
            <UTextarea v-model="newMouvement.commentaire" placeholder="Ex: Réception commande fournisseur du 20/02, casse, perte..." variant="outline" :rows="3" />
          </UFormField>
        </form>
      </template>

      <template #footer>
        <UButton label="Fermer" color="neutral" variant="ghost" class="font-sans uppercase tracking-[0.2em] text-[0.65rem] px-6" @click="isModalOpen = false" />
        <UButton 
          type="submit" 
          class="bg-cafe-800 hover:bg-cafe-950 text-white py-3 px-8 uppercase tracking-[0.2em] text-[0.65rem] shadow-xl transition-all hover:scale-105"
          :loading="isSubmitting"
          @click="handleCreateMouvement"
        >
          Enregistrer
        </UButton>
      </template>
    </UModal>

    <!-- Slideover Historique -->
    <USlideover v-model:open="isHistoryOpen" :ui="{ wrapper: 'relative z-50', header: 'border-b border-neutral-100 p-8', body: 'flex-1 overflow-y-auto p-8 custom-scrollbar' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-serif text-2xl text-neutral-800 uppercase tracking-wide">Journal de Bord</h3>
            <p class="text-[0.6rem] text-cafe-600 font-sans uppercase tracking-[0.3em] font-bold mt-1">{{ getArticleName(selectedArticleId) }}</p>
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="rounded-full" @click="isHistoryOpen = false" />
        </div>
      </template>

      <template #default>
        <div class="space-y-6">
          <div v-for="mov in mouvements" :key="mov.id" class="relative pl-8 border-l-2 border-neutral-100 pb-2 last:pb-0">
            <div class="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white" :class="mov.type === 'entree' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'"></div>
              
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <span class="text-[0.6rem] uppercase tracking-widest font-sans text-neutral-400">{{ formatDate(mov.created_at) }}</span>
                <span class="text-sm font-bold font-mono" :class="mov.type === 'entree' ? 'text-green-600' : 'text-red-600'">
                  {{ mov.type === 'entree' ? '+' : '-' }}{{ mov.quantite }}
                </span>
              </div>
              <div class="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 mt-2 hover:bg-white transition-colors">
                <p class="text-xs text-neutral-700 leading-relaxed">{{ mov.commentaire || (mov.type === 'entree' ? 'Réapprovisionnement manuel' : 'Déstockage manuel') }}</p>
              </div>
            </div>
          </div>

          <div v-if="mouvements.length === 0" class="flex flex-col items-center justify-center py-40 gap-4 opacity-30">
            <UIcon name="i-lucide-history" class="w-12 h-12" />
            <p class="text-xs uppercase tracking-widest">Aucun historique</p>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #EFE9E6;
  border-radius: 10px;
}

.animate-page-in {
  animation: pageIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes pageIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
