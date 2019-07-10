<template>
<div class="bigdiv" v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" >
  <div  class="main" >
      <div class="main_head">
       <div class="fl">{{blogname}}</div>
        <div class="fr">
          <searchVue></searchVue>
        </div>
      </div>
      <div class="main_content">
         <div class="main_content_left fl">
             <div class="newblog">
                 <p>{{title}}</p>
                 <p>{{description}} <router-link :to="{name:'blogdetail',params:{id:id}}">点击阅读全文>></router-link></p>
                 <p>posted by {{author}} at <router-link :to="{name:'blogcategories',query:{id:tagid}}">{{tagname}}</router-link> on {{createtime}} <span v-if="passcommentcount==0">暂无评论</span><span v-else>{{passcommentcount}}条评论</span></p>
             </div>
             <div class="newbloglist">
                  <p>最新博客</p>
                    <ul>
                        <li v-for="(blog,index) in bloglist" :key="index">
                            <span>{{blog.createtime}} » </span>
                            <router-link :to="{name:'blogdetail',params:{id:blog.id}}">{{blog.title}}</router-link><span v-if="blog.passcommentcount==0">暂无评论</span><span v-else>{{blog.passcommentcount}}条评论</span>
                        </li>
                        <li>
                              <router-link :to="{name:'blogmore'}">更多博客……</router-link>
                        </li>
                    </ul>
             </div>
         </div>
         <div class="main_content_right fr">
             <div class="blogtype">
                <p>博客分类</p>
                <ul>
                    <li  v-for="(type,index) in typelist" :key="index"><router-link :to="{name:'blogcategories',query:{id:type.id}}">{{type.name}}</router-link></li>
                    <li>
                        <router-link :to="{name:'blogcategories'}">更多分类……</router-link>
                    </li>
                </ul>
             </div>
             <div class="personmsg">
                <div class="basic">
                    <!-- <div class="personimg fl"><img :src="logo" :onerror="defaultlogo" /></div> -->
                    <div class="personname fr">{{author}}</div>
                </div>
                <div class="detail">
                    <p>{{desc}}</p>
                    <p><i class="el-icon-message"></i> {{email}}</p>
                    <p><i class="el-icon-location"></i> {{location}}</p>
                </div>
             </div>
            
         </div>
         <div class="clear"></div> 
      </div>
       <footerVue  :text="footer"></footerVue>
  </div></div>
</template>
<script>
import { formatDate } from "../assets/js/commonFun";
import SearchVue from "../components/search.vue";
export default {
  data() {
    return {
      //基本信息
      blogname: "",
      desc: "",
      email: "",
      location: "",
      author: "",
      logo: "",
      footer: "",
      //搜索
      search: "",
      title: "",
      description: "",
      tagname: "",
      tagid: "",
      passcommentcount: 0,
      createtime: "",
      id: "",
      bloglist: [],
      typelist: [],
      loading:true,
      //loadcount:0
     
    };
  },
  components: {
    searchVue: SearchVue
  },
  created() {
    
    var domain = document.domain;
    domain='www.wang123.site';
    //获取基础配置
    this.$axios.get("/basic/domaininfo?domain=" + domain).then(res => {
      this.$store.commit("addloadcount");
      //console.log("获取基础配置成功1");
      if (res.data.code == 200) {
        let data = res.data.result[0];
        this.blogname = data.blogname;
        this.desc = data.desc;
        this.email = data.email;
        this.location = data.location;
        this.author = data.author;
        this.footer = data.footer;
        //this.logo = data.logo;
      }
    });

    //获取最新的一篇博客
    this.$axios
      .get("/article/getlastblog?domain=" + domain)
      .then(res => {
        //console.log("获取最新的一篇博客2");
        this.$store.commit("addloadcount");
        if (res.data.code == 200) {
          let data = res.data.result[0];
          var title =
            data.title.length > 30
              ? data.title.substr(0, 30) + "……"
              : data.title;
          this.title = title;
          let description =
            data.description.length > 100
              ? data.description.substr(0, 100) + "……"
              : data.description;
          this.description = description;
          this.tagname = data.tagname;
          this.tagid = data.tagid;
          this.createtime = formatDate(new Date(data.createtime), "yyyy-MM-dd");
          this.passcommentcount = data.passcommentcount;
          this.id = data.id;
        } else {
          console.log(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
    //获取最新博客列表
    this.$axios
      .get("/article/getlastbloglist?domain=" + domain)
      .then(res => {
        //console.log("获取最新博客列表3");
        this.$store.commit("addloadcount");
        if (res.data.code == 200) {
          this.bloglist = [];
          for (let obj of res.data.result) {
            //描述截取，50字符
            var title =
              obj.title.length > 25
                ? obj.title.substr(0, 25) + "……"
                : obj.title;
            var createtime = formatDate(new Date(obj.createtime), "yyyy-MM-dd");
            this.bloglist.push({
              id: obj.id,
              createtime,
              title,
              passcommentcount: obj.passcommentcount
              
            });
          }
        } else {
          console.log(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });

    //获取分类列表
    this.$axios
      .get("/article/gettypelist?pagesize=10&domain=" + domain)
      .then(res => {
        //console.log("获取分类列表4");
        this.$store.commit("addloadcount");
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
  computed: {
    closesthis() {
      return this.$store.state.loadcount;
    }
  },
  watch: {
    closesthis(val) {
      //console.log("val:"+val);
      if (val == 5) {
        this.loading=false;//关闭加载中
        //this.$store.commit("closeloading"); 
        this.$store.commit("emptyloadcount"); //加载数量置空
      }
    }
  }
};
</script>
<style>
@import "../assets/less/common.css";
</style>
