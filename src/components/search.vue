<template>
  <el-autocomplete
  popper-class="my-autocomplete"
  v-model="state3"
  :fetch-suggestions="querySearch"
  placeholder="站内搜索"
  @select="handleSelect">
  <!-- <i
    class="el-icon-search el-input__icon"
    slot="suffix"
    @click="handleIconClick">
  </i> -->
  <template slot-scope="props">
    <div class="name">{{ props.item.title }}</div>
    <div class="addr">{{ props.item.description }}</div>
  </template>
</el-autocomplete>
</template>
<script>
export default {
  data() {
    return {
      restaurants: [],
      state3: "",
      arr: []
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.title.toLowerCase().indexOf(queryString.toLowerCase()) >=
            0 ||
          restaurant.description
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) >= 0
        );
      };
    },
    handleSelect(item) {
      //文本点击
      let id = item.id;
      this.$router.push({
        name: "blogdetail",
        params: { id }
      });
      //console.log(item);
    }
    // handleIconClick(ev) {
    //   //按钮搜索
    //   console.log(ev);
    // }
  },
  created() {
    //this.vloadcount = this.$store.state.loadcount;
    var domain = document.domain;
    //获取搜索提示列表
    this.$axios.get("/search/getsearch?domain=" + domain).then(res => {
      if (res.data.code == 200) {
        let data = res.data.result;
        var arr = [];
        for (var d of data) {
          let description =
            d.description.length > 80
              ? d.description.substr(0, 80) + "…"
              : d.description;
          arr.push({ id: d.id, title: d.title, description });
        }
        this.restaurants = arr; //为下拉联想赋值

        this.$store.commit("addloadcount");
        //console.log("获取搜索提示列表5");
      }
    });
  }
};
</script>
<style lang="less">
.my-autocomplete {
  li {
    line-height: normal;
    border-bottom: 1px dashed #ccc;
    margin-top: 10px;
    padding-bottom: 10px;
    padding：7px .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .name {
      white-space: normal;
      color: #4a75b5;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
      white-space: normal;
      line-height: normal;
      margin-bottom: 10px;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>


