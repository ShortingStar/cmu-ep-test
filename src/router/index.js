import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routerOptions = [
  {
    path: '/',
    name: 'Home',
    component: 'Home'
  }
]
const routes = routerOptions.map(route => {
  return {
    path: route.path,
    name: route.name,
    component: () => import(`../views/${route.component}.vue`),
    meta: route.meta
  }
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    ...routes,
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router
