<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:40px;height:40px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
        <el-breadcrumb-item>博客管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name:'adminblogcomment'}">评论列表</el-breadcrumb-item>
        <el-breadcrumb-item>评论详情</el-breadcrumb-item>
    </el-breadcrumb>
     <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-form ref="form"  label-width="150px" style="width:60%;">
        <el-form-item label="昵称：">
            {{name}}
        </el-form-item>
        <el-form-item label="评论内容：">
        {{content}}
        </el-form-item>
        <el-form-item label="审核状态：">
            {{pass}}
        </el-form-item>
        <el-form-item label="评论来源：">
            {{blogname}}
        </el-form-item>
      <div class="block">
        <el-form-item label="评论时间：">
            <el-date-picker
            v-model="time"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
   
  </div>
        <el-form-item>
            <el-button type="primary" @click="save">保存评论时间</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  formatDate,
  checkServercode,
  catcherror
} from "../../assets/js/commonFun";
export default {
  data() {
    return {
      name: "",
      content: "",
      pass: "",
      blogname: "",
      time: "",
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  created() {
    //获取评论详情
    var id = this.$route.query.id;
    this.$axios
      .get("/admin/comment/detail?id=" + id)
      .then(res => {
        if (checkServercode(res, this)) {
          //获取成功
          var data = res.data.result[0];
          this.name = data.name;
          this.content = data.content;
          this.pass = data.pass == "1" ? "已审核" : "未审核";
          this.blogname = data.title;
          this.time = formatDate(new Date(data.time), "yyyy-MM-dd HH:mm:ss");
        }
      })
      .catch(err => {
        catcherror(this, "获取评论详情失败", err);
      });
  },
  methods: {
    //保存
    save() {
      if (this.time == "") {
        return;
      }
      var id = this.$route.query.id;
      this.$axios
        .post("/admin/comment/updatetime", "time=" + this.time + "&id=" + id)
        .then(res => {
          if (checkServercode(res, this)) {
            //保存成功,跳转到列表页
            this.$router.push({
              name: "adminblogcomment"
            });
          }
        })
        .catch(err => {
          catcherror(this, "评论时间修改失败", err);
        });
      //
    }
  }
};
</script>
<style>

</style>
