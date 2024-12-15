import App from './App'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from 'store'
Vue.prototype.$store = store;
Vue.config.productionTip = false

App.mpType = 'app'
// main.js

// 如此配置即可
uni.$u.config.unit = 'rpx'
const app = new Vue({
	store,
  ...App
})
// 引入请求封装，将app参数传递到配置中
require('@/static/network/request.js')(app)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif