<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'reception'
})

const articleStore = useArticleStore()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const toast = useToast()

const { articles } = storeToRefs(articleStore)
const { services } = storeToRefs(serviceStore)
const runtimeConfig = useRuntimeConfig()

// Base du serveur backend (sans /api) pour les images
const storageBase = computed(() => {
  const apiBase = runtimeConfig.public.apiBase as string
  return apiBase.replace(/\/api\/?$/, '')
})

/**
 * Construit l'URL publique d'une image.
 */
const getImageUrl = (item: any): string => {
  const images = item?.images?.data || item?.images || []
  const img = images[0]
  if (!img) return ''
  if (img.url && img.url.startsWith('http')) return img.url
  const path = img.url || img.path || ''
  if (!path) return ''
  return `${storageBase.value}/storage/${path.replace(/^\//, '')}`
}

// State
const activeTab = ref('services')
const search = ref('')
const clientName = ref('')
const cart = ref<any[]>([])
const isProcessing = ref(false)
const showReceiptModal = ref(false)
const currentReceipt = ref<any>(null)

// Load data
onMounted(() => {
  articleStore.fetchArticles()
  serviceStore.fetchServices()
})

const filteredItems = computed(() => {
  const list = activeTab.value === 'services' ? services.value : articles.value
  if (!search.value) return list
  return list.filter((item: any) => 
    item.nom.toLowerCase().includes(search.value.toLowerCase()) || 
    item.description?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const addToCart = (item: any, type: 'service' | 'article') => {
  const existing = cart.value.find(i => i.id === item.id && i.type === type)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      ...item,
      type,
      quantity: 1
    })
  }
}

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1)
}

const total = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.prix * item.quantity), 0)
})

const handleCheckout = async () => {
  if (cart.value.length === 0) return
  
  isProcessing.value = true
  try {
    // Simulation d'encaissement (à brancher sur une API de vente si elle existe)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    currentReceipt.value = {
      id: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date(),
      items: [...cart.value],
      total: total.value,
      client: clientName.value || 'Client de Passage',
      cashier: authStore.user?.nom || 'Réception Florencia'
    }
    
    toast.add({ title: 'Vente effectuée', description: 'Le paiement a été validé.', color: 'success' })
    showReceiptModal.value = true
    cart.value = []
    clientName.value = ''
  } catch (error) {
    toast.add({ title: 'Erreur', description: 'Une erreur est survenue lors de l\'encaissement.', color: 'error' })
  } finally {
    isProcessing.value = false
  }
}

const printReceipt = () => {
  window.print()
}
</script>

<template>
  <div class="h-full flex flex-col gap-6 animate-page-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Caisse / Vente Directe</h1>
        <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-1">Espace de vente et encaissement rapide</p>
      </div>
      <div class="flex items-center gap-2">
         <UInput v-model="search" icon="i-lucide-search" placeholder="Rechercher..." size="md" class="w-full md:w-64" variant="outline" />
      </div>
    </div>

    <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
      <!-- Items Selection (8/12) -->
      <div class="lg:col-span-8 flex flex-col gap-6 min-h-0">
        <!-- Tabs -->
        <div class="flex gap-4 p-1 bg-neutral-100 rounded-2xl w-fit">
          <button 
            @click="activeTab = 'services'"
            :class="[activeTab === 'services' ? 'bg-white shadow-sm text-cafe-700' : 'text-neutral-500 hover:text-neutral-700']"
            class="px-6 py-2 rounded-xl text-xs font-serif uppercase tracking-[0.2em] transition-all"
          >
            Services
          </button>
          <button 
            @click="activeTab = 'articles'"
            :class="[activeTab === 'articles' ? 'bg-white shadow-sm text-cafe-700' : 'text-neutral-500 hover:text-neutral-700']"
            class="px-6 py-2 rounded-xl text-xs font-serif uppercase tracking-[0.2em] transition-all"
          >
            Boutique
          </button>
        </div>

        <!-- Grid -->
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <div 
              v-for="item in filteredItems" 
              :key="item.id"
              @click="addToCart(item, activeTab === 'services' ? 'service' : 'article')"
              class="bg-white border border-neutral-100 rounded-3xl p-4 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-cafe-200 hover:shadow-lg transition-all group active:scale-95"
            >
              <div class="w-16 h-16 rounded-2xl bg-cafe-50 overflow-hidden flex items-center justify-center text-cafe-500 group-hover:bg-cafe-100 transition-colors">
                <img 
                  v-if="getImageUrl(item)" 
                  :src="getImageUrl(item)" 
                  :alt="item.nom"
                  class="w-full h-full object-cover"
                />
                <UIcon v-else :name="activeTab === 'services' ? 'i-lucide-scissors' : 'i-lucide-package'" class="w-8 h-8" />
              </div>
              <div class="space-y-1 w-full">
                <h4 class="text-sm font-medium text-neutral-800 line-clamp-1">{{ item.nom }}</h4>
                <p class="text-xs text-cafe-700 font-serif">{{ item.prix }} FCFA</p>
              </div>
            </div>
          </div>
          
          <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-20 text-neutral-300 gap-4">
            <UIcon name="i-lucide-search-x" class="w-16 h-16 opacity-20" />
            <p class="font-sans italic">Aucun élément ne correspond à votre recherche.</p>
          </div>
        </div>
      </div>

      <!-- Checkout / Cart (4/12) -->
      <div class="lg:col-span-4 flex flex-col min-h-0 bg-white border border-neutral-100 rounded-[2.5rem] shadow-[0_20px_60px_rgba(108,66,57,0.06)] overflow-hidden">
        <div class="p-6 border-b border-neutral-50">
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-lg text-neutral-800 uppercase tracking-widest">Panier Actuel</h3>
            <UBadge v-if="cart.length > 0" :label="`${cart.length} éléments`" color="neutral" variant="subtle" size="sm" />
          </div>
        </div>

        <!-- Cart List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-center gap-4 text-neutral-300 py-10">
            <UIcon name="i-lucide-shopping-cart" class="w-16 h-16 opacity-20" />
            <p class="text-sm font-sans">Votre panier est vide.<br>Cliquez sur des éléments pour les ajouter.</p>
          </div>

          <div 
            v-for="(item, index) in cart" 
            :key="index"
            class="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
          >
            <div class="w-10 h-10 rounded-xl bg-white overflow-hidden flex items-center justify-center border border-neutral-100 text-cafe-400">
               <img 
                 v-if="getImageUrl(item)" 
                 :src="getImageUrl(item)" 
                 :alt="item.nom"
                 class="w-full h-full object-cover"
               />
               <UIcon v-else :name="item.type === 'service' ? 'i-lucide-scissors' : 'i-lucide-package'" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
               <h5 class="text-sm font-medium text-neutral-800 truncate">{{ item.nom }}</h5>
               <div class="flex items-center gap-2">
                 <span class="text-[0.65rem] text-neutral-400">x {{ item.quantity }}</span>
                 <span class="text-xs font-serif text-cafe-700">{{ item.prix * item.quantity }} FCFA</span>
               </div>
            </div>
            <UButton 
              color="neutral" 
              variant="ghost" 
              icon="i-lucide-trash-2" 
              size="xs" 
              @click="removeFromCart(index)"
              class="text-neutral-300 hover:text-red-500"
            />
          </div>
        </div>

        <!-- Footer Checkout -->
        <div class="p-6 bg-cafe-50/30 border-t border-cafe-50 space-y-4">
          <div class="space-y-1.5">
            <span class="text-[0.6rem] text-neutral-400 uppercase tracking-widest ml-1">Nom du client (Optionnel)</span>
            <UInput v-model="clientName" placeholder="Ex: M. Kouassi" variant="outline" size="md" class="bg-white/50" />
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-neutral-500 font-sans uppercase tracking-[0.2em] text-[0.65rem]">Total à payer</span>
            <span class="text-2xl font-serif text-cafe-800">{{ total }} FCFA</span>
          </div>
          
          <UButton 
            @click="handleCheckout"
            :disabled="cart.length === 0"
            :loading="isProcessing"
            block
            size="xl"
            class="bg-cafe-700 hover:bg-cafe-800 py-4 font-serif uppercase tracking-[0.2em] text-sm shadow-xl shadow-cafe-200"
          >
            Valider l'encaissement
          </UButton>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <UModal v-model:open="showReceiptModal" size="sm">
      <template #body>
        <div class="p-8 flex flex-col gap-6 print:p-0">
          <div id="thermal-receipt" class="receipt-font mx-auto text-black bg-white p-2 print:p-0">
            <!-- Logo & En-tête -->
            <div class="text-center space-y-1 mb-6">
              <h2 class="text-2xl font-bold tracking-[0.3em] uppercase">FLORENCIA</h2>
              <p class="text-[0.7rem] font-bold uppercase tracking-widest border-y border-black py-1">Maison de Beauté</p>
              <div class="text-[0.65rem] space-y-0.5 leading-tight pt-2 uppercase">
                <p class="font-bold">Lomé, Quartier Bè-kpota</p>
                <p>Tél: +228 90 00 00 00 / 70 00 00 00</p>
                <p>RCCM: TG-LOM 2024 B XXXX</p>
              </div>
            </div>

            <!-- Infos Ticket -->
            <div class="space-y-1 mb-4 text-[0.7rem] uppercase">
              <div class="flex justify-between border-t border-dashed border-black pt-2">
                <span>Date: {{ new Intl.DateTimeFormat('fr-FR').format(currentReceipt?.date) }}</span>
                <span>Heure: {{ new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Ticket N°:</span>
                <span>{{ currentReceipt?.id }}</span>
              </div>
              <div class="border-b border-dashed border-black pb-2">
                Client: <span class="font-bold">{{ currentReceipt?.client }}</span>
              </div>
            </div>

            <!-- Articles -->
            <div class="space-y-3 mb-4 text-[0.7rem]">
              <div class="flex justify-between font-bold border-b border-black pb-1 uppercase italic">
                <span>Désignation</span>
                <span>Total</span>
              </div>
              <div v-for="item in currentReceipt?.items" :key="item.id" class="space-y-1">
                <div class="flex items-start gap-2">
                  <!-- Image miniature sur le reçu -->
                  <div v-if="getImageUrl(item)" class="w-8 h-8 rounded border border-black/10 overflow-hidden flex-shrink-0">
                    <img :src="getImageUrl(item)" :alt="item.nom" class="w-full h-full object-cover grayscale" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between font-bold uppercase">
                      <span class="truncate pr-2">{{ item.nom }}</span>
                      <span class="whitespace-nowrap">{{ (item.prix * item.quantity).toLocaleString() }}</span>
                    </div>
                    <div class="text-[0.6rem] italic opacity-80">
                      {{ item.quantity }} x {{ item.prix.toLocaleString() }} FCFA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Totaux -->
            <div class="border-t-2 border-black pt-2 space-y-1 text-[0.8rem]">
              <div class="flex justify-between font-black text-lg">
                <span>TOTAL NET</span>
                <span>{{ currentReceipt?.total.toLocaleString() }} F</span>
              </div>
              <div class="flex justify-between text-[0.65rem] italic pt-2 border-t border-dashed border-black">
                <span>Mode de règlement:</span>
                <span class="font-bold uppercase">Espèces / Cash</span>
              </div>
              <div class="flex justify-between text-[0.65rem] italic">
                <span>Caissier(e):</span>
                <span>{{ currentReceipt?.cashier }}</span>
              </div>
            </div>

            <!-- Pied de page -->
            <div class="text-center mt-8 pt-4 border-t-2 border-dashed border-black">
              <p class="text-[0.7rem] font-bold uppercase tracking-widest mb-2">*** MERCI DE VOTRE VISITE ***</p>
              <div class="flex justify-center mb-4">
                <UIcon name="i-lucide-qr-code" class="w-12 h-12 opacity-20" />
              </div>
              <p class="text-[0.6rem] leading-tight italic uppercase">
                Les articles vendus ne sont ni repris,<br>ni échangés.<br>
              </p>
            </div>
          </div>

          <div class="flex gap-4 no-print">
            <UButton block variant="outline" label="Fermer" color="neutral" @click="showReceiptModal = false" />
            <UButton block label="Imprimer le reçu" icon="i-lucide-printer" class="bg-cafe-700" @click="printReceipt" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.receipt-font {
  font-family: 'Courier New', Courier, monospace;
}

@media print {
  @page {
    margin: 0;
    size: 58mm auto; /* On cible le format le plus petit (58mm) qui passe aussi sur 80mm */
  }
  
  /* Cacher ABSOLUMENT TOUT */
  body * {
    visibility: hidden !important;
    overflow: visible !important;
  }

  /* Afficher uniquement le reçu et ses enfants */
  #thermal-receipt, #thermal-receipt * {
    visibility: visible !important;
    display: block !important;
  }

  #thermal-receipt .flex {
    display: flex !important;
    flex-direction: row !important;
  }
  #thermal-receipt .justify-between {
    justify-content: space-between !important;
  }
  #thermal-receipt .text-center {
    text-align: center !important;
  }
  
  /* Masquer les éléments de l'interface qui ne doivent pas s'imprimer */
  .no-print, 
  button, 
  .u-button,
  .u-modal__close,
  [class*="u-modal"],
  [class*="u-overlay"] {
    display: none !important;
    visibility: hidden !important;
  }

  body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  #thermal-receipt {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 52mm !important; /* Largeur de sécurité pour les imprimantes 57/58mm et 80mm */
    margin: 0 !important;
    padding: 2mm !important;
    border: none !important;
    box-shadow: none !important;
    font-size: 8pt !important;
    line-height: 1.2 !important;
    color: black !important;
    background: white !important;
    z-index: 99999 !important;
  }
  
  #thermal-receipt img {
    filter: grayscale(100%) !important;
    width: 24px !important;
    height: 24px !important;
  }

  /* Forcer les textes en noir pur */
  #thermal-receipt * {
    color: black !important;
    border-color: black !important;
    background: transparent !important;
  }
}

.animate-page-in {
  animation: pageIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(108, 66, 57, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(108, 66, 57, 0.2);
}
</style>
