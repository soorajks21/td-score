<!-- src/components/activities/ActivityEdit.vue -->
<template>
    <Teleport to="body">
      <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center border-b p-4">
            <h2 class="text-lg font-medium">Edit Activity</h2>
            <button @click="onClose" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1">Activity Type</label>
                <div class="border p-2 rounded bg-gray-50">{{ localActivity.type }}</div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Status</label>
                <div 
                  class="border p-2 rounded"
                  :class="localActivity.status === 'Done' ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'"
                >
                  {{ localActivity.status }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Activity Name</label>
                <div class="relative">
                  <select v-model="localActivity.name" class="appearance-none w-full border rounded p-2 pr-8">
                    <option value="">Select Activity</option>
                    <option v-for="option in activityOptions" :key="option">{{ option }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div v-if="localActivity.type === 'Production'">
                <label class="block text-sm font-medium mb-1">Amount</label>
                <div class="flex">
                  <input 
                    type="text" 
                    v-model="localActivity.amount" 
                    class="w-full border rounded-l p-2"
                  />
                  <button @click="decrementAmount" class="px-2 border-t border-b border-r">−</button>
                  <button @click="incrementAmount" class="px-2 border-t border-b border-r rounded-r">+</button>
                </div>
              </div>
              
              <div v-if="localActivity.type === 'Investment'">
                <label class="block text-sm font-medium mb-1">Start Time</label>
                <input 
                  type="text" 
                  v-model="localActivity.start" 
                  class="w-full border rounded p-2"
                  :disabled="localActivity.status === 'Done'"
                />
              </div>
              
              <div v-if="localActivity.type === 'Investment'">
                <label class="block text-sm font-medium mb-1">End Time</label>
                <input 
                  type="text" 
                  v-model="localActivity.end" 
                  class="w-full border rounded p-2"
                  :disabled="localActivity.status === 'Done'"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-1">Notes</label>
                <textarea 
                  v-model="localActivity.note" 
                  class="w-full border rounded p-2 h-20"
                  placeholder="Type here..."
                ></textarea>
              </div>
            </div>
            
            <!-- Add-Ons Section -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-md font-medium">Add-Ons</h3>
                <button 
                  @click="toggleAddOns" 
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  {{ showAddOns ? 'Hide' : 'Show' }}
                </button>
              </div>
              
              <div v-if="showAddOns" class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-3 rounded bg-gray-50">
                <div v-for="(addon, key) in addOns" :key="key" class="mb-2">
                  <label class="block text-xs font-medium mb-1">{{ key }}</label>
                  <div class="flex">
                    <input 
                      type="number" 
                      v-model="addOns[key]" 
                      class="w-full border rounded-l p-1 text-sm"
                      min="0"
                    />
                    <button @click="decrementAddOn(key)" class="px-2 border-t border-b border-r text-sm">−</button>
                    <button @click="incrementAddOn(key)" class="px-2 border-t border-b border-r rounded-r text-sm">+</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-2 mt-6">
              <button 
                v-if="localActivity.status === 'In Progress'"
                @click="onEndActivity" 
                class="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
              >
                End Activity
              </button>
              <button 
                @click="onSave" 
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button 
                @click="onClose" 
                class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    activity: {
      type: Object,
      default: () => ({})
    }
  })
  
  const emit = defineEmits(['close', 'update', 'end'])
  
  const localActivity = ref({})
  const showAddOns = ref(false)
  const addOns = ref({
    'Issue Letter': 0,
    'Post TRX Follow-Up': 0,
    'Outbound Call': 0,
    'Key Adjustments': 0
  })
  const activityOptions = ref(['Key Payment', '1 on 1', 'Client Meeting', 'Portfolio Review'])
  
  // Watch for changes to the activity prop
  watch(() => props.activity, (newVal) => {
    if (newVal) {
      localActivity.value = { ...newVal }
      
      // Parse add-ons if they exist
      if (newVal.addOn && newVal.addOn !== 'n/a') {
        try {
          // Handle simple add-on formats like "1:1 with Sam"
          const addOnParts = newVal.addOn.split(' with ')
          if (addOnParts.length > 1) {
            addOns.value['1 on 1'] = 1
          }
        } catch (e) {
          console.error('Error parsing add-ons:', e)
        }
      }
    }
  }, { immediate: true, deep: true })
  
  // Methods
  const onClose = () => {
    emit('close')
  }
  
  const onSave = () => {
    // Format add-ons
    let formattedAddOn = 'n/a'
    const activeAddOns = Object.entries(addOns.value).filter(([_, value]) => value > 0)
    
    if (activeAddOns.length > 0) {
      if (activeAddOns.length === 1 && activeAddOns[0][0] === '1 on 1') {
        formattedAddOn = '1:1 with Sam'
      } else {
        formattedAddOn = activeAddOns.map(([key, value]) => `${key}: ${value}`).join(', ')
      }
    }
    
    // Prepare updated data
    const updatedData = {
      ...localActivity.value,
      addOn: formattedAddOn
    }
    
    emit('update', localActivity.value.id, updatedData)
  }
  
  const onEndActivity = () => {
    emit('end', localActivity.value.id)
  }
  
  const toggleAddOns = () => {
    showAddOns.value = !showAddOns.value
  }
  
  const incrementAmount = () => {
    const amount = parseFloat(localActivity.value.amount) || 0
    localActivity.value.amount = (amount + 1).toString()
  }
  
  const decrementAmount = () => {
    const amount = parseFloat(localActivity.value.amount) || 0
    if (amount > 0) {
      localActivity.value.amount = (amount - 1).toString()
    }
  }
  
  const incrementAddOn = (key) => {
    addOns.value[key]++
  }
  
  const decrementAddOn = (key) => {
    if (addOns.value[key] > 0) {
      addOns.value[key]--
    }
  }
  </script>