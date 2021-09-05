<template>
  <div class="container" v-loading="initSuccess">
    <div class="testBox">
      <div v-if="!showResultBox">
        <!-- <div class="time">10</div> -->
        <div class="slider">
          <el-slider :step="10" disabled :value="(testNum + 1) * 10">
          </el-slider>
        </div>
      </div>
      <div class="content" ref="content">
        <div class="answerBox" v-if="!showResultBox">
          <div class="left">
            <div class="garbageName">{{ showTest.name }}</div>
            <div class="question">属于右边哪种分类？</div>
          </div>
          <div class="itemBox">
            <div class="item" @click="answer(1)">可回收物</div>
            <div class="item" @click="answer(2)">有害垃圾</div>
            <div class="item" @click="answer(3)">厨余垃圾</div>
            <div class="item" @click="answer(4)">其他垃圾</div>
          </div>
        </div>
        <div class="resultBox" v-else>
          <div class="left">
            <div class="score">
              获得<span>{{ score }}</span
              >分
            </div>
            <div
              class="chart"
              ref="chart"
              style="width: 270px; height: 180px"
            ></div>
            <div class="again" @click="again">在测一次</div>
          </div>
          <div class="analysis">
            <div class="item" v-for="(item, index) in testList" :key="index">
              <div class="name">{{ item.name }}</div>
              <div class="flex">
                <div
                  :class="
                    item.answerType == item.belongType ? 'right' : 'error'
                  "
                >
                  {{
                    item.answerType == 1
                      ? "可回收物"
                      : item.answerType == 2
                      ? "有害垃圾"
                      : item.answerType == 3
                      ? "厨余垃圾"
                      : "其他垃圾"
                  }}
                </div>
                <div
                  :class="
                    item.answerType == item.belongType ? 'right' : 'normal'
                  "
                >
                  {{
                    item.belongType == 1
                      ? "可回收物"
                      : item.belongType == 2
                      ? "有害垃圾"
                      : item.belongType == 3
                      ? "厨余垃圾"
                      : "其他垃圾"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      initSuccess: false,
      testList: [],
      showTest: {},
      testNum: 0,
      answerTypeList: [],
      score: 0,
      showResultBox: false,
      screenWidth: 0,
    };
  },
  created() {
    this.getTestList();
  },
  mounted() {
    // 首次加载时,需要调用一次
    this.screenWidth = window.innerWidth;
    this.setSize();
    // 窗口大小发生改变时,调用一次
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      this.setSize();
    };
  },
  methods: {
    setSize: function () {
      // 通过浏览器宽度(图片宽度)计算高度
      this.bannerHeight = (500 / 1920) * this.screenWidth;
    },
    //发起请求获取答题数据
    async getTestList() {
      this.initSuccess = true;
      this.testList = await window.$common.get(
        "http://47.243.88.190:8889/getgarbage?size=10"
      );
      this.initSuccess = false;
      this.showTest = this.testList[this.testNum];
    },
    //点击回答问题
    answer(e) {
      if (this.answerTypeList.length < 10) {
        this.answerTypeList.push(e);
      }
      if (this.testNum >= 9) {
        this.showResultBox = true;
        //展示答题结果数据
        let count = 0; //统计答对的数量
        for (let i = 0; i < 10; i++) {
          this.testList[i].answerType = this.answerTypeList[i];
          if (this.testList[i].belongType == this.answerTypeList[i]) {
            count += 1;
          }
        }
        this.score = count * 10;
        // console.log(count);
        // console.log(this.testList);
        // console.log(this.answerTypeList);
        //等待dom元素创建好才执行
        setTimeout(() => {
          this.createEcharts();
        });
      } else {
        this.testNum += 1;
        this.showTest = this.testList[this.testNum];
      }
    },

    //创建echars图表
    createEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.chart);
      // 绘制图表
      myChart.setOption({
        title: {
          text: "正确率",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: this.score / 10, name: "正确" },
              { value: 10 - this.score / 10, name: "错误" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    //点击在测试一次
    again() {
      this.$router.go(0);
    },
  },
};
</script>

<style lang="less"scoped>
div {
  box-sizing: border-box;
}
.container {
  position: relative;
  background: url(../../assets/img/bg.jpg) no-repeat;
  height: 70vw;
  background-size: 100%;
  margin: 0 auto;

  .testBox {
    padding: 1em;
    background-color: #fff;
    width: 70%;
    position: absolute;
    top: 320px;
    left: 250px;
    border-radius: 20px;
    box-shadow: 0 0 10px #d5d5d5;
    .time {
      font-size: 20px;
      text-align: center;
      font-weight: 700;
    }
    ::v-deep .el-slider__bar {
      background-color: #7ad423;
    }
    .content {
      padding: 20px;
      box-shadow: 0 0 10px #d5d5d5;
      border-radius: 20px;
      .answerBox {
        display: flex;
        .left {
          width: 200px;
          height: 150px;
          text-align: center;
          padding: 0.5em;
          .garbageName {
            color: #4e4e4e;
            font-weight: 700;
            font-size: 30px;

            height: 85px;
          }
          .question {
            font-size: 20px;
          }
        }
        .itemBox {
          padding: 0.5em;
          text-align: center;
          margin-left: 50px;
          font-size: 20px;
          width: 400px;
          height: 150px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          background-color: #fff;

          .item:hover {
            cursor: pointer;
          }
          .item {
            width: 150px;
            height: 40px;
            line-height: 26px;
            padding: 5px;
            border-radius: 15px;
            color: #fff;
            font-weight: 700;
          }
          & div:nth-child(1) {
            background-color: #4883c6;
          }
          & div:nth-child(1):hover {
            background-color: #3b6ba1;
          }
          & div:nth-child(2) {
            background-color: #ee4855;
          }
          & div:nth-child(2):hover {
            background-color: #ca3d49;
          }
          & div:nth-child(3) {
            background-color: #a16943;
          }
          & div:nth-child(3):hover {
            background-color: #714a2f;
          }
          & div:nth-child(4) {
            background-color: #7e7c7d;
          }
          & div:nth-child(4):hover {
            background-color: #535252;
          }
        }
      }
      .resultBox {
        display: flex;
        .left {
          position: relative;
          text-align: center;
          width: 300px;
          span {
            color: #f57a1a;
            font-size: 30px;
            font-weight: 700;
          }
          .again:hover {
            cursor: pointer;
            background-color: #ca3d49;
          }
          .again {
            position: absolute;
            top: 200px;
            left: 85px;
            font-size: 15px;
            width: 100px;
            height: 30px;
            line-height: 18px;
            padding: 5px;
            border-radius: 15px;
            color: #fff;
            font-weight: 600;
            background-color: #ee4855;
          }
        }
        .analysis {
          width: 100%;
        }
        .item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 3px;
          .name {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .right {
            color: #70cb7c;
            margin-left: 10px;
          }
          .error {
            color: #e35e52;
          }
          .normal {
            color: #aaaaaa;

            margin-left: 10px;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1280px) {
  .container {
    width: 1280px !important;
  }
}
@media screen and (max-width: 1280px) {
  .container {
    color: red;
    .testBox {
      top: 34%;
      right: 18%;
    }
  }
}

@media screen and (max-width: 991px) {
  .container {
    background: #fff;
    .testBox {
      width: 100%;
      top: 20px;
      left: 0;
    }
  }
}

@media screen and (max-width: 767px) {
  .container {
    background: #fff;

    height: 100vh;
    .testBox {
      width: 100%;
      top: 20px;
      left: 0;
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      .content {
        .answerBox {
          display: block;
          .left {
            width: 100%;
          }
          .itemBox {
            width: 100%;
            margin-left: 0;
            .item {
              width: 40%;
            }
          }
        }
        .resultBox {
          display: block;
          .left {
            width: 100%;
            text-align: center;
            .score {
              width: 100%;
            }
            .chart {
              text-align: center;
              width: 270px !important;
              height: 180px;
              margin: 0 auto;
            }
            .again {
              position: static;
              margin: 0 auto;
            }
          }
          .analysis {
            .name {
              margin-left: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>