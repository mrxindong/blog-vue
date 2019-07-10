<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:40px;height:40px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
        <el-breadcrumb-item>基础配置</el-breadcrumb-item>
        <el-breadcrumb-item>其他配置</el-breadcrumb-item>
    </el-breadcrumb>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-form ref="form"  label-width="150px" style="width:60%;">
        <el-form-item label="域名">
            <el-input v-model="domain" placeholder="例如:www.janneyhu.top"></el-input>
        </el-form-item>
        <el-form-item label="博客名称">
            <el-input v-model="blogname" placeholder="例如：janneyhu博客"></el-input>
        </el-form-item>
        <el-form-item label="个人昵称">
            <el-input v-model="author" placeholder="例如：janneyhu"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
            <el-input v-model="email" placeholder="展示在作者个人信息处的邮箱"></el-input>
        </el-form-item>
         <el-form-item label="个人简介">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="展示在个人信息处的简介"  v-model="desc">
           </el-input>
        </el-form-item>
        <el-form-item label="所在地">
            <el-input v-model="location" placeholder="例如：北京"></el-input>
        </el-form-item>
         <el-form-item label="个人头像">
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        <el-form-item label="网站底部信息">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="版权声明信息之类"  v-model="footer">
           </el-input>
        </el-form-item>
        <el-form-item label="总浏览量">
            <el-input v-model="viewcount" placeholder="请输入正整数"></el-input>
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
      imageUrl: '',
      domain: "",
      blogname: "",
      author: "",
      email: "",
      desc: "",
      location: "",
      footer: "",
      viewcount: "",
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  created() {
    this.$axios
      .get("/admin/basic/info")
      .then(res => {
        if (res.data.code == 200) {
          var data = res.data.result[0];
          this.domain = data.domain;
          this.blogname = data.blogname;
          this.author = data.author;
          this.email = data.email;
          this.desc = data.desc;
          this.location = data.location;
          this.imageUrl = data.logo;
          this.footer = data.footer;
          this.viewcount = data.viewcount;
        }
      })
      .catch(err => {
        catcherror(this, "基本配置查询失败", err);
      });
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //保存
    save() {
      var msg = "";
      let viewcount = 0;
      if (this.viewcount !== "") {
        viewcount = this.viewcount;
      }
      var postobj = {
        domain: this.domain,
        blogname: this.blogname,
        author: this.author,
        email: this.email,
        desc: this.desc,
        location: this.location,
        logo: this.imageUrl,
        footer: this.footer,
        viewcount
      };
      var url = "/admin/basic/edit";
      this.$axios
        .post(url, postobj)
        .then(res => {
          if (checkServercode(res, this)) {
            //保存成功
            this.$message({
              showClose: true,
              message: "基本配置保存成功！",
              type: "success"
            });
          }
        })
        .catch(err => {
          catcherror(this, "保存基本信息", err);
        });
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
