import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/components/MainView.vue'
import Problem from '../views/problem/index.vue'
import problemdetail from '../views/problem/components/problemdetail.vue'
import Match from '../views/match/index.vue'
import Blog from '../views/blog/index.vue'
import User from '../views/user/index.vue'
import BlogDetail from '@/views/blog/components/BlogDetail.vue'
import BlogBoard from '@/views/blog/components/BlogBoard.vue'
import Dongtai from '@/views/blog/components/Dongtai.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/main'
    },
    {
      path: '/main',
      name: 'home',
      component: MainView
    },
    {
      path: '/problem',
      name: 'problem',
      component: Problem
    },
    {
      path: '/problem/:id',
      name: 'problem/:id',
      component: problemdetail,
     
    },
    {
      path: '/match',
      name: 'match',
      component: Match
    },
    {
      path:'/blog',
      name:'blog',
      component:Blog,
    },

    {
      path:'/blogtopic/:t',
      name:'blogtopic',
      component:BlogBoard,
    },

    {
      path:'/blog/detail',
      name:'blogDetail',
      component:BlogDetail
    },
    {
      path:'/user',
      name:'user',
      component:User
    },
    {
      path:'/users',
      name:'users',
      component:User
    },
    {
      path:"/dongtai",
      name:'dongtai',
      component:Dongtai

    },
    {
      path:"/admin",
      name:'admin',
      component:Problem

    }
   
  ]
})

export default router
