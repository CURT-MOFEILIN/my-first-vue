import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/Index'
import Login from '@/views/Login'
import sysSet from '@/views/sysSet'
import orgTree from '@/views/orgTree'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: Login,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/index',
      name: '首页',
      component: index,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/orgTree',
      name: '机构树',
      component: orgTree,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/sysSet',
      name: '设置',
      component: sysSet,
      meta: {
        keepAlive: true
      }
    }
  ]
})
