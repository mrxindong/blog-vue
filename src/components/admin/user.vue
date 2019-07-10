<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:40px;height:40px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
        <el-breadcrumb-item>基础配置</el-breadcrumb-item>
        <el-breadcrumb-item>账号修改</el-breadcrumb-item>
    </el-breadcrumb>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-form ref="form"  label-width="150px" style="width:60%;">
        <el-form-item label="用户名">
            <el-input v-model="username" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="新密码">
            <el-input v-model="newpassword" placeholder="新密码长度至少为6位"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { checkServercode, catcherror } from "../../assets/js/commonFun";
export default {
  data() {
    return {
      username: "",
      newpassword: "",
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  created() {
    this.$axios
      .get("/admin/users/info")
      .then(res => {
        if (checkServercode(res, this)) {
          var data = res.data.result[0];
          console.log("data:" + data);
          this.username = data.username;
        }
      })
      .catch(err => {
        catcherror(this, "用户信息查询失败", err);
      });
  },
  methods: {
    //保存
    save() {
      var msg = "";
      if (this.username.trim() == "") {
        msg = "用户名不能为空";
      } else if (this.username.trim().length > 50) {
        msg = "用户名长度不能超过50";
      } else if (this.newpassword.trim() == "") {
        msg = "密码不能为空";
      }else if(this.newpassword.trim().length<6){
        msg = "新密码长度至少为6位";
      }
      if (msg !== "") {
        this.errortitle = "数据校验失败";
        this.errordesc = msg;
        this.errshow = true;
        return false;
      }

      var url = "/admin/users/resetuser";
      this.$axios
        .post(
          url,
          "username=" + this.username + "&password=" + this.newpassword
        )
        .then(res => {
          if (checkServercode(res, this)) {
            this.$message({
              showClose: true,
              message: "账号信息修改成功",
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({
                name: "Login"
              });
            }, 1000);
          }
        })
        .catch(err => {
          catcherror(this, "修改账号信息失败", err);
        });
    }
  }
};
</script>
<style>

</style>
