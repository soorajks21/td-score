<!-- src/components/common/FilterTabs.vue -->
<template>
    <div class="border-b flex overflow-x-auto">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="selectTab(tab.id)"
        class="px-3 py-2 md:px-6 cursor-pointer whitespace-nowrap"
        :class="{ 'border-b-2 border-green-700': activeTab === tab.id }"
      >
        {{ tab.label }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref } from 'vue'
  
  const props = defineProps({
    activeTab: {
      type: String,
      required: true
    }
  })
  
  const tabs = ref([
    { id: 'all', label: 'All' },
    { id: 'production', label: 'Production Activities' },
    { id: 'investment', label: 'Investment Activities' }
  ])
  
  const emit = defineEmits(['change-tab'])
  
  const selectTab = (tabId) => {
    emit('change-tab', tabId)
  }
  </script>