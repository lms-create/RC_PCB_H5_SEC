<template xmlns="http://www.w3.org/1999/html">
  <div class="container" v-loading="initSuccess">
    <div id="banner" class="banner">
      <el-carousel :height="bannerHeight + 'px'" type="card">
        <el-carousel-item v-for="item in imgList" :key="item.url">
          <img :src="item.pic" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="display: flex" class="classify">
      <div>
        <h3>图片识别垃圾分类</h3>
        <div style="width: auto; height: auto">
          <el-upload
            ref="upload"
            style="margin-top: 20px"
            drag
            :action="ationUrl"
            accept=".jpg, .png"
            :max-size="2048"
            :before-upload="uploadBefore"
            :on-change="getFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              上传图片进行垃圾识别分类<br />请上传.jpg或.png文件，且不超过2M
            </div>
          </el-upload>
        </div>
      </div>
      <h3 v-for="items in Result" :key="items.cate_name" class="result">
        垃圾名称：<span>{{ items.garbage_name }}</span
        ><br />
        垃圾种类：<span>{{ items.cate_name }}</span
        ><br />
        注意事项：<span>{{ items.ps }}</span
        ><br />
      </h3>
    </div>
    <div class="itemBox">
      <div v-for="item in typeList" :key="item.typeid" class="item">
        <div class="leftFloat hidden-xs-only">
          <img :src="item.pic" style="height: 50%; width: 50%" alt="" />
        </div>
        <div class="rightFloat">
          <h2>{{ item.name }}</h2>
          <div class="title">
            {{ item.title }}
          </div>
          <p class="desc">
            {{ item.desc }}
          </p>

          <div class="el-pop">
            <el-popover placement="right" width="400" trigger="click">
              <el-table :data="Detail" height="280px" stripe>
                <el-table-column
                  width="360px"
                  prop="name"
                  label="可回收垃圾目录"
                >
                </el-table-column>
              </el-table>
              <el-button
                slot="reference"
                type="primary"
                @click="getBarbage(item.typeid)"
                class="lookDetail"
                >查看详情</el-button
              >
            </el-popover>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hidden-xs-only"
      style="width: 100%; height: 30px; float: left; position: relative"
    ></div>
  </div>
</template>
<script>
import request from "../../utils/request";

export default {
  name: "home",
  data() {
    return {
      initSuccess: false,
      typeList: [],
      ationUrl: "",
      Result: "",
      // 图片地址数组
      imgList: [],

      // 图片父容器高度
      bannerHeight: 370,
      // 浏览器宽度
      screenWidth: 0,
      Detail: [],
    };
  },
  methods: {
    //获取type信息
    async getType() {
      this.initSuccess = true;
      this.typeList = await request.get("http://47.243.88.190:8889/type");
      this.initSuccess = false;
    },
    //获取banner数据
    async getBanner() {
      this.initSuccess = true;
      this.imgList = await request.get("http://47.243.88.190:8889/banner");
      this.initSuccess = false;
    },
    uploadBefore(file) {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles(); // 清除上传的文件
      }
      const size = file.size / 1024 / 1024;
      if (size > 2) {
        this.$notify.warning({
          title: "警告",
          message: "文件不能大于2M",
        });
        return false;
      } else {
        this.$notify.success({
          title: "上传成功",
          message: "请稍等片刻",
        });
        return false;
      }
    },
    getBase64File(file) {
      //把图片转成base64编码
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    getFile(file) {
      //上传
      this.getBase64File(file.raw).then((res) => {
        res = res.replace(/^data:image\/\w+;base64,/, "");
        request
          .post("http://47.243.88.190:8889/classify", { imgBase64: res })
          .then((Result) => {
            this.Result = Result;
          });
      });
    },
    setSize: function () {
      // 通过浏览器宽度(图片宽度)计算高度
      this.bannerHeight = (350 / 1920) * this.screenWidth;
    },
    async getBarbage(e) {
      this.Detail = await request.get(
        `http://47.243.88.190:8889/garbagetypebyid?typeid=${e}`
      );
    },
  },
  created() {
    this.getBanner();
    this.getType();
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
};
</script>
<style scoped lang="less">
@media screen and (min-width: 1280px) {
  .container {
    width: 1280px;
  }
}
@media screen and (max-width: 767px) {
  .container {
    .rightFloat {
      width: 100%;
      float: left;
    }
    .classify {
      display: block !important;
      .result {
        margin: 10px 0;
      }
      /deep/ .el-upload {
        width: 100%;
      }
      /deep/ .el-upload-dragger {
        width: 100% !important;
      }
    }
  }
}

.container {
  background-color: #fff;
  margin: 0px auto;
  box-sizing: border-box;
  .banner {
    padding-top: 20px;
  }
  .itemBox {
    width: 100%;
    overflow: hidden;
    margin-top: 5px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .classify {
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0 0 2px #c2c2c2;
  }
  .result {
    margin: 40px 100px;
  }
  .desc {
    color: #86909c;
    margin-top: 10px;
    text-indent: 2em;
  }
  .title {
    text-indent: 2em;
  }
  .lookDetail {
    margin-top: 20px;
  }
}
.leftFloat {
  width: 30%;
  overflow: hidden;
  display: block;
  float: left;
}
h1 {
  letter-spacing: -0.05em;
  margin: 0 0 0.5em;
  line-height: 1;
  color: #222;
}
h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 48px;
  letter-spacing: -0.05em;
  margin: 0 0 0.5em;
  line-height: 1;
  color: #222;
}
h3 {
  font-size: 1em;
  font-weight: bold;
  color: #222;
}

.item {
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  box-shadow: 0 0 2px #c2c2c2;
}

.rightFloat {
  width: 70%;
  float: right;
}
p {
  margin: 0 0 0 0;
}
img {
  /*设置图片宽度和浏览器宽度一致*/
  width: 100%;
  height: inherit;
}
.el-footer {
  float: left;
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 20px;
}
</style>
