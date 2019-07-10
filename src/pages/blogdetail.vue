<template>
  <div class="bigdiv" v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" >
  <div class="blogdetail">
  <div class="blogdetail_header">
      <span>{{blogname}}<i class="el-icon-caret-right"></i></span>
      <span><router-link  :to="{name:'Index'}"  style="color:orange">首页</router-link><i class="el-icon-caret-right"></i></span>
      <span>{{title}}</span>
  </div>
  <div class="blogdetail_content">
      <h1>{{title}}</h1>
      <p>
          <span>作者: {{author}}</span><span>分类:  <router-link :to="{name:'blogcategories',query:{id:tagid}}">{{blogtype}}</router-link></span><span> <i class="el-icon-time"></i> {{createtime}}</span>
          <span>
               <i class="el-icon-message"></i>  {{commentcount}} 
               <i class="el-icon-view"></i> {{viewcount}}
          </span>
      </p>
      <div class="blogcontent" v-html="content">
        
      </div>
  </div>
  <div class="copyright">
        <ul>
            <li>作者:
                <a href="#">{{author}}</a>
            </li>
            <li>发表日期: {{createtime}}</li>
            <li>文章分类:
                <router-link :to="{name:'blogcategories',query:{id:tagid}}">{{blogtype}}</router-link>
            </li>
            <li>版权声明: {{author}}个人博客，引用请注明出处，盗版必究</li>
            <li>联系我:{{email}}
            </li>
        </ul>
        <!-- <a href="#">
            <img :src="logo" :onerror="defaultlogo">
        </a> -->
    </div>
   <div class="ctocomment">
        <p>给{{author}}留言</p>
            <ul>
                <li class="ctocomment_username"><span>昵称：</span> <span><input type="text" value="" placeholder="您的昵称" v-model="nickname"/> </span></li>
                <li class="comment_content">
                    <textarea  placeholder="您的留言" v-model="comment"></textarea>
                </li>
                <li><input type="button" value="提交" @click="savecomment"/>
                </li>
                <li>
                    <el-alert :title="errtitle" type="error" v-if="errshow"  show-icon></el-alert>
                </li>
            </ul>
        </div>
        <div class="ccommentlist">
            <p>留言({{commentcount}}条)</p>
            <ul v-if="commentlist.length>0">
               <div v-for="(comment,index) in commentlist" :key="index">
                    <li class="comment_title"> 
                            <span>{{comment.time}}</span>
                            <span>{{comment.name}}</span>
                    </li>
                    <li class="comment_content">
                            <div>{{comment.content}}</div>
                    </li>
                </div>
            </ul>
        </div>

  <footerVue style="color:#000;" :text="footer"></footerVue>
  </div>
  </div>
</template>
<script>
import { formatDate } from "../assets/js/commonFun";
export default {
  data() {
    return {
      //基本信息
      blogname: "",
      email: "",
      author: "",
      logo: "",
      footer: "",

      title: "",
      blogtype: "",
      createtime: "",
      content: "",
      tagid: "",
      viewcount: 0,
      commentcount: 0,
      nickname: "",
      comment: "",
      errshow: false,
      errtitle: "",
      commentlist: [],
      loading:true
    };
  },
  created() {
    var domain = document.domain;

    //获取基础配置
    this.$axios.get("/basic/domaininfo?domain=" + domain).then(res => {
      if (res.data.code == 200) {
       let data = res.data.result[0];
          this.blogname=data.blogname;
          this.email=data.email;
          this.author=data.author;
          this.footer=data.footer;
          //this.logo=data.logo;
      }
    });

    let id = this.$route.params.id;
    //更新文章查看数
    this.$axios
      .post("/article/updateblogview", "id=" + id)
      .then(res => {
        if (res.data.code != 200) {
          console.log(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });

    //获取文章详情
    this.$axios
      .get("/article/getblogdetail?id=" + id)
      .then(res => {
        if (res.data.code == 200) {
          var data = res.data.result[0];
          this.title =
            data.title.length > 30
              ? data.title.substr(0, 30) + "……"
              : data.title;
          this.content = data.content;
          // //获取到详情内容，调取一次高亮加载
          // $.getScript(
          //   "../../static/ueditor/third-party/SyntaxHighlighter/shCore.js"
          // ).done(function() {
          //   SyntaxHighlighter.highlight(); //ajax异步的时候，使用.all无效，必须使用highlight()
          // });
          this.createtime = formatDate(
            new Date(data.createtime),
            "yyyy-MM-dd HH:mm:ss"
          );
          this.blogtype = data.tagname;
          this.tagid = data.tagid;
          this.viewcount = data.viewcount;
        } else if (res.data.code == 304) {
          //文章不存在或已隐藏
          this.$router.push({
            name: "NotFound"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });

    //获取评论总数
    this.$axios
      .get("/comment/count?articleid=" + id)
      .then(res => {
        if (res.data.code == 200) {
          this.commentcount = res.data.result[0].count;
        } else {
          console.log(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });

    //获取评论列表
    this.$axios
      .get("/comment/list?articleid=" + id)
      .then(res => {
        if (res.data.code == 200) {
          this.commentlist = [];
          for (let obj of res.data.result) {
            var name = obj.name;
            var time = formatDate(new Date(obj.time), "yyyy-MM-dd HH:mm:ss");
            var content = obj.content;
            this.commentlist.push({ id: obj.id, name, time, content });
          }
        } else {
          console.log(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    //提交评论
    savecomment() {
      let id = this.$route.params.id;
      let name = this.nickname;
      if (name == "") {
        name = "匿名用户";
      } else {
        if (name.length > 15) {
          this.errtitle = "昵称最长为15个字符";
          this.errshow = true;
          return;
        }
      }
      if (this.comment == "") {
        this.errtitle = "留言为空，无法提交";
        this.errshow = true;
        return;
      }
      this.$axios
        .post(
          "/comment/add",
          "name=" + name + "&content=" + this.comment + "&articleid=" + id
        )
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "留言提交成功！",
              type: "success"
            });
            this.commentcount += 1;
            this.commentlist.unshift({
              name,
              content: this.comment,
              time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss")
            });
          } else {
            this.$message.error("留言提交失败");
            console.log(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error("留言提交失败");
          console.log(err);
        });
    }
  },
  // mounted(){
  //       setTimeout(() => {
  //     this.loading=false;
  //   }, 1000);
  // },
  watch: {
    //一旦用户输入，则撤销错误提示
    comment(newv, oldv) {
      if (
        this.comment != "" &&
        this.errtitle == "留言为空，无法提交" &&
        this.errshow
      ) {
        this.errshow = false;
      }
    },
    nickname(newv, oldv) {
      if (this.nickname != "") {
        if (this.nickname.length > 15) {
          this.errtitle = "昵称最长为15个字符";
          this.errshow = true;
        } else {
          if (this.errtitle == "昵称最长为15个字符" && this.errshow) {
            this.errshow = false;
          }
        }
      }
    },
    content(){
      //console.log("有值啦");
      this.loading=false;
    }
  }
};
</script>
<style>
@import "../assets/less/common.css";
/* @import "../../static/ueditor/third-party/SyntaxHighlighter/shCoreDefault.css"; */
</style>
