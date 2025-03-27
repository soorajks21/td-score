<!-- ActivityTable.vue -->
<template>
  <div class="space-y-4">
    <!-- Simple Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <!-- Activity Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            v-model="filters.type"
            @change="applyFilters"
            class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Production">Production</option>
            <option value="Investment">Investment</option>
          </select>
        </div>

        <!-- Advisor Filter -->
        <div v-if="isManagerOrAdmin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Advisor</label>
          <select
            v-model="filters.advisorId"
            @change="applyFilters"
            class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Advisors</option>
            <option v-for="advisor in teamMembers" :key="advisor.user_id" :value="advisor.user_id">
              {{ advisor.fname }} {{ advisor.lname }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              @click="updateSorting('name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Activity Name
              <span v-if="sorting.field === 'name'" class="ml-1">
                {{ sorting.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="updateSorting('type')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Type
              <span v-if="sorting.field === 'type'" class="ml-1">
                {{ sorting.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="updateSorting('status')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Status
              <span v-if="sorting.field === 'status'" class="ml-1">
                {{ sorting.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              @click="updateSorting('start_time')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Start Time
              <span v-if="sorting.field === 'start_time'" class="ml-1">
                {{ sorting.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              v-if="isManagerOrAdmin"
              @click="updateSorting('advisor_name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Advisor
              <span v-if="sorting.field === 'advisor_name'" class="ml-1">
                {{ sorting.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="activity in paginatedActivities" :key="activity.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ activity.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="
                  activity.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ activity.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDateTime(activity.start_time) }}</td>
            <td v-if="isManagerOrAdmin" class="px-6 py-4 whitespace-nowrap">
              {{ activity.advisor_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editActivity(activity)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Edit
              </button>
              <button
                v-if="activity.status === 'In Progress'"
                @click="endActivity(activity)"
                class="text-green-600 hover:text-green-900 mr-3"
              >
                End
              </button>
              <button @click="deleteActivity(activity)" class="text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredActivities.length === 0">
            <td :colspan="isManagerOrAdmin ? 6 : 5" class="px-6 py-4 text-center text-gray-500">
              No activities found matching the filters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Simple Pagination -->
    <div
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          :class="[
            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="!hasMorePages"
          :class="[
            'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
            !hasMorePages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startItem }}</span>
            to
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ filteredActivities.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50',
              ]"
            >
              <span class="sr-only">Previous</span>
              <!-- Simple previous chevron -->
              &laquo;
            </button>

            <button
              v-for="page in paginationRange"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="nextPage"
              :disabled="!hasMorePages"
              :class="[
                'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                !hasMorePages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50',
              ]"
            >
              <span class="sr-only">Next</span>
              <!-- Simple next chevron -->
              &raquo;
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useActivitiesStore } from '@/stores/activites'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const activitiesStore = useActivitiesStore()
    const userStore = useAuthStore()

    // User role check
    const isManagerOrAdmin = computed(() => {
      const role = userStore.currentUser?.role
      return role === 'manager' || role === 'admin'
    })

    // Activities data
    const activities = ref([])
    const teamMembers = ref([])

    // Filter state
    const filters = ref({
      status: '',
      type: '',
      advisorId: '',
    })

    // Sorting state
    const sorting = ref({
      field: 'start_time',
      direction: 'desc',
    })

    // Pagination state
    const currentPage = ref(1)
    const pageSize = ref(10)

    // Computed properties for filtering and pagination
    const filteredActivities = computed(() => {
      let result = [...activities.value]

      // Apply filters
      if (filters.value.status) {
        result = result.filter((a) => a.status === filters.value.status)
      }

      if (filters.value.type) {
        result = result.filter((a) => a.type === filters.value.type)
      }

      if (filters.value.advisorId) {
        result = result.filter((a) => a.advisor_id === filters.value.advisorId)
      }

      // Apply sorting
      result.sort((a, b) => {
        let valA = a[sorting.value.field]
        let valB = b[sorting.value.field]

        // Handle dates correctly
        if (sorting.value.field === 'start_time' || sorting.value.field === 'end_time') {
          valA = new Date(valA || 0).getTime()
          valB = new Date(valB || 0).getTime()
        }

        if (valA < valB) return sorting.value.direction === 'asc' ? -1 : 1
        if (valA > valB) return sorting.value.direction === 'asc' ? 1 : -1
        return 0
      })

      return result
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredActivities.value.length / pageSize.value)
    })

    const paginatedActivities = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredActivities.value.slice(start, end)
    })

    const hasMorePages = computed(() => {
      return currentPage.value < totalPages.value
    })

    const startItem = computed(() => {
      return filteredActivities.value.length === 0
        ? 0
        : (currentPage.value - 1) * pageSize.value + 1
    })

    const endItem = computed(() => {
      return Math.min(currentPage.value * pageSize.value, filteredActivities.value.length)
    })

    // Simple pagination range (shows max 5 pages)
    const paginationRange = computed(() => {
      const total = totalPages.value
      const current = currentPage.value

      if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
      }

      if (current <= 3) {
        return [1, 2, 3, 4, 5]
      }

      if (current >= total - 2) {
        return [total - 4, total - 3, total - 2, total - 1, total]
      }

      return [current - 2, current - 1, current, current + 1, current + 2]
    })

    // Methods
    const loadActivities = async () => {
      activities.value = await activitiesStore.filteredActivities
    }

    const loadTeamMembers = async () => {
      if (isManagerOrAdmin.value) {
        teamMembers.value = await userStore.getTeamMembers()
      }
    }

    const applyFilters = () => {
      currentPage.value = 1 // Reset to first page when filters change
    }

    const updateSorting = (field) => {
      if (sorting.value.field === field) {
        // Toggle direction if same field
        sorting.value.direction = sorting.value.direction === 'asc' ? 'desc' : 'asc'
      } else {
        // Set new field with default descending order
        sorting.value.field = field
        sorting.value.direction = 'desc'
      }
    }

    const formatDateTime = (dateTime) => {
      if (!dateTime) return ''
      const date = new Date(dateTime)
      return date.toLocaleString()
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    const editActivity = (activity) => {
      activitiesStore.setCurrentActivity(activity)
      // Emit event or navigate to edit page
    }

    const endActivity = async (activity) => {
      if (confirm(`Are you sure you want to end the "${activity.name}" activity?`)) {
        await activitiesStore.endActivity(activity.id)
        await loadActivities()
      }
    }

    const deleteActivity = async (activity) => {
      if (
        confirm(
          `Are you sure you want to delete the "${activity.name}" activity? This cannot be undone.`,
        )
      ) {
        await activitiesStore.deleteActivity(activity.id)
        await loadActivities()
      }
    }

    // Watch for filter changes
    watch(
      filters,
      () => {
        currentPage.value = 1 // Reset to first page when filters change
      },
      { deep: true },
    )

    // Load data on mount
    onMounted(async () => {
      await loadTeamMembers()
      await loadActivities()
    })

    return {
      activities,
      teamMembers,
      filters,
      sorting,
      currentPage,
      pageSize,
      isManagerOrAdmin,
      filteredActivities,
      paginatedActivities,
      totalPages,
      hasMorePages,
      startItem,
      endItem,
      paginationRange,
      applyFilters,
      updateSorting,
      formatDateTime,
      previousPage,
      nextPage,
      goToPage,
      editActivity,
      endActivity,
      deleteActivity,
    }
  },
}
</script>
