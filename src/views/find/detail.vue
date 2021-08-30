<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ detail.title }}</span>
        <!-- <div style="float: right; padding: 3px 0" type="text">
          i标签那里缺了个点赞按钮图标
          <i></i><span>{{ detail.praise }}</span>
        </div> -->
      </div>
      <div class="text item">
        <el-image fit="fill" :src="detail.pic"></el-image>
        <p>{{ detail.describe }}</p>
        <time class="time">{{ detail.date }}</time>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Detail",
  data() {
    return {
      detail: {},
    };
  },
  created() {
    this.getMessageData();
  },
  methods: {
    // ? 发起请求
    async getMessageData() {
      let _id = this.$route.query.id;
      let response = await window.$common.get(
        `http://47.243.88.190:8889/praise?_id=${_id}`
      );
      this.detail = response;
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 70vw;
  margin: 0 auto;
  .el-card {
    width: 100%;
    position: relative;
    .el-image {
      width: 100%;
    }
  }
}
.text {
  font-size: 16px;
  .time {
    position: absolute;
    right: 0.8em;
    font-size: 13px;
    color: #999;
  }
  i:hover {
    color: #ff8d2f;
  }
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>