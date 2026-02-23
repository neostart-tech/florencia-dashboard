<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Category {
  id: string | number
  libelle: string
  sous_categories?: SubCategory[]
}

interface SubCategory {
  id: string | number
  libelle: string
  categorie_id: string | number
}

const categorieStore = useCategorieStore()
const sousCategorieStore = useSousCategorieStore()
const { categories } = storeToRefs(categorieStore)
const { sousCategories } = storeToRefs(sousCategorieStore)
const toast = useToast()

const isCatModalOpen = ref(false)
const isSubModalOpen = ref(false)
const isSubmitting = ref(false)

const newCat = ref({ libelle: '' })
const newSub = ref({ libelle: '', categorie_id: '' })

onMounted(() => {
  categorieStore.fetchCategories()
  sousCategorieStore.fetchSousCategories()
})

const handleCreateCat = async () => {
  if (!newCat.value.libelle) return
  isSubmitting.value = true
  try {
    await categorieStore.createCategorie(newCat.value)
    toast.add({ title: 'Succès', description: 'Catégorie créée', color: 'success' })
    isCatModalOpen.value = false
    newCat.value.libelle = ''
    categorieStore.fetchCategories()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleCreateSub = async () => {
  if (!newSub.value.libelle || !newSub.value.categorie_id) return
  isSubmitting.value = true
  try {
    await sousCategorieStore.createSousCategorie(newSub.value)
    toast.add({ title: 'Succès', description: 'Sous-catégorie créée', color: 'success' })
    isSubModalOpen.value = false
    newSub.value = { libelle: '', categorie_id: '' }
    categorieStore.fetchCategories()
    sousCategorieStore.fetchSousCategories()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const deleteCat = async (id: string | number) => {
  if (!confirm('Supprimer cette catégorie ? Toutes les sous-catégories seront orphelines.')) return
  try {
    await categorieStore.deleteCategorie(id)
    toast.add({ title: 'Supprimé', color: 'success' })
    categorieStore.fetchCategories()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}

const deleteSub = async (id: string | number) => {
  if (!confirm('Supprimer cette sous-catégorie ?')) return
  try {
    await sousCategorieStore.deleteSousCategorie(id)
    toast.add({ title: 'Supprimé', color: 'success' })
    categorieStore.fetchCategories()
    sousCategorieStore.fetchSousCategories()
  } catch {
    toast.add({ title: 'Erreur', color: 'error' })
  }
}
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-page-in">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Organisation</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Catégories & Rayons</h1>
      </div>
      <div class="flex gap-3">
        <UButton
          label="Nouvelle Sous-Cat"
          variant="outline"
          class="border-neutral-200 text-neutral-600 font-sans uppercase tracking-widest text-[0.65rem] px-4"
          @click="isSubModalOpen = true"
        />
        <UButton
          icon="i-lucide-folder-plus"
          label="Rayon Principal"
          class="bg-cafe-700 hover:bg-cafe-800 text-white px-6 py-3 shadow-xl uppercase tracking-widest text-[0.65rem] font-sans"
          @click="isCatModalOpen = true"
        />
      </div>
    </div>

    <!-- Grid of Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
       <UCard v-for="cat in categories" :key="cat.id" class="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-3xl group relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <UButton color="error" variant="ghost" icon="i-lucide-trash" size="xs" @click="deleteCat(cat.id)" />
          </div>
          
          <div class="p-2 space-y-4">
            <h3 class="font-serif text-xl text-cafe-800 border-b border-neutral-50 pb-2">{{ cat.libelle }}</h3>
            
            <div class="space-y-2">
               <div v-for="sub in (cat.sous_categories || [])" :key="sub.id" class="flex items-center justify-between p-2 rounded-xl bg-neutral-50/50 hover:bg-cafe-50 group/sub transition-colors">
                  <span class="text-xs text-neutral-600 font-sans">{{ sub.libelle }}</span>
                  <UButton color="neutral" variant="ghost" icon="i-lucide-x" size="2xs" class="opacity-0 group-hover/sub:opacity-100 transition-all" @click="deleteSub(sub.id)" />
               </div>
               
               <div v-if="!(cat.sous_categories?.length)" class="text-center py-4 italic text-neutral-300 text-[0.65rem]">
                 Aucune sous-catégorie
               </div>
            </div>

            <UButton 
              label="Ajouter une sous-catégorie" 
              variant="link" 
              size="xs" 
              class="p-0 text-cafe-500 font-sans uppercase tracking-widest text-[0.6rem]"
              @click="newSub.categorie_id = cat.id.toString(); isSubModalOpen = true"
            />
          </div>
       </UCard>
    </div>

    <!-- Modal Catégorie -->
    <UModal v-model="isCatModalOpen">
      <UCard :ui="{ body: 'p-8' }">
        <h3 class="font-serif text-xl mb-6 uppercase tracking-wide">Rayon Principal</h3>
        <UFormField label="Nom de la catégorie" required>
          <UInput v-model="newCat.libelle" placeholder="Ex: Soins du corps, Parfumerie..." size="md" variant="outline" />
        </UFormField>
        <div class="flex justify-end gap-3 pt-6">
          <UButton label="Annuler" variant="ghost" @click="isCatModalOpen = false" />
          <UButton label="Enregistrer" class="bg-cafe-700" :loading="isSubmitting" @click="handleCreateCat" />
        </div>
      </UCard>
    </UModal>

    <!-- Modal Sous-Catégorie -->
    <UModal v-model="isSubModalOpen">
      <UCard :ui="{ body: 'p-8' }">
        <h3 class="font-serif text-xl mb-6 uppercase tracking-wide">Sous-Catégorie</h3>
        <div class="space-y-4">
          <UFormField label="Rayon Parent" required>
            <select v-model="newSub.categorie_id" class="w-full h-10 border rounded-xl px-4 text-sm bg-white outline-none">
              <option value="">Choisir une catégorie</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.libelle }}</option>
            </select>
          </UFormField>
          <UFormField label="Nom de la sous-catégorie" required>
            <UInput v-model="newSub.libelle" placeholder="Ex: Savons artisanaux, Crèmes solaires..." size="md" variant="outline" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-3 pt-6">
          <UButton label="Annuler" variant="ghost" @click="isSubModalOpen = false" />
          <UButton label="Enregistrer" class="bg-cafe-700" :loading="isSubmitting" @click="handleCreateSub" />
        </div>
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
