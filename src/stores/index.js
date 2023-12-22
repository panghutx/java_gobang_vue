import { defineStore } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";

// import Vue from 'vue'
import Vuex from 'vuex'

// export const store = reactive({
//   count: 0
// })

export const useAppStore = defineStore("storeId", {
  state: () => ({
    bootstrap,
  }),
});

const store = new Vuex.Store({
  state:{
    count:0,
    userInfo:null
  },
  mutations:{
    increase(state){
      state.count++
    },
    
    //获得个人信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    
  }
})
export default store



