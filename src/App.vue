<script setup>
// App.vue 不需要导入任何组件
</script>

<template>
  <router-view />
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

#app {
  height: 100%;
}

/* 覆盖一些Element Plus的默认样式 */
.el-card__header {
  padding: 15px 20px;
  font-weight: bold;
}
</style>
