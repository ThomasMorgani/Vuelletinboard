import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store'

Vue.use(VueRouter)

const checkAuth = async (to, from, next) => {
  if (from.fullPath === '/') {
    const { data: user } = await Store.dispatch('checkAuth')
    Store.dispatch('setUserdata', user || {})
  }
  if (Store.getters.isAuth) next()
  else next({ name: 'Login' })
}

const routes = [
  {
    path: '/',
    name: 'Bulletinboard',
    component: () => import(/* webpackChunkName: "bulletinboard" */ '@/components/Bulletinboard/Bulletinboard'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/components/Login/Login.vue'),
  },
  { path: '/logout', redirect: { name: 'User' } },
  {
    path: '/manage',
    name: 'Manage',
    beforeEnter: checkAuth,
    component: () => import(/* webpackChunkName: "mgmt" */ '@/components/Management/Management.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    beforeEnter: checkAuth,
    component: () => import(/* webpackChunkName: "settings" */ '@/components/Settings/Settings.vue'),
  },
  {
    path: '/user',
    name: 'User',
    beforeEnter: checkAuth,
    component: () => import(/* webpackChunkName: "login" */ '@/components/User/User.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
