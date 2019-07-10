<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:30px;height:30px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
      <el-breadcrumb-item>博客管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论审核</el-breadcrumb-item>
   </el-breadcrumb>
       <el-form :inline="true"  class="demo-form-inline" style="position:relative">
        <el-form-item label="状态">
        <el-select v-model="state" clearable  size="small" placeholder="请选择">
          <el-option
            v-for="pass in passstate"
            :key="pass.id"
            :label="pass.name"
            :value="pass.id">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search"  size="small" >查询</el-button>
        </el-form-item>
    </el-form>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-table :data="commentlist" border style="width: 100%" v-loading="loading">
        <el-table-column prop="time" label="日期时间" width="180">
        </el-table-column>
        <el-table-column prop="name" label="昵称" width="180">
        </el-table-column>
        <el-table-column prop="content" label="内容">
        </el-table-column>
         <el-table-column prop="title" label="博客标题" width="200">
        </el-table-column>
         <el-table-column prop="pass" label="状态" width="100">
        </el-table-column>
        <el-table-column label="操作" style="text-align:center" row-style="height:20px;" >
            <template slot-scope="scope">
                <el-button type="success" @click="passcomment(scope.row.id,scope.row.articleid)" v-if="scope.row.pass=='未审核'">通过</el-button>
                 <el-button type="warning" @click="viewcomment(scope.row.id,scope.row.articleid)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
     <el-pagination style="text-align:center;margin-top:15px;"  background layout="prev, pager, next" :total="totalcount"  :page-size="pagesize" @current-change="handleCurrentChange">
    </el-pagination>
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
      commentlist: [],
      loading: true,
      pagesize: 9, //每页条数
      totalcount: 0, //总条数
      state: "", //当前分类
      passstate: [{ id: 0, name: "未审核" }, { id: 1, name: "已审核" }], //状态
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  methods: {
    //页码改变时触发的函数
    handleCurrentChange(val) {
      this.$options.methods.getlist.bind(this)(val);
    },
    //获取列表
    getlist(page) {
      var querystr = "?page=" + page + "&pagesize=" + this.pagesize;
      if (this.state !== "") {
        querystr += "&pass=" + this.state;
      }
      this.$axios
        .get("/admin/comment/adminlist" + querystr)
        .then(res => {
          if (checkServercode(res, this)) {
            //成功
            this.commentlist = []; //置空

            for (let obj of res.data.result) {
              //描述截取，50字符
              var content =
                obj.content.length > 50
                  ? obj.content.substr(0, 50) + "……"
                  : obj.content;
              var title =
                obj.title.length > 50
                  ? obj.title.substr(0, 50) + "……"
                  : obj.title;

              var time = formatDate(new Date(obj.time), "yyyy-MM-dd HH:mm:ss");

              var ispass = obj.pass == 1 ? "已审核" : "未审核";

              this.commentlist.push({
                id: obj.id,
                time,
                name: obj.name,
                content,
                pass: ispass,
                title,
                articleid: obj.articleid
              });
            }
            this.totalcount = res.data.message[0].count;
            //console.log("条数："+this.totalcount);
            this.loading = false; //关闭加载中
          }
        })
        .catch(err => {
          catcherror(this, "获取后台评论列表失败", err);
        });
    },
    search() {
      //查询
      this.$options.methods.getlist.bind(this)(1);
    },
    //查看评论
    viewcomment(id, articleid) {
      this.$router.push({
        name: "admincommentdetail",
        query: { id }
      });
    },
    //审核评论
    passcomment(id, articleid) {
      this.$confirm("确认通过审核吗？")
        .then(_ => {
          var querystr =
            "?articleid=" + articleid + "&page=1&pagesize=" + this.pagesize;
          this.$axios
            .get("/admin/comment/topasslist/" + id + querystr)
            .then(res => {
              if (checkServercode(res, this)) {
                this.$message({
                  showClose: true,
                  message: "审核通过！",
                  type: "success"
                });
                //成功
                this.commentlist = [];
                //console.log(res.data.result.length);
                for (let obj of res.data.result) {
                  //描述截取，50字符
                  var content =
                    obj.content.length > 50
                      ? obj.content.substr(0, 50) + "……"
                      : obj.content;
                  var title =
                    obj.title.length > 50
                      ? obj.title.substr(0, 50) + "……"
                      : obj.title;

                  var time = formatDate(
                    new Date(obj.time),
                    "yyyy-MM-dd HH:mm:ss"
                  );

                  var ispass = obj.pass == 1 ? "已审核" : "未审核";

                  this.commentlist.push({
                    id: obj.id,
                    time,
                    name: obj.name,
                    content,
                    pass: ispass,
                    title,
                    articleid: obj.articleid
                  });
                }
                this.totalcount = res.data.message[0].count;
                this.loading = false; //关闭加载中
              }
            })
            .catch(res => {
              catcherror(this, "审核评论失败", err);
            });
        })
        .catch(_ => {});
    }
  },
  created() {
    //获取列表,第一页
    this.$options.methods.getlist.bind(this)(1);
  }
};
</script>
<style>

</style>


