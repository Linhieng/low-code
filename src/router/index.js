import { createRouter, createWebHistory } from 'vue-router'
import No from '../views/404.vue'

const routes = [
  {
    path: '/',
    redirect: '/work-place',
  },
  {
    // 工作区, 用于创建页面
    path: '/work-place',
    component: () => import(/* webpackChunkName: "work-place" */ '../views/work-place.vue'),
  },
  {
    // 发布页面
    path: '/page/:id',
    component: () => import(/* webpackChunkName: "page" */ '../views/page.vue'),
  },
  /* ========= tmp start ========== */
  {
    path: '/test-upload',
    component: () => import(/* webpackChunkName: "test-upload" */ '../tmp/test-upload.vue'),
  },
  {
    path: '/test-pinia',
    component: () => import(/* webpackChunkName: "test-pinia" */ '../tmp/test-pinia.vue'),
  },
  /* ========= tmp end========== */
  {
    path: '/:pathMatch(.*)*',
    component: No,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
