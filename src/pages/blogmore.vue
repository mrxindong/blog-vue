<template>
  <div class="bigdiv" v-loading="$store.state.loading"
 element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" >
  <div class="blogdetail">
  <div class="blogdetail_header">
      <span>{{blogname}}<i class="el-icon-caret-right"></i></span>
      <span><router-link  :to="{name:'Index'}"  style="color:orange">首页</router-link><i class="el-icon-caret-right"></i></span>
      <span>博客归档</span>
  </div>
   <yearbloglistVue isshow="loading"></yearbloglistVue>
  <footerVue style="color:#000;" :text='footer'></footerVue>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      footer: "",
      blogname: "",
    };
  },
  created() {
    var domain = document.domain;

    //获取基础配置
    this.$axios.get("/basic/domaininfo?domain=" + domain).then(res => {
      if (res.data.code == 200) {
        let data = res.data.result[0];
        this.blogname = data.blogname;
        this.footer = data.footer;
      }
    });
  }
};
</script>
<style>
@import "../assets/less/common.css";
</style>
