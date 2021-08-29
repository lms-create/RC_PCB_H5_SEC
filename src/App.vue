<template>
  <div id="app" class="h100">
    <el-container class="h100">
  <el-header class="header">
    <el-menu
      :default-active="this.$route.path"
      class="menu flex-end"
      mode="horizontal"
      router
    >
      <h3 class="title">垃圾分类</h3>
      <el-menu-item class="lf-margin-20" index="/home">首页</el-menu-item>
      <el-menu-item class="lf-margin-20" index="/find">发现</el-menu-item>
      <el-menu-item class="lf-margin-50" index="/test">考试</el-menu-item>
    </el-menu>
  </el-header>
  <el-main class="main h100">
    <router-view/>
  </el-main>
</el-container>
    
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body{
  height: 100%;
  background-color: #f4f5f5;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid #8abef3;
}
.title{
  position: absolute;
  left: 50px;
  top: calc(50% - 13px);
}
.el-container{
  box-sizing: border-box;
}
.el-header{
  padding: 0;
}
.main{
  margin: 0;
  padding-top: 10px;
}
</style>
