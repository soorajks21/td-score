<!-- src/components/activities/ActivityHistory.vue -->
<template>
  <div>
    <!-- Show selected advisor context if applicable -->
    <div
      v-if="activitiesStore.selectedAdvisor"
      class="bg-gray-100 p-3 mb-4 rounded flex items-center justify-between"
    >
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full bg-white overflow-hidden mr-2">
          <img
            :src="activitiesStore.selectedAdvisor.avatar || '/api/placeholder/32/32'"
            alt="Advisor Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <div class="font-medium">{{ activitiesStore.selectedAdvisor.name }}</div>
          <div class="text-xs text-gray-600">Viewing activities for this advisor</div>
        </div>
      </div>
      <button @click="clearAdvisorFilter" class="text-gray-500 hover:text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
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

    <filter-tabs :active-tab="activeFilterTab" @change-tab="changeFilterTab" />

    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-100 text-left text-xs">
            <th v-for="column in visibleColumns" :key="column.id" class="p-2">
              {{ column.label }}
            </th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in filteredData"
            :key="index"
            class="border-b hover:bg-gray-50 cursor-pointer"
            @click="editActivity(item)"
          >
            <td v-for="column in visibleColumns" :key="`${index}-${column.id}`" class="p-2">
              <template v-if="column.id === 'status'">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                  :class="
                    item.status === 'Done'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  "
                >
                  {{ item.status }}
                </span>
              </template>
              <template v-else>
                {{ item[column.id] || '-' }}
              </template>
            </td>
            <td class="p-2 flex space-x-1">
              <button
                @click.stop="editActivity(item)"
                class="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                v-if="item.status === 'In Progress'"
                @click.stop="endActivityRequest(item.id)"
                class="p-1 text-green-600 hover:bg-green-100 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                @click.stop="deleteActivityRequest(item.id)"
                class="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Activity Edit Modal -->
    <activity-edit
      :visible="showEditModal"
      :activity="selectedActivity"
      @close="closeEditModal"
      @update="updateActivity"
      @end="endActivityRequest"
    />

    <!-- Confirmation Dialog for Delete -->
    <confirmation-dialog
      :visible="showDeleteDialog"
      title="Delete Activity"
      message="Are you sure you want to delete this activity? This action cannot be undone."
      confirm-text="YES, Delete Activity"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Confirmation Dialog for End Activity -->
    <confirmation-dialog
      :visible="showEndDialog"
      title="End Activity"
      message="Are you sure you want to end this activity? This will mark it as complete."
      confirm-text="YES, End Activity"
      @confirm="confirmEndActivity"
      @cancel="cancelEndActivity"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useActivitiesStore } from '@/stores/activites'
import FilterTabs from '../common/FilterTabs.vue'
import ConfirmationDialog from '../common/ConfirmationDialog.vue'
import ActivityEdit from './ActivityEdit.vue'
// import { useAuthStore } from '@/stores/auth'

const activitiesStore = useActivitiesStore()
// const authStore = useAuthStore()

// State
const activeFilterTab = ref('all')
const showEditModal = ref(false)
const selectedActivity = ref(null)
const showDeleteDialog = ref(false)
const activityToDelete = ref(null)
const showEndDialog = ref(false)
const activityToEnd = ref(null)
const windowWidth = ref(window.innerWidth)

// Responsive columns
const allColumns = [
  { id: 'type', label: 'Activity Type' },
  { id: 'status', label: 'Status' },
  { id: 'advisor', label: 'Advisor' },
  { id: 'name', label: 'Activity Name' },
  { id: 'amount', label: 'Amount' },
  { id: 'start', label: 'Start' },
  { id: 'end', label: 'End' },
  { id: 'duration', label: 'Duration' },
  { id: 'addOn', label: 'Add-On' },
  { id: 'note', label: 'Note' },
]

const clearAdvisorFilter = () => {
  activitiesStore.clearSelectedAdvisor()
}

const visibleColumns = computed(() => {
  if (windowWidth.value < 640) {
    return allColumns.filter((col) => ['type', 'status', 'name'].includes(col.id))
  } else if (windowWidth.value < 1024) {
    return allColumns.filter((col) =>
      ['type', 'status', 'name', 'amount', 'start', 'end'].includes(col.id),
    )
  }
  return allColumns
})

// Computed properties
const filteredData = computed(() => {
  if (activeFilterTab.value === 'all') {
    return activitiesStore.visibleActivities
  }

  return activitiesStore.visibleActivities.filter(
    (item) => item.type.toLowerCase() === activeFilterTab.value,
  )
})

// Methods
const changeFilterTab = (tab) => {
  activeFilterTab.value = tab
}

const editActivity = (activity) => {
  selectedActivity.value = { ...activity }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedActivity.value = null
}

const updateActivity = (id, data) => {
  activitiesStore.updateActivity(id, data)
  closeEditModal()
}

const deleteActivityRequest = (id) => {
  activityToDelete.value = id
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  if (activityToDelete.value) {
    activitiesStore.deleteActivity(activityToDelete.value)
    activityToDelete.value = null
    showDeleteDialog.value = false
  }
}

const cancelDelete = () => {
  activityToDelete.value = null
  showDeleteDialog.value = false
}

const endActivityRequest = (id) => {
  activityToEnd.value = id
  showEndDialog.value = true
  closeEditModal()
}

const confirmEndActivity = () => {
  console.log('acit', activityToEnd)
  if (activityToEnd.value) {
    activitiesStore.endActivity(activityToEnd.value)
    activityToEnd.value = null
    showEndDialog.value = false
  }
}

const cancelEndActivity = () => {
  activityToEnd.value = null
  showEndDialog.value = false
}

// const endActivity = (id) => {
//   activitiesStore.endActivity(id)
//   closeEditModal()
// }

// Handle resize for responsive columns
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

watch(
  () => activitiesStore.activities,
  () => {
    // If the currently selected activity was updated, refresh it
    if (selectedActivity.value) {
      const refreshedActivity = activitiesStore.getActivityById(selectedActivity.value.id)
      if (refreshedActivity) {
        selectedActivity.value = { ...refreshedActivity }
      }
    }
  },
  { deep: true },
)
</script>
