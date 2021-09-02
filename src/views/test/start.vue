<template>
  <div class="container">
    <h3>在线闯关</h3>
    <div class="logo hidden-xs-only">
      <img src="../../assets/img/logo.jpg" alt="" />
    </div>
    <div class="body">
      <div class="begin" @click="goAnswer">
        <span>开始<br />答题</span>
        <div class="start">
          <img src="../../assets/img/start.png" alt="" />
        </div>
      </div>
      <div class="rule">
        <h3>【知识答题规则】：</h3>
        <div v-for="(item, index) in rule" :key="index">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      rule: [
        "1.点击进入———点击左侧“开始答题”按钮即可开始答题。",
        "2.答题规则———“在线闯关”每套题10道题，均为客观题，所有题答完提交后，显示正误并反馈正确答案。",
        "3.计分规则———每答对一题计10分，答错不扣分，共计100分。",
      ],
    };
  },
  methods: {
    goAnswer() {
      this.$router.push("/test/answer");
    },
  },
};
</script>

<style lang="less"scoped >
div {
  box-sizing: border-box;
}
.container {
  background: #fff;
  padding: 50px;
  margin: 0 auto;
  > h3 {
    padding: 0.3em;
    text-align: center;
    font-size: 50px;
    letter-spacing: 1em;
    color: #213768;
    border-radius: 20px;
    box-shadow: 0 0 10px #d5d5d5;
  }
  .logo {
    margin-top: 1.5em;
    height: 170px;
    width: 284px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .body {
    margin-top: 1.5em;
    display: flex;
    .begin:hover {
      cursor: pointer;

      background-color: #f8b808;
    }
    .begin {
      width: 280px;

      background-color: #f8c813;
      box-shadow: 0 0 10px #dba205;
      border-radius: 20px;
      text-align: center;
      padding: 1.5em;
      span {
        color: #6f421f;
        font-size: 40px;
        font-weight: 700;
      }
      .start {
        width: 90px;
        height: 90px;
        margin: 0.5em auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .rule {
      padding: 20px;
      h3 {
        color: #e3435d;
        font-size: 24px;
        margin-bottom: 10px;
      }
      margin-left: 1.5em;
      background-color: #fff;
      box-shadow: 0 0 10px #d5d5d5;
      border-radius: 20px;
      width: 100%;
    }
    div {
      margin-top: 1em;
    }
  }
}
@media screen and (min-width: 1280px) {
  .container {
    width: 1280px;
  }
}

@media screen and (max-width: 767px) {
  .container {
    > h3 {
      letter-spacing: 0.5em;
      font-size: 30px;
    }
    .body {
      display: block;
      .begin {
        width: 100%;
        display: flex;
        justify-content: center;
        span {
          font-size: 20px;
        }
        .start {
          width: 50px;
          height: 50px;
          margin: 0;
        }
      }
      .rule {
        h3 {
          font-size: 18px;
        }
        margin: 10px 0;
      }
    }
  }
}
</style>