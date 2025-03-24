<!-- src/components/layout/AppHeader.vue -->
<template>
  <header class="bg-td-green text-white p-3 flex justify-between items-center sticky top-0 z-30">
    <div class="flex items-center">
      <div class="bg-green-100 text-green-800 font-bold p-1 px-2 mr-2">TD</div>
      <div class="text-2xl md:block hidden">
        SC<span
          class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white text-green-800"
          >O</span
        >RE
      </div>
    </div>
    <div class="flex items-center">
      <div class="text-xs mr-2 md:mr-4">
        <div>Processing Time:</div>
        <div class="text-center">{{ processingTime }}</div>
      </div>
      <button
        @click="onEndActivityClick"
        class="bg-white text-red-600 text-xs px-2 py-1 md:px-3 md:py-1 rounded mr-2 md:mr-4"
      >
        End Activity
      </button>
      <span class="mr-2">EN</span>
    </div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  processingTime: {
    type: String,
    default: '00:00:00',
  },
})

const emit = defineEmits(['end-activity'])

const onEndActivityClick = () => {
  emit('end-activity')
}
</script>
