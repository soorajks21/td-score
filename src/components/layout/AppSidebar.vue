<template>
  <div class="w-16 md:w-32 bg-green-800 flex flex-col h-full shrink-0">
    <div class="p-2 flex justify-center">
      <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white overflow-hidden">
        <!-- <img
          :src="authStore.currentUser?.avatar || '/api/placeholder/64/64'"
          alt="User Avatar"
          class="w-full h-full object-cover"
        /> -->

        <span class="text-sm font-medium text-green-900">{{ userInitials }}</span>
      </div>
    </div>
    <div class="text-white text-center text-xs p-2 bg-orange-500 truncate">
      <!-- {{ userName }} -->
      {{ authStore.currentUser?.name || 'User' }}
      <div class="text-white text-center text-xxs mt-1">
        {{ getRoleLabel(authStore.currentUser?.role) }}
      </div>
    </div>

    <!-- Display advisors list for managers and admins -->
    <div v-if="authStore.isManager || authStore.isAdmin" class="mt-4 overflow-y-auto flex-1">
      <!-- All advisors option -->
      <div
        @click="selectAllAdvisors"
        class="flex items-center px-2 py-2 text-white text-xs hover:bg-green-700 cursor-pointer"
        :class="{ 'bg-green-700': !activitiesStore.selectedAdvisor }"
      >
        <div
          class="w-6 h-6 rounded-full bg-white overflow-hidden mr-1 flex items-center justify-center"
        >
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-green-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg> -->
        </div>
        <span class="hidden md:block truncate">All Advisors</span>
      </div>

      <!-- List of specific advisors -->
      <div
        v-for="advisor in displayedAdvisors"
        :key="advisor.id"
        @click="selectAdvisor(advisor)"
        class="flex items-center px-2 py-2 text-white text-xs hover:bg-green-700 cursor-pointer"
        :class="{ 'bg-green-700': activitiesStore.selectedAdvisor?.id === advisor.id }"
      >
        <div class="w-6 h-6 rounded-full bg-white overflow-hidden mr-1 items-center justify-center">
          <!-- <img
            :src="advisor.avatar || '/api/placeholder/24/24'"
            alt="Advisor Avatar"
            class="w-full h-full object-cover"
          /> -->
          <span class="pi pi-user text-sm px-1.5 py-1 text-green-900"></span>
        </div>
        <span class="hidden md:block truncate">{{ advisor.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activites'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const initials = ref('')

// const [fname, lname] = authStore.currentUser?.name?.split('')
console.log('fname', authStore.currentUser)

const userInitials = computed(() => {
  if (!authStore.currentUser) return ''

  const { fname, lname } = authStore.currentUser.name

  if (fname && lname) {
    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
  } else if (fname) {
    return fname.charAt(0).toUpperCase()
  } else if (lname) {
    return lname.charAt(0).toUpperCase()
  }

  return ''
})

// Get advisors based on role
const displayedAdvisors = computed(() => {
  if (authStore.isAdmin) {
    return authStore.allAdvisors
  } else if (authStore.isManager) {
    return authStore.managedAdvisors
  }
  return []
})

// Select a specific advisor
const selectAdvisor = (advisor) => {
  activitiesStore.setSelectedAdvisor(advisor)
}

// Show all advisors
const selectAllAdvisors = () => {
  activitiesStore.clearSelectedAdvisor()
}

// Get readable role label
const getRoleLabel = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'manager':
      return 'Manager'
    case 'advisor':
      return 'Advisor'
    default:
      return ''
  }
}

defineProps({
  userName: {
    type: String,
    default: 'Francis Proulx',
  },
  avatarUrl: {
    type: String,
    default: '/api/placeholder/64/64',
  },
})
</script>
