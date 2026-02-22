import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'
import AnalyzeView from '../AnalyzeView.vue'
import InitView from '@/InitView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,     
  },
  {
    path: '/view',
    name: 'view',
    component: AnalyzeView,
  },
  {
    path: '/init',
    name: 'init',
    component: InitView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
