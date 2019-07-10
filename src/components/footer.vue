<template>
  <div>
      <div class="main_footer">
          {{text}}
      </div>
  </div>
</template>
<script>
export default {
  props:['text']
};
</script>
<style scoped>
.main_footer {
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  clear: both;
  font-size: 14px;
  border-top: 1px solid #ccc;
}
</style>
