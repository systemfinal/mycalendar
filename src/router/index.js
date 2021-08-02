import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Calendar from '../views/Calendar.vue'
//import About from '../views/About.vue'
import Details from '../views/Details.vue'
import SaveMemo from '../views/SaveMemo.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: Calendar
    //name: 'Home',
    //component: Home
  },
  /*{
    path: '/about',
    name: 'About',
    component: About
  },*/
  {
    path: '/details',
    name: 'Details',
    component: Details,
    props: true
  },
  {
    path: '/savememo',
    name: 'SaveMemo',
    component: SaveMemo,
    props: true
  },
  // catchall 404
  {
    path: '/:catchAll(.*)',    //ここに登録されていないすべてのpathが対象になる。
    name: 'NotFound',
    component: NotFound
  },  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
