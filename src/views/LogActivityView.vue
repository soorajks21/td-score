<!-- src/views/LogActivityView.vue -->
<template>
  <div class="h-full flex flex-col">
    <activity-form
      :form-mode="formMode"
      :initial-data="selectedActivity"
      @submit="submitActivity"
      @cancel="cancel"
      @end-activity="endActivity"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useActivitiesStore } from '../stores/activites'
import ActivityForm from '../components/activities/ActivityForm.vue'

const props = defineProps({
  formMode: {
    type: String,
    default: 'create',
  },
  selectedActivity: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['back'])
const activitiesStore = useActivitiesStore()

// const submitActivity = (activityData) => {
//   if (props.formMode === 'create') {
//     activitiesStore.addActivity(activityData)
//   } else {
//     activitiesStore.updateActivity(props.selectedActivity.id, activityData)
//   }
//   emit('back')
// }

const submitActivity = (activityData) => {
  try {
    if (props.formMode === 'create') {
      // Start the activity (will set as current if it's production)
      activitiesStore.startActivity(activityData)
    } else {
      // Update existing activity
      activitiesStore.updateActivity(props.selectedActivity.id, activityData)
    }
    emit('back')
  } catch (error) {
    alert(error.message)
  }
}

const cancel = () => {
  emit('back')
}

const endActivity = () => {
  if (props.formMode === 'edit' && props.selectedActivity) {
    activitiesStore.endActivity(props.selectedActivity.id)
  }
  emit('back')
}
</script>
