/*
 * @Author: 杨道博
 * @Date: 2023-07-13 10:23:08
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-09-18 22:46:42
 * @Description: 
 * @FilePath: \ys.skxlsyb\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //用于保存杨树堰水库或者金盆水库编码
    resCode: null,
    //预报过程数据
    ybData: [],
    //保存设计校验过程数据
    sjjhData: [],
    //溃坝过程数据
    kbData: [],
    //堰顶数据
    ydHeight: null,
    //遇见期数据
    yjq: null,
    //洪水预计达到时间
    floodTime: null,
  },
  getters: {

  },
  mutations: {
    //保存杨树堰水库或者金盆水库编码
    updateResCode(state, data) {
      state.resCode = data
    },
    //保存预报过程数据
    updateYbData(state, data) {
      state.ybData = data
    },
    //保存设计校验过程数据
    updateSjjhData(state, data) {
      state.sjjhData = data
    },
    //保存溃坝过程数据
    updateKbData(state, data) {
      state.kbData = data
    },
    //保存堰顶数据
    updateYdHeight(state, data) {
      state.ydHeight = data
    },
    //保存遇见期数据
    updateYjq(state, data) {
      state.yjq = data
    },
  
  },
  actions: {

  },
  modules: {
    user
  }
})
