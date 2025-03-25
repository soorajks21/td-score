// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref(null)
  const users = ref([
    {
      id: 1,
      name: 'Jenn Bouchard',
      role: 'manager',
      avatar: '/avatars/jenn.jpg',
      advisors: [1, 2, 3, 4], // IDs of advisors this manager oversees
    },
    {
      id: 2,
      name: 'Francis Proulx',
      role: 'advisor',
      avatar: '/avatars/francis.jpg',
      managerId: 1,
    },
    {
      id: 3,
      name: 'Bob Levesque',
      role: 'advisor',
      avatar: '/avatars/bob.jpg',
      managerId: 1,
    },
    {
      id: 4,
      name: 'Debbie Santelli',
      role: 'advisor',
      avatar: '/avatars/debbie.jpg',
      managerId: 1,
    },
    {
      id: 5,
      name: 'Admin User',
      role: 'admin',
      avatar: '/avatars/admin.jpg',
    },
  ])

  // Login user by ID
  function login(userId) {
    const user = users.value.find((u) => u.id === userId)
    if (user) {
      currentUser.value = user
      return true
    }
    return false
  }

  // Logout
  function logout() {
    currentUser.value = null
  }

  // Computed properties
  const isLoggedIn = computed(() => !!currentUser.value)
  const isManager = computed(() => currentUser.value?.role === 'manager')
  const isAdvisor = computed(() => currentUser.value?.role === 'advisor')
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  const managedAdvisors = computed(() => {
    if (!isManager.value) return []
    return users.value.filter((u) => currentUser.value.advisors.includes(u.id))
  })

  const allAdvisors = computed(() => {
    return users.value.filter((u) => u.role === 'advisor')
  })

  return {
    currentUser,
    users,
    isLoggedIn,
    isManager,
    isAdvisor,
    isAdmin,
    managedAdvisors,
    allAdvisors,
    login,
    logout,
  }
})
