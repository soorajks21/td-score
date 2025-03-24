<!-- src/views/HistoryView.vue -->
<template>
  <div class="flex flex-col gap-y-4 m-6">
    <div class="">
      <button
        @click="showLogActivityForm"
        class="bg-green-600 text-white px-3 py-1 rounded flex items-center"
      >
        <span class="mr-1"></span> Log an Activity
      </button>
    </div>
    <div class="flex flex-col bg-lime-50 shadow-md">
      <div class="p-4">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 class="text-xl mb-2 sm:mb-0">History</h2>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <select v-model="selectedMonth" class="appearance-none border rounded py-1 pl-3 pr-8">
                <option value="Last month">Last month</option>
                <option value="Current month">Current month</option>
                <option value="Last 3 months">Last 3 months</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <activity-history />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ActivityHistory from '../components/activities/ActivityHistory.vue'

const selectedMonth = ref('Last month')

const emit = defineEmits(['show-log-activity'])

const showLogActivityForm = () => {
  emit('show-log-activity')
}
</script>
