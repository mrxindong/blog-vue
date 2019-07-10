<template>
  <div style="height:100%;">
     <el-container>
        <el-header style="padding:0;height:50px">
            <div class="fl head headleft">blog</div>
             <div class="fl head headcenter" @click="toglemeau"><i style="font-size:30px;" class="el-icon-tickets"></i></div>
            <div class="fr head headright">
              <span>
              欢迎  {{username}}</span><span id="showDate"></span>
               <span> <el-button type="success" size="small" @click="loginout">Exit</el-button></span>
              </div>
        </el-header>
        <el-container>
            <el-aside  style="width:12%" v-show="showmeau">
                <el-row class="tac">
                    <el-col :span="12" style="width:100%">
                        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#323232"
                            text-color="#fff" active-text-color="#ffd04b" style="border:0">
                            <el-submenu index="1">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>博客管理</span>
                                </template>
                                <el-menu-item-group style="text-align:left">
                                    <el-menu-item index="1-1" @click="toclik('adminbloglist')">博客列表</el-menu-item>
                                    <el-menu-item index="1-2" @click="toclik('adminblogtype')">分类列表</el-menu-item>
                                    <el-menu-item index="1-3" @click="toclik('adminblogcomment')">评论审核</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                             <el-submenu index="2">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>基础配置</span>
                                </template>
                                <el-menu-item-group style="text-align:left">
                                    <el-menu-item index="2-1" @click="toclik('adminuser')">账号修改</el-menu-item>
                                    <el-menu-item index="2-2" @click="toclik('adminbasic')">其他配置</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main style="width:88%;">
              <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
  </div>
</template>
<script>
$(function() {
  //设置时间
  setInterval(function() {
    var datenow = new Date();
    var year = datenow.getFullYear(); //年
    var month = ("0" + (datenow.getMonth() + 1)).slice(-2); //月
    var date = ("0" + datenow.getDate()).slice(-2); //日
    var h = ("0" + datenow.getHours()).slice(-2); //小时
    var m = ("0" + datenow.getMinutes()).slice(-2); //分钟
    var s = ("0" + datenow.getSeconds()).slice(-2); //秒

    var now = year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
    $("#showDate").html(now); //将值赋给div
  }, 1000); //每隔一秒运行一次
});
import {
  formatDate,
  checkServercode,
  catcherror
} from "../../assets/js/commonFun";
export default {
  data() {
    return {
      showmeau: true,
      username: "",
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  methods: {
    //切换菜单
    toclik(name) {
      this.$router.push({
        name
      });
    },
    //菜单隐藏或显示
    toglemeau() {
      if (this.showmeau) {
        this.showmeau = false;
      } else {
        this.showmeau = true;
      }
    },
    loginout() {
      //退出登录
      this.$axios.post("/admin/users/loginout").then(res => {
        if (res.data.code == 200) {
          this.$message({
            showClose: true,
            message: "已安全退出",
            type: "success"
          });
          setTimeout(() => {
            this.$router.push({
              name: "Login"
            });
          }, 1000);
        }
      });
    }
  },
  created() {
    //获取当前登录的用户名
    this.$axios
      .get("/admin/islogin")
      .then(res => {
        if (checkServercode(res, this)) {
          this.username = res.data.message.username;
        }
      })
      .catch(err => {
        catcherror(this, "获取用户登录状态出错", err);
      });
  }
};
</script>
<style scoped lang="less">
div {
  .el-container {
    height: 100%;
    .el-header,
    .el-footer {
      background-color: #b3c0d1;
      color: #333;
    }
    .el-container {
      height: 90%;
      .el-aside {
        background-color: #323232;
        color: #ffffff;
      }
    }
  }
}
.head {
  height: 100%;
  color: #fff;
  line-height: 50px;
}
.headleft {
  width: 12%;
  background: #f09b22;
  font-size: 26px;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  text-align: center;
}
.headcenter {
  font-size: 26px;
  width: 5%;
  background: #323232;
  box-sizing: border-box;
  border-right: 1px solid #999;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}
.headright {
  width: 83%;
  background: #323232;
  text-align: right;
  span {
    &:nth-child(1) {
      border-right: 1px solid #999;
      padding-right: 15px;
      margin-right: 30px;
    }
    &:nth-child(2) {
      margin-right: 50px;
    }
    &:nth-child(3) {
      padding-right: 15px;
    }
  }
}
</style>


