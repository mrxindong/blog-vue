<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:40px;height:40px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
        <el-breadcrumb-item>博客管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name:'adminblogtype'}">分类列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑分类</el-breadcrumb-item>
    </el-breadcrumb>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-form ref="form"  label-width="150px" style="width:60%;">
        <el-form-item label="分类名称">
            <el-input v-model="name" placeholder="限制50个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="分类排序">
          <el-input-number v-model="sort" :min="1" :max="100" label="分类排序"></el-input-number>
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
      name: "",
      sort:'1',
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  created() {
    var id = this.$route.query.id;
    if (id) {
      //修改，加载修改前的数据
      this.$axios
        .get("/admin/article/getblogtypebyid?id=" + id)
        .then(res => {
          if (checkServercode(res, this)) {
            var data = res.data.result[0];
            this.name = data.name;
            this.sort=data.sorts;
          }
        })
        .catch(err => {
          catcherror(this, "博客分类详情查询失败", err);
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
      if (this.name == "") {
        msg = "分类不能为空";
      } else if (this.name.length > 50) {
        msg = "分类名长度不能超过50";
      }
      if (msg != "") {
        this.errortitle = "数据校验失败";
        this.errordesc = msg;
        this.errshow = true;
        return false;
      }

      var url = "/admin/article/typeedit";
      if (this.$route.query.id) {
        //修改
        url += "?id=" + this.$route.query.id;
      }
      this.$axios
        .post(url, "name=" + this.name+"&sort="+this.sort)
        .then(res => {
          if (checkServercode(res, this)) {
            //保存成功,跳转到列表页
            this.$router.push({
              name: "adminblogtype"
            });
          }
        })
        .catch(err => {
          catcherror(this, "保存分类失败", err);
        });
    }
  }
};
</script>
<style>

</style>
