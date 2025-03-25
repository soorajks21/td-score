<!-- src/components/common/UserSelector.vue -->
<template>
  <div class="fixed bottom-4 right-4 bg-white p-2 rounded shadow-lg z-50 border">
    <div class="text-xs font-bold mb-1">Development Tools</div>
    <div class="text-xs mb-2">Switch User:</div>
    <select v-model="selectedUserId" @change="switchUser" class="text-xs p-1 border rounded w-full">
      <option v-for="user in authStore.users" :key="user.id" :value="user.id">
        {{ user.name }} ({{ user.role }})
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const selectedUserId = ref(authStore.currentUser?.id || 1)

const switchUser = () => {
  authStore.login(selectedUserId.value)
}
</script>
