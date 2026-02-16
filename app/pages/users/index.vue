<script setup lang="ts">
const columns = [{
  key: 'user',
  label: 'Utilisateur'
}, {
  key: 'role',
  label: 'Rôle'
}, {
  key: 'status',
  label: 'Statut'
}, {
  key: 'created_at',
  label: 'Date d\'inscription'
}, {
  key: 'actions',
  label: ''
}]

const roles = {
  admin: { label: 'Administrateur', color: 'cafe' },
  personnel: { label: 'Personnel', color: 'blue' },
  client: { label: 'Client', color: 'green' }
}

const users = ref([
  {
    id: 1,
    name: 'Marie Florencia',
    email: 'marie@florencia.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=1',
    created_at: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jean Dupont',
    email: 'jean.d@gmail.com',
    role: 'personnel',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?u=2',
    created_at: '2024-02-10'
  },
  {
    id: 3,
    name: 'Sophie Martin',
    email: 'sophie.m@outlook.com',
    role: 'client',
    status: 'inactive',
    avatar: 'https://i.pravatar.cc/150?u=3',
    created_at: '2024-02-12'
  }
])

const search = ref('')
const selectedRole = ref('all')
const isModalOpen = ref(false)

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.value.toLowerCase()) || 
                         user.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value
    return matchesSearch && matchesRole
  })
})

const items = (row) => [
  [{
    label: 'Modifier',
    icon: 'i-lucide-pencil',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Changer le statut',
    icon: 'i-lucide-refresh-cw',
    click: () => console.log('Status', row.id)
  }], [{
    label: 'Supprimer',
    icon: 'i-lucide-trash',
    color: 'red',
    click: () => console.log('Delete', row.id)
  }]
]
</script>

<template>
  <div class="p-6 lg:p-10 space-y-8 animate-fade-in">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif text-neutral-800 tracking-wide uppercase">Gestion des Utilisateurs</h1>
        <p class="text-neutral-500 font-sans mt-1">Gérez les accès et les rôles de votre plateforme Florencia.</p>
      </div>
      <UButton
        icon="i-lucide-user-plus"
        label="Nouvel Utilisateur"
        size="lg"
        class="bg-cafe-600 hover:bg-cafe-700 font-sans tracking-wide uppercase text-xs px-6"
        @click="isModalOpen = true"
      />
    </div>

    <!-- Filters & Stats -->
    <UCard class="border-neutral-100 shadow-sm" :ui="{ body: 'p-4' }">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="w-full md:w-96">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Rechercher un nom ou un email..."
            size="md"
            color="neutral"
            variant="subtle"
            class="font-sans"
          />
        </div>
        <div class="w-full md:w-48">
          <USelect
            v-model="selectedRole"
            :options="[
              { label: 'Tous les rôles', value: 'all' },
              { label: 'Administrateurs', value: 'admin' },
              { label: 'Personnel', value: 'personnel' },
              { label: 'Clients', value: 'client' }
            ]"
            size="md"
            color="neutral"
            variant="subtle"
            class="font-sans"
          />
        </div>
        <div class="ml-auto flex gap-4 text-xs font-sans uppercase tracking-widest text-neutral-400">
          <span>Total: {{ filteredUsers.length }}</span>
        </div>
      </div>
    </UCard>

    <!-- Table -->
    <UCard class="overflow-hidden border-neutral-100 shadow-xl shadow-cafe-900/5">
      <UTable :rows="filteredUsers" :columns="columns" :ui="{ 
        thead: 'bg-neutral-50/50 uppercase text-[0.65rem] tracking-[0.2em]',
        td: 'font-sans py-4'
      }">
        <template #user-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.avatar" :alt="row.name" size="sm" class="border border-neutral-100" />
            <div class="flex flex-col">
              <span class="font-medium text-neutral-800">{{ row.name }}</span>
              <span class="text-xs text-neutral-400 lowercase">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <template #role-data="{ row }">
          <UBadge 
            :color="roles[row.role].color" 
            variant="subtle" 
            size="sm"
            class="uppercase tracking-widest text-[0.6rem] px-2 py-0.5"
          >
            {{ roles[row.role].label }}
          </UBadge>
        </template>

        <template #status-data="{ row }">
          <div class="flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full" :class="row.status === 'active' ? 'bg-green-500' : 'bg-neutral-300'"></span>
            <span class="text-xs capitalize">{{ row.status === 'active' ? 'Actif' : 'Inactif' }}</span>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Mock for New User -->
    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-serif tracking-wide">Ajouter un collaborateur</h3>
            <UButton color="gray" variant="ghost" icon="i-lucide-x" class="-my-1" @click="isModalOpen = false" />
          </div>
        </template>

        <div class="p-4 space-y-4">
          <UFormField label="Nom Complet">
            <UInput placeholder="Ex: Marie Laurent" size="md" />
          </UFormField>
          <UFormField label="Email">
            <UInput type="email" placeholder="marie@example.com" size="md" />
          </UFormField>
          <UFormField label="Rôle">
            <USelect 
              :options="[
                { label: 'Administrateur', value: 'admin' },
                { label: 'Personnel', value: 'personnel' },
                { label: 'Client', value: 'client' }
              ]" 
              size="md"
            />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton label="Annuler" color="neutral" variant="ghost" @click="isModalOpen = false" />
            <UButton label="Créer le compte" class="bg-cafe-600" @click="isModalOpen = false" />
          </div>
        </template>
      </UCard>
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
