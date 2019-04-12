import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/Index'
import Login from '@/views/Login'
import sysSet from '@/views/sysSet'
import leftNav from '@/components/LeftNav'
import orgTree from '@/components/orgTree'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login
    },
    {
      path: '/leftNav',
      name: '导航',
      component: leftNav
    },
    {
      path: '/index',
      name: '首页',
      component: index
    },
    {
      path: '/orgTree',
      name: '机构树',
      component: orgTree
    },
    {
      path: '/sysSet',
      name: '设置',
      component: sysSet
    }
  ]
})
