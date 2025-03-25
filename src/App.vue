<template>
  <div class="flex flex-col h-screen">
    <app-header :processing-time="processingTime" @end-activity="showEndActivityConfirmation" />

    <div class="flex flex-1 overflow-hidden">
      <app-sidebar />

      <div class="flex-1 overflow-auto relative">
        <!-- Always show the HistoryView -->
        <history-view @show-log-activity="showLogActivity" />

        <!-- Show LogActivityView as an overlay when needed -->
        <div
          v-if="showActivityForm"
          class="absolute inset-0 bg-opacity-50 flex items-center justify-center z-30"
        >
          <div class="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
            <div class="p-4 border-b flex justify-between items-center">
              <h2 class="text-lg font-medium">
                {{ formMode === 'create' ? 'Log New Activity' : 'Edit Activity' }}
              </h2>
              <button @click="hideLogActivity" class="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <log-activity-view
              :form-mode="formMode"
              :selected-activity="selectedActivity"
              @back="hideLogActivity"
            />
          </div>
        </div>
      </div>
    </div>

    <confirmation-dialog
      :visible="showConfirmDialog"
      @confirm="confirmEndActivity"
      @cancel="cancelEndActivity"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useActivitiesStore } from '@/stores/activites'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import HistoryView from './views/HistoryView.vue'
import LogActivityView from './views/LogActivityView.vue'
import ConfirmationDialog from './components/common/ConfirmationDialog.vue'

// Store
const activitiesStore = useActivitiesStore()

// State
const showActivityForm = ref(false)
const formMode = ref('create')
const selectedActivity = ref(null)
const showConfirmDialog = ref(false)
const timerInterval = ref(null)
const processingTime = ref('00:00:00')

// Methods
const showLogActivity = (activity = null) => {
  if (activity) {
    // Edit mode
    formMode.value = 'edit'
    selectedActivity.value = activity
  } else {
    // Create mode
    formMode.value = 'create'
    selectedActivity.value = null
  }
  showActivityForm.value = true
}

const hideLogActivity = () => {
  showActivityForm.value = false
  selectedActivity.value = null
}

const showEndActivityConfirmation = () => {
  if (activitiesStore.currentActivity) {
    showConfirmDialog.value = true
  }
}

const confirmEndActivity = () => {
  activitiesStore.endActivity()
  showConfirmDialog.value = false
  stopTimer()
}

const cancelEndActivity = () => {
  showConfirmDialog.value = false
}

// Timer functionality unchanged
const startTimer = () => {
  let seconds = 0
  timerInterval.value = setInterval(() => {
    seconds++
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    processingTime.value = `${hours}:${minutes}:${secs}`
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
    processingTime.value = '00:00:00'
  }
}

// Watchers and lifecycle hooks remain unchanged
watch(
  () => activitiesStore.currentActivity,
  (newVal) => {
    if (newVal) {
      if (!timerInterval.value) {
        startTimer()
      }
    } else {
      stopTimer()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (activitiesStore.currentActivity) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>
