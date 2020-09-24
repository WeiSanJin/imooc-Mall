// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'  // 图片懒加载
import infiniteScroll from 'vue-infinite-scroll' // 滑动分页插件
import {currency} from './util/currency'// 金额格式化
import { userInfo } from 'os';
import { stat } from 'fs';

Vue.config.productionTip = false
// 引用插件
Vue.use(Vuex);
Vue.use(infiniteScroll)

// 全局拦截器
Vue.filter('currency',currency);

Vue.use(VueLazyLoad,{
  loading: '/static/loading-svg/loading-bars.svg'
})

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount) {
      state.cartCount = cartCount;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
