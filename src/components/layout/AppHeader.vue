<!-- src/components/layout/AppHeader.vue -->
<template>
  <header class="bg-green-800 text-white p-3 flex justify-between items-center sticky top-0 z-30">
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
      <!-- Timer and active activity info -->
      <div v-if="hasActiveActivity" class="text-xs md:text-sm mr-2 md:mr-4 flex items-center">
        <div class="hidden md:block mr-2">{{ currentActivity.name }}:</div>
        <div class="bg-white text-green-800 px-2 py-1 rounded font-mono">{{ processingTime }}</div>
      </div>

      <!-- End Activity button, only show if there's an active activity -->
      <button
        v-if="hasActiveActivity"
        @click="onEndActivityClick"
        class="bg-white text-red-600 text-xs px-2 py-1 md:px-3 md:py-1 rounded mr-2 md:mr-4"
      >
        {{ $t('app.endActivity') }}
      </button>

      <!-- <span class="mr-2">EN</span> -->
      <language-switcher />
    </div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useActivitiesStore } from '@/stores/activites'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'

const props = defineProps({
  processingTime: {
    type: String,
    default: '00:00:00',
  },
})

const emit = defineEmits(['end-activity'])

const activitiesStore = useActivitiesStore()

const hasActiveActivity = computed(() => {
  return !!activitiesStore.currentActivity
})

const currentActivity = computed(() => {
  return activitiesStore.currentActivity || {}
})

const onEndActivityClick = () => {
  emit('end-activity')
}
</script>
