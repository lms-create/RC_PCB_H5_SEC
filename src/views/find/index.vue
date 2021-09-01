<template>
  <div class="find container">
    <!--3栏式布局 中间固定两边自适应-->
    <el-row v-loading="initSuccess" class="content flex">
      <el-col :sm="16" class="content-left">
        <div
          @click="toDetail(items._id)"
          class="card flex-center"
          v-for="items in cardMessage"
          :key="items._id"
        >
          <el-row>
            <el-col :sm="17" class="card-content flex-column">
              <div style="flex-grow: 1" class="card-content-time">
                <p>{{ items.date }}</p>
              </div>
              <div style="flex-grow: 3" class="card-content-title">
                <h3>{{ items.title }}</h3>
                <p class="content-describe">{{ items.describe }}</p>
              </div>
              <!-- <div v-show="isActive" class="pick-button" style="flex-grow: 1">
              <i
                @mouseover="mouseOver"
                @mouseleave="mouseLeave"
                class="pick iconfont"
              >
                &#xe65c;
              </i>
              <span>{{ items.praiseNum }}</span>
            </div> -->
              <div
                v-show="isActive"
                class="pick-button"
                style="flex-grow: 1"
                @click.stop="parise(items._id)"
              >
                <i class="pick iconfont"> &#xe65c; </i>
                <span>{{ items.praiseNum }}</span>
              </div>
            </el-col>
            <el-col :sm="7" class="card-content-img hidden-xs-only">
              <el-image style="width: 80%" :src="items.pic" fit="contain">
              </el-image>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :sm="8" class="content-right">
        <div class="right-top">
          <div>
            <div class="flex search">
              <el-input
                placeholder="请输入想搜索的标题"
                v-model="input"
                clearable
              >
              </el-input>
              <el-button type="success" @click="throrrle()" plain
                >搜索</el-button
              >
            </div>
            <div
              v-show="!tagList.length"
              style="
                text-align: center;
                font-weight: 300;
                font-size: 14px;
                margin-top: 15px;
              "
            >
              无历史搜索记录
            </div>
            <div class="flex tag" style="width: 300px">
              <el-tag
                v-show="tagList"
                size="mini"
                type="info"
                @close="delTag(items.id)"
                closable
                v-for="items in tagList"
                :key="items.id"
              >
                {{ items.title }}
              </el-tag>
            </div>
          </div>
          <div class="hotSearch">
            <p>热搜：</p>
            <div style="margin-top: 10px">
              <div class="top1">
                <span>1、</span><a href="#">捡垃圾被蚂蚁咬了会变成蚁人吗</a>
              </div>
              <div style="font-size: 17px">
                <span>2、</span><a href="#">如何让富婆爱上我</a>
              </div>
              <div style="font-size: 15px">
                <span>3、</span><a href="#">垃圾分类可以年入百万吗</a>
              </div>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <h3>你觉得你的垃圾分类知识如何？</h3>
          <p>看了那么多,快来答题吧！</p>
          <p>👇👇👇</p>
          <el-button
            style="margin-top: 20px"
            type="primary"
            @click="$router.push('/test')"
            >点击答题</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Find",
  data() {
    return {
      cardMessage: [],
      initSuccess: false,
      isActive: true,
      input: "",
      tagList: [],
      tagId: 0,
      timer: null,
    };
  },
  watch: {
    input: function (val) {
      if (val === "" && this.cardMessage.length != this.ListData.length) {
        this.cardMessage = this.ListData;
      }
    },
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      //获取发现首页列表数据
      this.initSuccess = true;
      window.$common
        .get("http://47.243.88.190:8889/articleall")
        .then((response) => {
          this.initSuccess = false;

          console.log(response);
          this.ListData = response;
          this.cardMessage = response;
        });
    },
    mouseOver() {
      // 鼠标移入事件
      this.isActive = false;
    },
    mouseLeave() {
      // 鼠标移出事件
      this.isActive = true;
    },
    delTag(id) {
      //删除
      let index = this.tagList.findIndex((item) => item.id === id);
      this.tagList.splice(index, 1);
    },
    throrrle(time = 1000) {
      //节流
      if (this.timer === null) {
        this.search();
        this.timer = setTimeout(() => {
          this.timer = null;
        }, time);
      }
    },
    search() {
      if (this.input === "") {
        this.$message({
          message: "请输入搜索内容",
          type: "warning",
        });
      } else {
        let find = new RegExp(this.input);
        let flagList = [];
        for (let i = 0; i < this.cardMessage.length; i++) {
          if (find.test(this.cardMessage[i].title) === true) {
            flagList.push(this.cardMessage[i]);
          }
        }
        if (flagList.length) {
          this.cardMessage = flagList;
        } else {
          this.$message({
            message: "无相关内容",
            type: "warning",
          });
        }
        if (this.tagList.length < 5) {
          this.tagList.unshift({
            title:
              this.input.length > 5
                ? this.input.slice(0, 5) + "..."
                : this.input,
            id: this.tagId++,
          });
        } else {
          this.tagList.pop();
          this.tagList.unshift({
            title:
              this.input.length > 5
                ? this.input.slice(0, 5) + "..."
                : this.input,
            id: this.tagId++,
          });
        }
      }
      console.log(this.tagList);
    },
    toDetail(cardId) {
      console.log(1);
      // 跳转详情
      // console.log("query" + cardId);
      this.$router.push({
        path: "/find/detail",
        query: { id: cardId },
      });
    },
    //点赞
    async parise(e) {
      let _id = e;
      const data = await window.$common.get(
        `http://47.243.88.190:8889/praise?_id=${_id}`
      );
      //重新获取文章列表页
      this.getListData();
    },
  },
};
</script>

<style lang="less">
/* 因为设计稿是1280 的，所以我们要修改宽度 */

@media screen and (min-width: 1280px) {
  .container {
    width: 1280px;
  }
}

// 超小屏时
@media screen and (max-width: 767px) {
  .container {
    .content {
      display: block;
    }
  }
}

.container {
  margin: 0 auto;
}
.find {
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    .content-left {
      overflow: auto;
      box-shadow: inherit;
      height: 100%;
      .card {
        background-color: #fff;
        height: 150px;
        // box-sizing: border-box;
        padding: 0 40px;
        border-bottom: 1px solid #e5e6eb;
        .card-content {
          height: 100%;
          .pick-button {
            .pick {
              width: 10px;
              height: 10px;
            }
            .pick:hover {
              cursor: pointer;
            }
            span {
              color: #4e5969;
              font-size: 14px;
            }
          }
          .content-describe {
            color: #86909c;
            font-size: 13px;
            line-height: 22px;
            margin-top: 20px;
          }
          p {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .card-content-title {
            padding: 10px 0;
            width: 90%;
          }
          .card-content-time {
            // width: 400px;
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #4e5969;
          }
        }
      }
      .card:hover {
        background-color: rgb(251, 251, 251);
      }
    }
    .content-right {
      .right-top {
        // background-color: rgb(109, 66, 66);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fff;
        margin-left: 20px;
        height: 300px;
        .search {
          // align-items: center;
          margin-top: 20px;
          justify-content: center;
          .el-button {
            margin-left: 10px;
            width: 75px;
          }
          .el-input {
            width: 200px;
          }
        }
        .tag {
          margin-left: 25px;
          justify-content: flex-start;
          flex-wrap: wrap;
          .el-tag {
            margin-top: 5px;
            margin-right: 5px;
          }
        }
        .hotSearch {
          bottom: 0;
          height: 150px;
          margin-left: 30px;
          display: flex;
          flex-direction: column;
          p {
            font-weight: 500;
          }
          a {
            text-decoration: none;
            color: black;
          }
          .top1 {
            color: red;
            font-size: 18px;
            a {
              color: red;
            }
          }
        }
      }
      .right-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        margin: 20px 0px 0 20px;
        height: 200px;
        h3 {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>