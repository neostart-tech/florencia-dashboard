import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        user: null
    }),
    actions: {
        setUsers(users) {
            this.users = users
        },
        setUser(user) {
            this.user = user
        },
        async fetchUsers() {
            const response = await axios.get('/admins')
            this.setUsers(response.data.data || response.data)
        },
        async createUser(user) {
            const response = await axios.post('/admins', user)
            this.setUser(response.data.data || response.data)
        },
        async updateUser(user) {
            const response = await axios.put('/admins/' + user.id, user)
            this.setUser(response.data.data || response.data)
        },
        async deleteUser(id) {
            await axios.delete('/admins/' + id)
            this.setUser(null)
        }
    }
})
