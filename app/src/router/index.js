import { createRouter, createWebHistory } from 'vue-router'
import Base from '@/views/Base.vue'
import PieChart from '@/views/PieChart.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base
    },
    {
      path: '/PieChart',
      name: 'PieChart',
      component: PieChart
    }
  ]
})

export default router
