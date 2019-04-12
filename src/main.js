// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import vuex from 'vuex'
import Vue from 'vue'
import router from './router'
import store from 'store'
import ElementUI from 'element-ui'
import App from './App'
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$qs = qs
Vue.use(ElementUI)
Vue.use(vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
