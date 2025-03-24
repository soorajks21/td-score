<!-- src/App.vue -->
<template>
    <div class="flex flex-col h-screen">
      <app-header 
        :processing-time="processingTime" 
        @end-activity="showEndActivityConfirmation"
      />
      
      <div class="flex flex-1 overflow-hidden">
        <app-sidebar />
        
        <div class="flex-1 overflow-auto">
          <component 
            :is="currentView" 
            :form-mode="formMode"
            :selected-activity="selectedActivity"
            @show-log-activity="showLogActivity"
            @back="showHistory"
          />
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
  import { useActivitiesStore } from './stores/activites'
  import AppHeader from './components/layout/AppHeader.vue'
  import AppSidebar from './components/layout/AppSidebar.vue'
  import HistoryView from './views/HistoryView.vue'
  import LogActivityView from './views/LogActivityView.vue'
  import ConfirmationDialog from './components/common/ConfirmationDialog.vue'
  
  // Store
  const activitiesStore = useActivitiesStore()
  
  // State
  const currentViewName = ref('history')
  const formMode = ref('create')
  const selectedActivity = ref(null)
  const showConfirmDialog = ref(false)
  const timerInterval = ref(null)
  const processingTime = ref('00:00:00')
  
  // Computed
  const currentView = computed(() => {
    return currentViewName.value === 'history' ? HistoryView : LogActivityView
  })
  
  const currentActivity = computed(() => {
    return activitiesStore.currentActivity
  })
  
  // Methods
  const showHistory = () => {
    currentViewName.value = 'history'
  }
  
  const showLogActivity = () => {
    currentViewName.value = 'logActivity'
    formMode.value = 'create'
    selectedActivity.value = null
  }
  
  const editActivity = (activity) => {
    currentViewName.value = 'logActivity'
    formMode.value = 'edit'
    selectedActivity.value = activity
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
  
  const startTimer = () => {
    let seconds = 0
    timerInterval.value = setInterval(() => {
      seconds++
      const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
      const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
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
  
  // Watchers
  watch(() => activitiesStore.currentActivity, (newVal) => {
    if (newVal) {
      if (!timerInterval.value) {
        startTimer()
      }
    } else {
      stopTimer()
    }
  }, { immediate: true })
  
  // Lifecycle hooks
  onMounted(() => {
    // Start timer if there's an active activity
    if (activitiesStore.currentActivity) {
      startTimer()
    }
  })
  
  onUnmounted(() => {
    stopTimer()
  })
  </script>