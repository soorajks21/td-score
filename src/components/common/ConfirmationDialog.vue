<!-- src/components/common/ConfirmationDialog.vue -->
<template>
    <Teleport to="body">
      <div 
        v-if="visible" 
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        @click.self="onCancel"
      >
        <div class="bg-white rounded p-4 md:p-6 w-11/12 max-w-md relative">
          <button @click="onCancel" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="flex justify-center mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 class="text-lg md:text-xl font-medium text-center mb-3 md:mb-4">{{ title }}</h3>
          <p class="text-center text-sm mb-4 md:mb-6">
            {{ message }}
          </p>
          
          <div class="flex flex-col space-y-2">
            <button 
              @click="onConfirm" 
              class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              {{ confirmText }}
            </button>
            <button 
              @click="onCancel" 
              class="border border-red-500 text-red-500 py-2 px-4 rounded hover:bg-red-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Are you sure?'
    },
    message: {
      type: String,
      default: 'Ending this activity will stop the timer and mark the activity as done. This cannot be undone.'
    },
    confirmText: {
      type: String,
      default: 'YES, End Activity'
    }
  })
  
  const emit = defineEmits(['confirm', 'cancel'])
  
  const onConfirm = () => {
    emit('confirm')
  }
  
  const onCancel = () => {
    emit('cancel')
  }
  </script>