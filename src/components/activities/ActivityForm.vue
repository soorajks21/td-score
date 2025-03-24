<!-- src/components/activities/ActivityForm.vue -->
<template>
  <div>
    <activity-tabs :active-tab="activityType" @change-tab="changeActivityType" />

    <div class="p-4 md:p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-amber-300">
        <div class="grid grid-cols-2 gap-4 bg-amber-700 md:grid-rows-2">
          <div class="grid grid-cols-1 bg-blue-500 md:col-span-1">
            <div>
              <label class="block text-sm font-medium mb-1">Activity Name</label>
              <div class="relative w-xs">
                <select
                  v-model="formData.activityName"
                  class="appearance-none w-full border rounded p-2"
                >
                  <option value="">Select Activity</option>
                  <option v-for="option in activityOptions" :key="option">{{ option }}</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none h-1/2"
                >
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
            <template v-if="activityType === 'production'">
              <div>
                <label class="block text-sm font-medium mb-1">Amount</label>
                <div class="flex w-xs">
                  <input
                    type="text"
                    v-model="formData.amount"
                    class="w-full border rounded-l p-2"
                  />
                  <button @click="decrementAmount" class="px-2 border-t border-b border-r">
                    −
                  </button>
                  <button
                    @click="incrementAmount"
                    class="px-2 border-t border-b border-r rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
            </template>
          </div>
          <div class="md:col-span-full">
            <activity-add-ons :visible="showAddOns" />
          </div>
        </div>
        <template v-if="activityType === 'investment'">
          <div>
            <label class="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="text"
              v-model="formData.startTime"
              class="w-full border rounded p-2"
              placeholder="00:00:00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">End Time</label>
            <input
              type="text"
              v-model="formData.endTime"
              class="w-full border rounded p-2"
              placeholder="00:00:00"
            />
          </div>
        </template>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea
            v-model="formData.notes"
            class="w-sm border rounded p-2 h-20"
            placeholder="Type here..."
          ></textarea>
        </div>
      </div>

      <!-- <activity-add-ons :visible="showAddOns" /> -->

      <div
        class="flex flex-col sm:flex-row sm:justify-end mt-6 space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <button
          v-if="activityType === 'production'"
          @click="toggleAddOns"
          class="text-white bg-green-600 px-4 py-2 rounded order-2 sm:order-1"
        >
          {{ showAddOns ? 'Hide Add-Ons' : 'Show Add-Ons' }}
        </button>
        <button
          @click="submitForm"
          class="text-white bg-green-600 px-4 py-2 rounded order-1 sm:order-2"
        >
          {{ formMode === 'edit' ? 'Update' : 'Add Activity' }}
        </button>
        <button
          v-if="formMode === 'edit'"
          @click="endActivity"
          class="text-white bg-yellow-500 px-4 py-2 rounded order-3 sm:order-3"
        >
          End Activity
        </button>
        <button @click="cancel" class="text-white bg-red-600 px-4 py-2 rounded order-4 sm:order-4">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import ActivityTabs from './ActivityTabs.vue'
import ActivityAddOns from './ActivityAddOns.vue'

const props = defineProps({
  formMode: {
    type: String,
    default: 'create', // 'create' or 'edit'
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit', 'cancel', 'end-activity'])

// State
const activityType = ref('production')
const showAddOns = ref(false)
const formData = ref({
  activityName: '',
  amount: '',
  startTime: '',
  endTime: '',
  notes: '',
})
const activityOptions = ref(['Key Payment', '1 on 1', 'Client Meeting', 'Portfolio Review'])

// Methods
const changeActivityType = (type) => {
  activityType.value = type
  resetForm()
}

const toggleAddOns = () => {
  showAddOns.value = !showAddOns.value
}

const resetForm = () => {
  formData.value = {
    activityName: '',
    amount: '',
    startTime: '',
    endTime: '',
    notes: '',
  }
}

const submitForm = () => {
  // Validate form
  if (!formData.value.activityName) {
    alert('Please select an activity name')
    return
  }

  if (activityType.value === 'production' && !formData.value.amount) {
    alert('Please enter an amount')
    return
  }

  emit('submit', {
    type: activityType.value.charAt(0).toUpperCase() + activityType.value.slice(1),
    name: formData.value.activityName,
    amount: formData.value.amount,
    start: formData.value.startTime,
    end: formData.value.endTime,
    note: formData.value.notes,
  })
}

const cancel = () => {
  emit('cancel')
}

const endActivity = () => {
  emit('end-activity')
}

const incrementAmount = () => {
  const amount = parseFloat(formData.value.amount) || 0
  formData.value.amount = (amount + 1).toString()
}

const decrementAmount = () => {
  const amount = parseFloat(formData.value.amount) || 0
  if (amount > 0) {
    formData.value.amount = (amount - 1).toString()
  }
}
</script>
