import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/Index'
import sysSet from '@/views/sysSet'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: index
    },
    {
      path: '/index',
      name: '首页',
      component: index
    },
    {
      path: '/sysSet',
      name: '系统设置',
      component: sysSet
    }
  ]
})
