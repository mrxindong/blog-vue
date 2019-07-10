<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:40px;height:40px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
        <el-breadcrumb-item>博客管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name:'adminbloglist'}">博客列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑博客</el-breadcrumb-item>
    </el-breadcrumb>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-form ref="form"  label-width="150px" style="width:60%;">
        <el-form-item label="文章标题">
            <el-input v-model="title" placeholder="限制100个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="文章概述">
            <el-input type="textarea"  placeholder="限制255个字符以内" v-model="desc" :autosize="{ minRows: 2,maxRows:5}"></el-input>
        </el-form-item>
        <el-form-item label="文章内容">
           <!--editor的div为富文本的承载容器-->
          <ueVue :defaultMsg=content :config=config ref="ue"></ueVue>
           <!-- <el-input type="textarea" v-model="content" :autosize="{ minRows: 4,maxRows:10}"></el-input> -->
        </el-form-item>
    <el-form-item label="博客分类">
      <el-select v-model="id" placeholder="请选择">
        <el-option
          v-for="btype in blogtypelist"
          :key="btype.id"
          :label="btype.name"
          :value="btype.id">
        </el-option>
      </el-select>
    </el-form-item>
      <div class="block">
   <el-form-item label="创建时间">
       <el-date-picker
      v-model="createtime"
      type="datetime"
      placeholder="选择日期时间"
      default-time="12:00:00">
    </el-date-picker>
        </el-form-item>
   
  </div>
        <el-form-item label="是否隐藏">
            <el-switch v-model="hiddenthis"></el-switch>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UEVue from '../ue.vue';

import {
  formatDate,
  checkServercode,
  catcherror
} from "../../assets/js/commonFun";
export default {
  data() {
    return {
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      title: "",
      desc: "",
      content: "",
      createtime: "",
      hiddenthis: false,
      id: "", //当前分类
      blogtypelist: [], //分类列表
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  components:{
    ueVue:UEVue,
  },
  created() {
    //获取分类列表
    var querystr = "?page=1&pagesize=10000";
    this.$axios
      .get("/admin/article/typelist" + querystr)
      .then(res => {
        if (checkServercode(res, this)) {
          //成功
          this.blogtypelist = res.data.result;
        }
      })
      .catch(err => {
        catcherror(this, "获取博客分类列表失败", err);
      });
    var id = this.$route.query.id;
    if (id) {
      //修改，加载修改前的数据
      this.$axios
        .get("/admin/article/getblogbyid?id=" + id)
        .then(res => {
          if (checkServercode(res, this)) {
            var data = res.data.result[0];
            this.title = data.title;
            this.desc = data.description;
            this.content = data.content; //获取到的内容放入富文本框
            this.hiddenthis = data.ishidden == 1 ? true : false;
            let tagid = Number(res.data.message[0].tag_id); //必须转为int类型，才可以被识别
            this.createtime = formatDate(
              new Date(data.createtime),
              "yyyy-MM-dd HH:mm:ss"
            );
            this.id = tagid;
          }
        })
        .catch(err => {
          catcherror(this, "博客详情查询失败", err);
        });
    } else {
      //添加，判断目前是否登录了
      this.$axios
        .get("/admin/islogin")
        .then(res => {
          checkServercode(res, this);
        })
        .catch(err => {
          catcherror(this, "获取用户登录状态出错", err);
        });
    }
  },
  methods: {
    //保存
    save() {
      var msg = "";
      let content = this.$refs.ue.getUEContent();
      if (this.title == "") {
        msg = "博客标题不能为空";
      } else if (this.title.length > 100) {
        msg = "博客标题长度不能超过100";
      } else if (this.desc == "") {
        msg = "博客描述不能为空";
      } else if (this.desc.length > 255) {
        msg = "博客描述长度不能超过255";
      } else if (content == "") {
        msg = "博客内容不能为空";
      } else if (this.id == "") {
        msg = "请选择博客分类";
      }
      if (msg != "") {
        this.errortitle = "数据校验失败";
        this.errordesc = msg;
        this.errshow = true;
        return false;
      }

      var url = "/admin/article/edit";
      var hthis = this.hiddenthis == true ? 1 : 0; //是否隐藏当前文章
      if (this.$route.query.id) {
        //修改
        url += "?id=" + this.$route.query.id;
      }
      var postobj = {
        title: this.title,
        desc: this.desc,
        content: content,
        hiddenthis: hthis,
        blogtype: this.id
      };
      if (this.createtime != "") {
        //有时间
        postobj.createtime = this.createtime;
      }

      this.$axios
        .post(url, postobj)
        //  this.$axios.post(url,
        //  'title='+this.title+"&desc="+this.desc+"&content="+content+"&hiddenthis="+hthis+"&blogtype="+this.id)
        .then(res => {
          if (checkServercode(res, this)) {
            //保存成功,跳转到列表页
            this.$router.push({
              name: "adminbloglist"
            });
          }
        })
        .catch(err => {
          catcherror(this, "保存博客失败", err);
        });
      //
    }
  }
};
</script>
<style>

</style>
