import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import FoodAndTincPage from '@/views/FoodAndTincPage.vue'
import GatherClockPage from '@/views/GatherClockPage.vue'
import WorkflowPage from '@/views/WorkflowPage.vue'
import ErrorPage404 from '@/views/ErrorPage404.vue'

/* 
 * 增加路由页面时请注意：
    1. 路由页面中必须有 id="main-container" 的元素，否则AppHeader会无法拉出抽屉
 */

const routes = [
  { path: '/', component: MainPage },
  { path: '/fthelper', component: FoodAndTincPage },
  { path: '/gatherclock', component: GatherClockPage },
  { path: '/workflow', component: WorkflowPage },
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