<template>
  <div id="app" class="h100">
    <el-container class="h100">
      <el-header class="header">
        <h3>垃圾分类</h3>

        <ul>
          <router-link tag="li" to="/home" class="lf-margin-20"
            >首页</router-link
          >
          <router-link tag="li" to="/find" class="lf-margin-20"
            >发现</router-link
          >
          <router-link tag="li" to="/test" class="lf-margin-20"
            >考试</router-link
          >
        </ul>
      </el-header>
      <el-main class="main h100">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.router-link-active {
  color: #35383b !important;
  border-bottom: 2px solid #409eff;
}

.el-container {
  box-sizing: border-box;
}
.el-header {
  position: relative;
  width: 100%;
  display: flex;
  padding: 0 100px;
  background-color: #fff;
  justify-content: space-between;

  h3 {
    line-height: 60px;
    width: 250px;
  }
  ul {
    height: 100%;
    display: flex;
    list-style: none;
    line-height: 60px;

    li {
      text-align: center;
      color: #909399;
      font-size: 14px;
      padding: 0 20px;
      width: 50px;
    }
  }
}
.main {
  margin: 0;
  padding-top: 10px;
}
@media screen and (max-width: 767px) {
  .el-header {
    padding: 0 10px;
    ul {
      li {
        width: 30px;
        margin: 0 5px !important;
      }
    }
  }
}
</style>
