// src/stores/activities.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useActivitiesStore = defineStore('activities', () => {
  const authStore = useAuthStore()
  // State
  // const activities = ref([
  //   {
  //     id: 1,
  //     type: 'Production',
  //     status: 'Done',
  //     advisor: 'Francis Proulx',
  //     name: 'Key Payment',
  //     amount: '12',
  //     start: '11/22/2024 9:15 AM',
  //     end: '',
  //     duration: '',
  //     addOn: 'n/a',
  //     note: '',
  //   },
  //   {
  //     id: 2,
  //     type: 'Investment',
  //     status: 'Done',
  //     advisor: 'Francis Proulx',
  //     name: '1 on 1',
  //     amount: '1',
  //     start: '11/22/2024 10:00 AM',
  //     end: '11/22/2024 10:30 AM',
  //     duration: '00:30:00',
  //     addOn: '1:1 with Sam',
  //     note: '',
  //   },
  // ])

  const activities = ref([
    // Sample activities as in your images
    {
      id: 1,
      type: 'Production',
      status: 'In Progress',
      advisor: 'Francis Proulx',
      advisorId: 2,
      name: 'Key Payment',
      amount: '12',
      start: '11/22/2024 9:15 AM',
      end: '',
      duration: '',
      addOn: 'n/a',
      note: '',
    },
    {
      id: 2,
      type: 'Investment',
      status: 'Done',
      advisor: 'Francis Proulx',
      advisorId: 2,
      name: '1 on 1',
      amount: '1',
      start: '11/22/2024 10:00 AM',
      end: '11/22/2024 10:30 AM',
      duration: '00:30:00',
      addOn: '1:1 with Sam',
      note: '',
    },
    {
      id: 3,
      type: 'Investment',
      status: 'Done',
      advisor: 'Debbie Santelli',
      advisorId: 4,
      name: 'Coaching side-by-side',
      amount: '1',
      start: '11/22/2024 02:00 PM',
      end: '11/22/2024 02:30 PM',
      duration: '00:30:00',
      addOn: '',
      note: 'Coaching with Jenn',
    },
    {
      id: 4,
      type: 'Investment',
      status: 'Done',
      advisor: 'Bob Levesque',
      advisorId: 3,
      name: 'Meeting',
      amount: '1',
      start: '11/21/2024 10:00 AM',
      end: '11/21/2024 11:00 AM',
      duration: '01:00:00',
      addOn: '',
      note: 'Team meeting',
    },
  ])

  const currentActivity = ref(null)
  const selectedAdvisor = ref(null)

  // Getters
  const getActivityById = computed(() => {
    return (id) => activities.value.find((activity) => activity.id === id)
  })

  const activeActivities = computed(() => {
    return activities.value.filter((activity) => activity.status === 'In Progress')
  })

  const completedActivities = computed(() => {
    return activities.value.filter((activity) => activity.status === 'Done')
  })

  const hasActiveProductionActivity = computed(() => {
    return (
      !!currentActivity.value &&
      currentActivity.value.type === 'Production' &&
      currentActivity.value.status === 'In Progress'
    )
  })

  const visibleActivities = computed(() => {
    let filteredActivities = []
    console.log('activites', activities.value)
    if (authStore.isAdmin) {
      // Admins see all activities
      filteredActivities = activities.value
    } else if (authStore.isManager) {
      // Managers see activities from their advisors
      const advisorIds = authStore.managedAdvisors.map((a) => a.id)
      console.log('adv', advisorIds)
      filteredActivities = activities.value.filter((activity) =>
        advisorIds.includes(activity.advisorId),
      )
      console.log('fileter isManager', filteredActivities)
    } else if (authStore.isAdvisor) {
      // Advisors see only their own activities
      console.log('authStore.currentUser.id', authStore.currentUser)
      filteredActivities = activities.value.filter(
        (activity) => activity.advisorId === authStore.currentUser.id,
      )
      console.log('current user advisor', filteredActivities)
    }

    // Apply additional advisor filter if selected by a manager
    if (authStore.isManager && selectedAdvisor.value) {
      console.log('NO for advisor')
      filteredActivities = filteredActivities.filter(
        (activity) => activity.advisorId === selectedAdvisor.value.id,
      )
    }

    return filteredActivities
  })

  // Permission checks
  const canEditActivity = computed(() => {
    return (activity) => {
      if (authStore.isAdmin) {
        return true // Admins can edit all activities
      } else if (authStore.isManager) {
        // Managers can edit activities of their advisors
        const advisorIds = authStore.managedAdvisors.map((a) => a.id)
        return advisorIds.includes(activity.advisorId)
      } else if (authStore.isAdvisor) {
        // Advisors can only edit their own activities
        return activity.advisorId === authStore.currentUser.id
      }
      return false
    }
  })

  // Actions
  function setSelectedAdvisor(advisor) {
    console.log('set adv', advisor)
    selectedAdvisor.value = advisor
  }

  function clearSelectedAdvisor() {
    selectedAdvisor.value = null
  }

  function addActivity(activityData) {
    console.log('user in add activity', authStore.currentUser)
    const newActivity = {
      id: Date.now(),
      status: 'In Progress',
      advisor: authStore.currentUser.name,
      advisorId: authStore.currentUser.id,
      ...activityData,
      start: new Date().toLocaleString(),
    }
    activities.value.push(newActivity)
    return newActivity
  }

  function updateActivity(id, data) {
    console.log('updateACtivity', activityData)
    const activity = getActivityById.value(id)
    if (!activity || !canEditActivity.value(activity)) {
      return null // Permission denied
    }
    const index = activities.value.findIndex((a) => a.id === id)

    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...data }
      return { ...activities.value[index] }
    }
    return null
  }

  function setCurrentActivity(activity) {
    currentActivity.value = activity
  }

  function deleteActivity(id) {
    const activity = getActivityById.value(id)
    if (!activity || !canEditActivity.value(activity)) {
      return false // Permission denied
    }

    const index = activities.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      activities.value.splice(index, 1)
      if (currentActivity.value && currentActivity.value.id === id) {
        currentActivity.value = null
      }
      return true
    }
    return false
  }

  function startActivity(activityData) {
    // If it's a production activity, check if one is already running
    if (activityData.type === 'Production' && hasActiveProductionActivity.value) {
      throw new Error('Only one production activity can be active at a time')
    }
    console.log('startactivity', activityData)
    const newActivity = {
      id: Date.now(),
      status: 'In Progress',
      // advisor: activityData.advisor || 'Current User',
      // advisorId: activityData.user.id || 1,
      advisor: authStore.currentUser.name,
      advisorId: authStore.currentUser.id,
      ...activityData,
      start: new Date().toLocaleString(),
    }

    activities.value.push(newActivity)

    // Set as current activity if it's a production activity
    if (newActivity.type === 'Production') {
      currentActivity.value = newActivity
    }

    return newActivity
  }

  function endActivity(id = null) {
    const activityId = id || (currentActivity.value && currentActivity.value.id)
    if (!activityId) return null

    const index = activities.value.findIndex((activity) => activity.id === activityId)
    if (index === -1) return null

    const now = new Date()
    const endTimeStr = now.toLocaleString()

    // Calculate duration
    const startTime = new Date(activities.value[index].start)
    const durationMs = now - startTime
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0')
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0')
    const durationStr = `${hours}:${minutes}:${seconds}`

    // Update activity
    activities.value[index] = {
      ...activities.value[index],
      status: 'Done',
      end: endTimeStr,
      duration: durationStr,
    }

    // Clear current activity if it was the active one
    if (currentActivity.value && currentActivity.value.id === activityId) {
      currentActivity.value = null
    }

    return activities.value[index]
  }

  return {
    // State
    activities,
    currentActivity,
    selectedAdvisor,

    // Getters
    visibleActivities,
    canEditActivity,
    getActivityById,
    activeActivities,
    completedActivities,
    hasActiveProductionActivity,

    // Actions
    setSelectedAdvisor,
    clearSelectedAdvisor,
    startActivity,
    addActivity,
    updateActivity,
    endActivity,
    setCurrentActivity,
    deleteActivity,
  }
})
