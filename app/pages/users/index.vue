<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface UserRole { role: string }
interface User { id: string | number; nom: string; email: string; tel?: string; role?: UserRole }

const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const toast = useToast()

// Initialisation
onMounted(() => {
  userStore.fetchUsers()
})

const search = ref('')
const selectedRole = ref('all')
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// Formulaire de création
const newUser = ref({
  nom: '',
  email: '',
  password: '',
  role: 'user',
  tel: ''
})

const resetForm = () => {
  newUser.value = { nom: '', email: '', password: '', role: 'user', tel: '' }
}

const handleCreateUser = async () => {
  if (!newUser.value.nom || !newUser.value.email || !newUser.value.password) {
    toast.add({ title: 'Champs requis', description: 'Veuillez remplir le nom, l\'email et le mot de passe.', color: 'warning' })
    return
  }
  isSubmitting.value = true
  try {
    await userStore.createUser(newUser.value)
    toast.add({ title: 'Compte créé', description: `${newUser.value.nom} a été ajouté avec succès.`, color: 'success' })
    isModalOpen.value = false
    resetForm()
    userStore.fetchUsers()
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.data?.message || 'Impossible de créer le compte.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const filteredUsers = computed(() => {
  return (users.value || []).filter((user: any) => {
    const matchesSearch = user.nom?.toLowerCase().includes(search.value.toLowerCase()) ||
                         user.email?.toLowerCase().includes(search.value.toLowerCase())
    return matchesSearch
  })
})

const columns = [{
  accessorKey: 'user',
  header: 'Utilisateur'
}, {
  accessorKey: 'role',
  header: 'Rôle'
}, {
  accessorKey: 'tel',
  header: 'Téléphone'
}, {
  accessorKey: 'actions',
  header: '',
  id: 'actions'
}]

const roles: Record<string, { label: string; color: 'primary' | 'neutral' | 'success' | 'warning' | 'error' }> = {
  superadmin: { label: 'Super Admin', color: 'primary' },
  admin: { label: 'Administrateur', color: 'warning' },
  user: { label: 'Client', color: 'success' },
  client: { label: 'Client', color: 'success' },
  personnel: { label: 'Personnel', color: 'neutral' }
}

const items = (row: User) => [
  [{
    label: 'Modifier',
    icon: 'i-lucide-pencil',
    onSelect: () => console.log('Edit', row.id)
  }], [{
    label: 'Supprimer',
    icon: 'i-lucide-trash',
    color: 'error' as const,
    onSelect: async () => {
      if (!confirm(`Supprimer l'utilisateur ${row.nom} ?`)) return
      try {
        await userStore.deleteUser(row.id as string)
        toast.add({ title: 'Supprimé', description: `${row.nom} a été retiré.`, color: 'success' })
        userStore.fetchUsers()
      } catch {
        toast.add({ title: 'Erreur', color: 'error' })
      }
    }
  }]
]
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-10 space-y-6 animate-fade-in">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[0.7rem] uppercase tracking-[0.3em] text-cafe-500 font-sans mb-1">Gestion</p>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Utilisateurs</h1>
        <p class="text-sm text-neutral-500 font-sans mt-1">Gérez les accès et les rôles de votre plateforme Florencia.</p>
      </div>
      <UButton
        id="btn-nouvel-utilisateur"
        icon="i-lucide-user-plus"
        label="Nouvel Utilisateur"
        size="lg"
        class="bg-cafe-600 hover:bg-cafe-700 font-sans tracking-wide uppercase text-xs px-6 shadow-lg"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Filters -->
    <UCard class="border-none shadow-sm bg-white/80 backdrop-blur-sm" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Rechercher un nom ou un email..."
          size="lg"
          color="neutral"
          variant="outline"
          class="font-sans flex-1"
        />
        <USelect
          v-model="selectedRole"
          :options="[
            { label: 'Tous les rôles', value: 'all' },
            { label: 'Administrateurs', value: 'admin' },
            { label: 'Personnel', value: 'personnel' },
            { label: 'Clients', value: 'user' }
          ]"
          size="lg"
          color="neutral"
          variant="outline"
          class="font-sans w-full md:w-56"
        />
        <div class="text-xs font-sans uppercase tracking-widest text-neutral-400 whitespace-nowrap">
          Total : <span class="text-neutral-700 font-semibold">{{ filteredUsers.length }}</span>
        </div>
      </div>
    </UCard>

    <!-- Table -->
    <UCard class="overflow-hidden border-none shadow-[0_20px_60px_rgba(108,66,57,0.06)] bg-white rounded-3xl">
      <div class="overflow-x-auto">
      <UTable :data="filteredUsers" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.65rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #user-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="`https://ui-avatars.com/api/?name=${(row.original as any).nom}&background=EFE9E6&color=56352E`" :alt="(row.original as any).nom" size="md" class="border-2 border-cafe-50" />
            <div class="flex flex-col">
              <span class="font-medium text-neutral-800">{{ (row.original as any).nom }}</span>
              <span class="text-xs text-neutral-400 lowercase">{{ (row.original as any).email }}</span>
            </div>
          </div>
        </template>

        <template #role-cell="{ row }">
          <UBadge 
            v-if="(row.original as any).role"
            :color="roles[(row.original as any).role.role as keyof typeof roles]?.color || 'neutral'" 
            variant="subtle" 
            size="sm"
            class="uppercase tracking-widest text-[0.6rem]"
          >
            {{ roles[(row.original as any).role.role as keyof typeof roles]?.label || (row.original as any).role.role }}
          </UBadge>
          <span v-else class="text-xs text-neutral-300">—</span>
        </template>

        <template #tel-cell="{ row }">
          <span class="text-xs text-neutral-500">{{ (row.original as any).tel || 'Non renseigné' }}</span>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="items(row.original as unknown as User)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
          </UDropdownMenu>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <UIcon name="i-lucide-users" class="w-10 h-10 text-neutral-200" />
            <p class="text-sm text-neutral-400 font-sans">Aucun utilisateur trouvé</p>
          </div>
        </template>
      </UTable>
      </div>
    </UCard>

    <!-- Modal Nouvel Utilisateur -->
    <UModal v-model:open="isModalOpen" :dismissible="false" :ui="{ footer: 'justify-end' }">
      <template #header>
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-serif tracking-wide text-neutral-800">Nouvel Utilisateur</h3>
            <p class="text-[0.65rem] text-neutral-400 uppercase tracking-widest mt-0.5">Créer un compte sur la plateforme</p>
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isModalOpen = false; resetForm()" />
        </div>
      </template>

      <template #body>
        <form class="space-y-4" @submit.prevent="handleCreateUser">
          <!-- Ligne 1 : Nom + Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Nom Complet" required>
              <UInput id="input-nom" v-model="newUser.nom" placeholder="Ex: Marie Laurent" size="md" icon="i-lucide-user" variant="outline" class="w-full" />
            </UFormField>
            <UFormField label="Adresse Email" required>
              <UInput id="input-email" v-model="newUser.email" type="email" placeholder="marie@florencia.com" size="md" icon="i-lucide-mail" variant="outline" class="w-full" />
            </UFormField>
          </div>

          <!-- Ligne 2 : Téléphone + Mot de passe -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Téléphone (optionnel)">
              <UInput id="input-tel" v-model="newUser.tel" placeholder="+228 90 00 00 00" size="md" icon="i-lucide-phone" variant="outline" class="w-full" />
            </UFormField>
            <UFormField label="Mot de passe" required>
              <UInput id="input-password" v-model="newUser.password" type="password" placeholder="••••••••" size="md" icon="i-lucide-lock" variant="outline" class="w-full" />
            </UFormField>
          </div>

          <!-- Ligne 3 : Rôle -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Rôle">
              <select id="input-role" v-model="newUser.role" class="w-full h-9 rounded-md border border-neutral-200 px-3 text-sm font-sans text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-cafe-300 focus:border-cafe-400 transition">
                <option value="admin">Administrateur</option>
                <option value="personnel">Personnel</option>
                <option value="user">Client</option>
              </select>
            </UFormField>
          </div>
        </form>
      </template>

      <template #footer>
        <UButton label="Annuler" color="neutral" variant="ghost" class="font-sans uppercase tracking-widest text-xs" @click="isModalOpen = false; resetForm()" />
        <UButton id="btn-creer-compte" label="Créer le compte" class="bg-cafe-700 hover:bg-cafe-800 font-sans uppercase tracking-widest text-xs px-6" :loading="isSubmitting" @click="handleCreateUser" />
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
