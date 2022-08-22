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
    component: () => import(/* webpackChunkName: "work-place" */ '../views/work-place/index.vue'),
  },
  {
    // 发布页面
    path: '/page/:id',
    component: () => import(/* webpackChunkName: "page" */ '../views/page.vue'),
  },
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
