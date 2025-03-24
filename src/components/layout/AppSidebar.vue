<template>
  <div class="w-16 md:w-32 bg-green-800 flex flex-col h-full shrink-0">
    <div class="p-2 flex justify-center">
      <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white overflow-hidden">
        <img :src="avatarUrl" alt="User Avatar" class="w-full h-full object-cover" />
      </div>
    </div>
    <div class="text-white text-center text-xs p-2 bg-orange-500 truncate">
      {{ userName }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

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
