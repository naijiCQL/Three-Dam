/*
 * @Author: 杨道博
 * @Date: 2023-07-13 10:23:08
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-30 16:08:15
 * @Description: 
 * @FilePath: \three-project\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from "./modules/user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    resCode: null,//用于保存杨树堰水库或者金盆水库编码
    totalCount: null,//用于保存渗压管的数量
    textLabelArray: {}, //用于保存显示的文字对象
    shortEntityArray: {},//用于保存显示内部实体对象
    textMeshArray: [],//用于保存各文字标签的mesh
  },
  getters: {

  },
  mutations: {
    //保存杨树堰水库或者金盆水库编码
    updateResCode(state, data) {
      state.resCode = data
    },
    //用于保存渗压管的数量
    updataTotalCount(state, data) {
      state.totalCount = data
    },
    //用于保存显示的文字对象
    updateTextLabelArray(state, data) {
      state.textLabelArray = data
    },
    //用于保存显示内部实体对象
    updateShortEntityArray(state, data) {
      state.shortEntityArray = data
    },
  },
  actions: {

  },
  modules: {
    user
  }
})
