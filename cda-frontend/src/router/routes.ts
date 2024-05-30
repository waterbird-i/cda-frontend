
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserLayout from '@/layouts/UserLayout.vue'

export const routes:Array<RouteRecordRaw> =  [
  {
    path: '/',
    name: '主页',
    component: HomeView
  },
  {
    path: '/user',
    name: '用户',
    component: UserLayout,
    children: [

    ]
  },
  {
    path: "/hide",
    name: "隐藏页面",
    component: HomeView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/123',
    name: '主页123',
    component: HomeView
  },
]