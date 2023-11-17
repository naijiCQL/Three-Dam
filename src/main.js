/*
 * @Author: 陈巧龙
 * @Date: 2023-11-10 15:48:43
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-14 14:06:04
 * @FilePath: \three-project\src\main.js
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI); //全局引入

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
