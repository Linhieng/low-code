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
    component: () => import(/* webpackChunkName: "work-place" */ '../views/work-place.vue')
  },
  {
    // TODO: 这一块不确定, 后续可能会改为发布后可看到的正式界面, 因为预览功能, 可以集成在“工作区”
    // 预览正在创建的页面
    path: '/preview',
    component: () => import(/* webpackChunkName: "preview" */ '../views/preview.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: No,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
