import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import MainPage from '@/views/MainPage.vue'

/* 
 * 增加路由页面时请注意：
    1. 路由页面中必须有 id="main-container" 的元素，否则AppHeader会无法拉出抽屉
 */

const routes : RouteRecordRaw[] = [
  { path: '/', component: MainPage },
  { 
    path: '/fthelper', 
    component: () => import('@/views/FoodAndTincPage.vue') 
  },
  { 
    path: '/cshelper', 
    component: () => import('@/views/CollectableSubmissionsPage.vue') 
  },
  { 
    path: '/fchelper', 
    component: () => import('@/views/FashionClothesPage.vue') 
  },
  { 
    path: '/gatherclock', 
    component: () => import('@/views/GatherClockPage.vue') 
  },
  { 
    path: '/workflow', 
    component: () => import('@/views/WorkflowPage.vue') 
  },
  { 
    path: '/workflow_process', 
    component: () => import('@/views/WorkflowProcessPage.vue') 
  },
  { 
    path: '/download', 
    component: () => import('@/views/DownloadPage.vue') 
  },
  { 
    path: '/macromanage', 
    component: () => import('@/views/MacroManagePage.vue') 
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: {
      keepAlive: false,
      showTabBar: false
    },
    component: () => import('@/views/ErrorPage404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router