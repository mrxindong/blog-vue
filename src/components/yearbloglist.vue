<template>
    <div class="cateContent">
        <div class="catedetail"  v-for="(y,index) in years" :key="index">
                <strong>{{y}}</strong>
            <div v-if="article.year==y" v-for="(article,i) in articlelist" :key="i">
                    <ul>
                    <li>
                        <router-link :to="{name:'blogdetail',params:{id:article.id}}">{{article.title}}</router-link>
                                <span>({{article.createtime}} · 
                                    <span class="ds-thread-count disqus-comment-count cy_cmt_count" data-thread-key="gem-sources" data-disqus-identifier="gem-sources"
                                        id="sourceId::gem-sources">暂无评论</span>)</span>
                            </li>
                </ul>
            </div>

        </div>
    </div>
</template>
<script>
import { formatDate } from "../assets/js/commonFun";
export default {
  data() {
    return {
      years: [],
      articlelist: [],
    };
  },
  methods: {
    getlist() {
      var domain = document.domain;
      let querystr = "?domain=" + domain;
      if (this.$route.query.id) {
        //有分类
        querystr += "&blogtype=" + this.$route.query.id;
      }
      //获取年份
      this.$axios
        .get("/article/getblogyears" + querystr)
        .then(res => {
          if (res.data.code == 200) {
            this.years = [];
            for (let obj of res.data.result) {
              this.years.push(obj.year);
            }
          } else {
            console.log(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
      //获取分类下的文章
      this.$axios
        .get("/article/getblogbytypeyear" + querystr)
        .then(res => {
          if (res.data.code == 200) {
            this.articlelist = [];
            for (let obj of res.data.result) {
              var title =
                obj.title.length > 25
                  ? obj.title.substr(0, 25) + "……"
                  : obj.title;
              var createtime = formatDate(
                new Date(obj.createtime),
                "yyyy-MM-dd HH:mm:ss"
              );
              this.articlelist.push({
                id: obj.id,
                createtime,
                title,
                year: obj.year
              });
            }
          } else {
            console.log(res.data.message);
          }
          
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.$options.methods.getlist.bind(this)();
  },
  watch: {
    $route(to, from) {
      // data数据操作
      this.$options.methods.getlist.bind(this)();
    },
    articlelist(){
      //关闭加载
      this.$store.commit('closeloading');
    }
  }
};
</script>
<style>
</style>


