<template>
  <div class="bg-green-400">
    <h3 class="text-lg font-medium mb-4">Add-Ons</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(addon, index) in addons" :key="index" class="mb-2 md:mb-4">
        <label class="block text-sm font-medium mb-1">{{ addon.label }}</label>
        <div class="flex">
          <input
            type="text"
            v-model="addon.value"
            :placeholder="addon.placeholder"
            class="w-full border rounded-l p-2 text-sm"
          />
          <button class="px-2 border-t border-b border-r">−</button>
          <button class="px-2 border-t border-b border-r rounded-r">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const addons = ref([
  { label: 'Issue Letter', value: '0', placeholder: '0' },
  { label: 'Post TRX Follow-Up', value: '0', placeholder: '0' },
  { label: 'Outbound Call', value: '0', placeholder: '0' },
  { label: 'Key Adjustments', value: '0', placeholder: '0' },
])
</script>
