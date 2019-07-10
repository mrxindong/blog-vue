<template>
  <div>
    <el-alert  :title="errortitle" type="error"  :description="errordesc" show-icon>
    </el-alert>
  </div>
</template>
<script>
export default {
  //接收父组件传来的值
  props: ["errortitle", "errordesc"]
};
</script>
<style>

</style>
