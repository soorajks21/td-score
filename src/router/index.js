import { createRouter, createWebHistory } from 'vue-router'
import HistoryView from '../views/HistoryView.vue'
import LogActivityView from '../views/LogActivityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/log-activity',
      name: 'logActivity',
      component: LogActivityView
    }
  ]
})

export default router