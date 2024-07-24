import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import ErrorPage404 from '@/views/ErrorPage404.vue'

const routes = [
  { path: '/', component: MainPage },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      keepAlive: false,
      showTabBar: false
    },
    component: ErrorPage404
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router