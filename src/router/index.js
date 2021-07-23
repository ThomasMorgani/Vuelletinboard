import Vue from 'vue'
import VueRouter from 'vue-router'
import Bulletinboard from '@/components/Bulletinboard/Bulletinboard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Bulletinboard',
    component: Bulletinboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/components/Login/Login.vue'),
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import(/* webpackChunkName: "mgmt" */ '@/components/Management/Management.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/components/Settings/Settings.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
