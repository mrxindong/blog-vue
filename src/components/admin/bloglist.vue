<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:30px;height:30px;background:#f8f8f8;border-radius:5px;padding-left:10px;margin-bottom:10px;">
      <el-breadcrumb-item>博客管理</el-breadcrumb-item>
      <el-breadcrumb-item>博客列表</el-breadcrumb-item>
   </el-breadcrumb>
       <el-form :inline="true"  class="demo-form-inline" style="position:relative">
        <el-form-item label="标题">
            <el-input v-model="search_title" placeholder="标题" size="small"></el-input>
        </el-form-item>
        <el-form-item label="日期">
           <el-date-picker v-model="search_date" size="small" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" :picker-options="pickerOptions2">
         </el-date-picker>
        </el-form-item>
        <el-form-item label="分类">
        <el-select v-model="id" clearable  size="small" placeholder="请选择">
          <el-option
            v-for="btype in blogtypelist"
            :key="btype.id"
            :label="btype.name"
            :value="btype.id">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search"  size="small" >查询</el-button>
        </el-form-item>
         <el-button style="position:absolute;right:20px;" type="success" round @click="Editblog(0)">添加博客</el-button>
    </el-form>
    <errorVue :errortitle="errortitle" :errordesc="errordesc" v-if="errshow"></errorVue>
    <el-table :data="bloglist" border style="width: 100%" v-loading="loading">
        <el-table-column prop="createtime" label="日期时间" width="180">
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
         <el-table-column prop="ishidden" label="是否隐藏" width="100">
        </el-table-column>
          <el-table-column prop="tagname" label="分类" width="100">
        </el-table-column>
        <el-table-column label="操作" width="150" style="text-align:center" row-style="height:20px;">
            <template slot-scope="scope">
              <i style="margin-left:20px;color:orange;font-size:20px;font-weight:bold;cursor:pointer" class="el-icon-edit"  @click="Editblog(scope.row.id)"></i>
               <i style="margin-left:30px;color:red;font-size:20px;font-weight:bold;cursor:pointer" class="el-icon-delete"  @click="Deleteblog(scope.row.id)"></i>
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
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      search_title: "", //搜索条件：标题
      search_date: ["", ""], //搜索条件：时间段
      bloglist: [],
      loading: true,
      pagesize: 9, //每页条数
      totalcount: 0, //总条数
      id: "", //当前分类
      blogtypelist: [], //分类列表
      errshow: false,
      errortitle: "",
      errordesc: ""
    };
  },
  methods: {
    //页码改变时触发的函数
    handleCurrentChange(val) {
      this.$options.methods.getlist.bind(this)(
        this.search_title,
        this.search_date,
        val
      );
    },
    //获取列表
    getlist(title, datebettwen, page) {
      var querystr = "?page=" + page + "&pagesize=" + this.pagesize;
      if (title != "") {
        querystr += "&title=" + title;
      }
      if (datebettwen != null) {
        if (datebettwen.length == 2 && datebettwen[0] != "") {
          querystr +=
            "&startdate=" + datebettwen[0] + "&enddate=" + datebettwen[1];
        }
      }
      if (this.id != "") {
        querystr += "&blogtype=" + this.id;
      }
      this.$axios
        .get("/admin/article/list" + querystr)
        .then(res => {
          if (checkServercode(res, this)) {
            //成功
            this.bloglist = []; //置空

            for (let obj of res.data.result) {
              //描述截取，50字符
              var description =
                obj.description.length > 50
                  ? obj.description.substr(0, 50) + "……"
                  : obj.description;

              var createtime = formatDate(
                new Date(obj.createtime),
                "yyyy-MM-dd HH:mm:ss"
              );

              var ishidden = obj.ishidden == 1 ? "已隐藏" : "显示";

              this.bloglist.push({
                id: obj.id,
                createtime,
                title: obj.title,
                description,
                ishidden,
                tagname: obj.tagname
              });
            }
            this.totalcount = res.data.message[0].count;
            //console.log("条数："+this.totalcount);
            this.loading = false; //关闭加载中
          }
        })
        .catch(err => {
          catcherror(this, "获取博客列表失败", err);
        });
    },
    search() {
      //查询
      var title = this.search_title;
      var dateArr = this.search_date; //时间范围选择，默认值是：[ "", "" ],选完时间后，清空，值是 null
      var newArr = []; //格式化获取到的时间
      if (dateArr != null) {
        if (dateArr.length == 2 && dateArr[0] != "") {
          newArr.push(formatDate(new Date(dateArr[0]), "yyyy-MM-dd"));
          newArr.push(formatDate(new Date(dateArr[1]), "yyyy-MM-dd"));
        }
      }
      this.$options.methods.getlist.bind(this)(title, newArr, 1);
    },
    //编辑博客
    Editblog(id) {
      if (id == 0) {
        //添加
        this.$router.push({
          name: "editblog"
        });
      } else {
        //修改
        this.$router.push({
          name: "editblog",
          query: { id }
        });
      }
    },
    //删除博客
    Deleteblog(id) {
      this.$confirm("确认删除这条博客吗？")
        .then(_ => {
          var querystr = "?page=1&pagesize=" + this.pagesize;
          if (this.search_title != "") {
            querystr += "&title=" + this.search_title;
          }
          var datebettwen = this.search_date;
          if (datebettwen != null) {
            if (datebettwen.length == 2 && datebettwen[0] != "") {
              querystr +=
                "&startdate=" + datebettwen[0] + "&enddate=" + datebettwen[1];
            }
          }
          console.log(querystr);
          this.$axios
            .get("/admin/article/delandgetlist/" + id + querystr)
            .then(res => {
              if (checkServercode(res, this)) {
                this.$message({
                  showClose: true,
                  message: "博客删除成功！",
                  type: "success"
                });
                //成功
                this.bloglist = [];
                console.log(res.data.result.length);
                for (let obj of res.data.result) {
                  //描述截取，50字符
                  var description =
                    obj.description.length > 50
                      ? obj.description.substr(0, 50) + "……"
                      : obj.description;
                  var createtime = formatDate(
                    new Date(obj.createtime),
                    "yyyy-MM-dd HH:mm:ss"
                  );
                  var ishidden = obj.ishidden == 1 ? "已隐藏" : "显示";
                  this.bloglist.push({
                    id: obj.id,
                    createtime,
                    title: obj.title,
                    description,
                    ishidden,
                    tagname: obj.tagname
                  });
                }
                this.totalcount = res.data.message[0].count;
                this.loading = false; //关闭加载中
              }
            })
            .catch(res => {
              catcherror(this, "删除博客失败", err);
            });
        })
        .catch(_ => {});
    }
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
    //获取列表,第一页
    this.$options.methods.getlist.bind(this)("", null, 1);
  }
};
</script>
<style>

</style>


