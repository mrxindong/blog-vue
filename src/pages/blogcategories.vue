<template>
  <div class="bigdiv">
  <div class="blogdetail">
  <div class="blogdetail_header">
      <span>{{blogname}}<i class="el-icon-caret-right"></i></span>
      <span><router-link  :to="{name:'Index'}"  style="color:orange">首页</router-link><i class="el-icon-caret-right"></i></span>
      <span>博客分类</span>
  </div>
  <div class="cateheader">
    <div>
        <span>分类：</span>
        <div class="cate-list">
             <router-link  active-class="active" v-for="(type,index) in typelist" :key="index" :to="{name:'blogcategories',query:{id:type.id}}"
              :class="{'cate-header_on':(selectedId==type.id)}">
                 {{type.name}}
             </router-link>
        </div>
    </div>
  </div>
   <yearbloglistVue></yearbloglistVue>
  <footerVue style="color:#000;" :text="footer"></footerVue>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //基本信息
      blogname: "",
      footer: "",

      typelist: [],
      selectedId: ""
    };
  },
  created() {
    var domain = document.domain;

    //获取基础配置
    this.$axios.get("/basic/domaininfo?domain=" + domain).then(res => {
      if (res.data.code == 200) {
       let data = res.data.result[0];
          this.blogname=data.blogname;
          this.footer=data.footer;
      }
    });

    this.selectedId = this.$route.query.id;
    //获取分类列表
    this.$axios
      .get("/article/gettypelist?domain=" + domain)
      .then(res => {
        if (res.data.code == 200) {
          this.typelist = [];
          for (let obj of res.data.result) {
            //描述截取，50字符
            var name =
              obj.name.length > 10 ? obj.name.substr(0, 10) + "……" : obj.name;
            this.typelist.push({ id: obj.id, name });
          }
        } else {
          console.log(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  watch: {
    $route(to, from) {
      // data数据操作
      this.selectedId = this.$route.query.id;
    }
  }
};
</script>
<style>
@import "../assets/less/common.css";
</style>
