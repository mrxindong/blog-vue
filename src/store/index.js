import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex);

let store=new vuex.Store({
  state:{
    loading:true,
    loadcount:0
  },
  mutations:{
    //关闭加载
    closeloading(state){
        state.loading=false;
    },
    addloadcount(state){
        state.loadcount++;
    },
    emptyloadcount(state){
        state.loadcount=0;
    },
  }
})

export default store;