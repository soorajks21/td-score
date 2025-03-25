// src/stores/activities.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const activities = ref([
    {
      id: 1,
      type: 'Production',
      status: 'Done',
      advisor: 'Francis Proulx',
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
      name: '1 on 1',
      amount: '1',
      start: '11/22/2024 10:00 AM',
      end: '11/22/2024 10:30 AM',
      duration: '00:30:00',
      addOn: '1:1 with Sam',
      note: '',
    },
  ])

  const currentActivity = ref(null)

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

  // Actions
  function addActivity(activityData) {
    const newActivity = {
      id: Date.now(),
      status: 'In Progress',
      advisor: 'Francis Proulx',
      ...activityData,
      start: new Date().toLocaleString(),
    }
    activities.value.push(newActivity)
    return newActivity
  }

  function updateActivity(id, data) {
    const index = activities.value.findIndex((activity) => activity.id === id)
    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...data }
      return { ...activities.value[index] }
    }
    return null
  }

  // function endActivity(id = null) {
  //   const activityId = id || (currentActivity.value && currentActivity.value.id)
  //   if (activityId) {
  //     const index = activities.value.findIndex((activity) => activity.id === activityId)
  //     if (index !== -1) {
  //       activities.value[index].status = 'Done'
  //       activities.value[index].end = new Date().toLocaleString()

  //       // Calculate duration
  //       if (activities.value[index].start) {
  //         const startTime = new Date(activities.value[index].start)
  //         const endTime = new Date(activities.value[index].end)
  //         const durationMs = endTime - startTime
  //         const hours = Math.floor(durationMs / (1000 * 60 * 60))
  //           .toString()
  //           .padStart(2, '0')
  //         const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  //           .toString()
  //           .padStart(2, '0')
  //         const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)
  //           .toString()
  //           .padStart(2, '0')
  //         activities.value[index].duration = `${hours}:${minutes}:${seconds}`
  //       }

  //       if (currentActivity.value && currentActivity.value.id === activityId) {
  //         currentActivity.value = null
  //       }
  //     }
  //   }
  // }

  function setCurrentActivity(activity) {
    currentActivity.value = activity
  }

  function deleteActivity(id) {
    const index = activities.value.findIndex((activity) => activity.id === id)
    if (index !== -1) {
      activities.value.splice(index, 1)
      if (currentActivity.value && currentActivity.value.id === id) {
        currentActivity.value = null
      }
    }
  }

  function startActivity(activityData) {
    // If it's a production activity, check if one is already running
    if (activityData.type === 'Production' && hasActiveProductionActivity.value) {
      throw new Error('Only one production activity can be active at a time')
    }

    const newActivity = {
      id: Date.now(),
      status: 'In Progress',
      advisor: activityData.advisor || 'Current User',
      advisorId: activityData.advisorId || 1,
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

    // Getters
    getActivityById,
    activeActivities,
    completedActivities,
    hasActiveProductionActivity,

    // Actions
    startActivity,
    addActivity,
    updateActivity,
    endActivity,
    setCurrentActivity,
    deleteActivity,
  }
})
