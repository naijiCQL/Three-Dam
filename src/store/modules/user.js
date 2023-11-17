/*
 * @Author: 杨道博
 * @Date: 2023-05-23 17:52:59
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-14 15:45:22
 * @Description: 基础信息
 * @FilePath: \three-project\src\store\modules\user.js
 */

const state = {
  token: "F1DBECD719108635189480CF60E6553ADB3109616426BD537F25A430DFC613B491A025C4A51E77FD08C6E5B7CBE05917A461286E7B6D69F1AB1B14F946149D2065B0C675F8FEDF4B9B05C1496881BC5A", //token
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || {}, //登录用户基本信息
};

const getters = {};

const mutations = {
  setToken(state, token) {
    localStorage.setItem("token", token);
    state.token = token;
  },
  setUserInfo(state, userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    state.userInfo = userInfo;
  },
};

const actions = {
  // 退出登录
  logoutAct(context) {
    localStorage.clear();
    sessionStorage.clear();
    context.commit("setToken", "");
    context.commit("setUserInfo", {});
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
