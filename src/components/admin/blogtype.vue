<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:30px;height:30px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
      <el-breadcrumb-item>博客管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
   </el-breadcrumb>
       <el-form :inline="true"  class="demo-form-inline" style="position:relative">
        <el-form-item label="分类">
            <el-input v-model="search_name"  size="small"  placeholder="分类"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search"  size="small" >查询</el-button>
        </el-form-item>
         <el-button style="position:absolute;right:20px;" type="success"   round @click="Editblogtype(0)">添加分类</el-button>
    </el-form>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-table :data="blogtypelist" border style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="分类">
        </el-table-column>
        <el-table-column prop="sorts" label="排序">
        </el-table-column>
        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
               <i style="margin-left:20px;color:orange;font-size:20px;font-weight:bold;cursor:pointer" class="el-icon-edit"  @click="Editblogtype(scope.row.id)"></i>
               <i style="margin-left:30px;color:red;font-size:20px;font-weight:bold;cursor:pointer" class="el-icon-delete"  @click="Deleteblogtype(scope.row.id)"></i>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="text-align:center;margin-top:15px;"  background layout="prev, pager, next" :total="totalcount"  :page-size="pagesize" @current-change="handleCurrentChange">
</el-pagination>
  </div>
</template>
<script>
import { checkServercode, catcherror } from "../../assets/js/commonFun";
export default {
  data() {
    return {
      search_name: "",
      blogtypelist: [],
      loading: true,
      pagesize: 9, //每页条数
      totalcount: 0, //总条数
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  methods: {
    //页码改变时触发的函数
    handleCurrentChange(val) {
      this.$options.methods.getlist.bind(this)(this.search_name, val);
    },
    //获取列表
    getlist(name, page) {
      var querystr = "?page=" + page + "&pagesize=" + this.pagesize;
      if (name != "") {
        querystr += "&name=" + name;
      }
      this.$axios
        .get("/admin/article/typelist" + querystr)
        .then(res => {
          if (checkServercode(res, this)) {
            //成功
            this.blogtypelist = res.data.result;
            this.totalcount = res.data.message[0].count;
            this.loading = false; //关闭加载中
          }
        })
        .catch(err => {
          catcherror(this, "获取博客分类列表失败", err);
        });
    },
    search() {
      //查询
      var name = this.search_name;
      this.$options.methods.getlist.bind(this)(name, 1);
    },
    //编辑分类
    Editblogtype(id) {
      if (id == 0) {
        //添加
        this.$router.push({
          name: "editblogtype"
        });
      } else {
        //修改
        this.$router.push({
          name: "editblogtype",
          query: { id }
        });
      }
    },
    //删除博客
    Deleteblogtype(id) {
      this.$confirm("确认删除这个分类吗？")
        .then(_ => {
          //判断当前分类是否有关联的文章
          this.$axios
            .get("/admin/article/istypehaveblog?id=" + id)
            .then(r => {
              if (checkServercode(r, this)) {
                if (r.data.result.length > 0) {
                  //有关联数据
                  this.errortitle = "不可删除:";
                  this.errordesc =
                    "当前分类下有关联的博客,删除分类前，请删除相关联的博客！！";
                  this.errshow = true;
                } else {
                  this.errshow = false;
                  //无关联数据
                  var querystr = "?page=1&pagesize=" + this.pagesize;
                  if (this.search_name != "") {
                    querystr += "&name=" + this.search_name;
                  }
                  this.$axios
                    .get("/admin/article/delandgetbloglist/" + id + querystr)
                    .then(res => {
                      if (checkServercode(res, this)) {
                        this.$message({
                          showClose: true,
                          message: "分类删除成功！",
                          type: "success"
                        });
                        this.blogtypelist = res.data.result;
                        this.totalcount = res.data.message[0].count;
                        this.loading = false; //关闭加载中
                      }
                    })
                    .catch(res => {
                      catcherror(this, "删除分类失败", err);
                    });
                }
              }
            })
            .catch(er => {});
        })
        .catch(_ => {});
    }
  },
  created() {
    //获取列表
    this.$options.methods.getlist.bind(this)("", 1);
  }
};
</script>
<style>

</style>


