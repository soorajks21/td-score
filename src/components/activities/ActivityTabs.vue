<!-- src/components/activities/ActivityTabs.vue -->
<template>
  <div class="flex border-b-orange-50 overflow-x-auto m-6 h-3xl bg-orange-50 px-7">
    <div
      class="px-4 py-3 md:px-6 cursor-pointer flex flex-col items-center space-x-2 whitespace-nowrap"
      :class="{
        'bg-white border-t-4  border-t-green-600 border-l-orange-50 border-r-orange-50 shadow-md':
          activeTab === 'production',
      }"
      @click="changeTab('production')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 md:h-6 md:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <div class="text-xs">Production</div>
    </div>
    <div
      class="px-4 py-3 md:px-6 cursor-pointer flex flex-col items-center space-x-2 whitespace-nowrap"
      :class="{
        'bg-white border-t-4  border-t-green-600 border-l-orange-50 border-r-orange-50 shadow-md':
          activeTab === 'investment',
      }"
      @click="changeTab('investment')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 md:h-6 md:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <div class="text-xs">Investment</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'production',
  },
})

const emit = defineEmits(['change-tab'])

const changeTab = (tab) => {
  emit('change-tab', tab)
}
</script>
