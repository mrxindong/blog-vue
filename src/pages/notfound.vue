<template>
  <div class="err">
    <img src="../assets/images/404.jpg"/>
    <p>啊喔，您请求的页面不存在，请检查您的网址</p>
    <p>
        <button class="errback" @click="goback">返回</button>
    </p>
</div>
</template>
<script>
export default {
  methods: {
    goback() {
      this.$router.go(-1); //返回上一步
    }
  }
};
</script>
<style scoped>
.err {
  width: 80%;
  margin: 100px auto;
  text-align: center;
  font-family: 幼圆;
}

.errback {
  width: 200px;
  height: 45px;
  background: #d1a24a;
  color: #fff;
  border: 0;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 30px;
}
</style>
