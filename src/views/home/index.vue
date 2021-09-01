<template xmlns="http://www.w3.org/1999/html">
  <div class="container">
    <div id="banner" class="banner">
      <!--动态将图片轮播图的容器高度设置成与图片一致-->
      <el-carousel :height="bannerHeight + 'px'" type="card">
        <!--遍历图片地址,动态生成轮播图-->
        <el-carousel-item v-for="item in imgList" :key="item.url">
          <img :src="item.url" alt="" />
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
      <div v-for="item in typeList" :key="item.typeId" class="item">
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

          <el-popover placement="right" width="400" trigger="click">
            <el-table :data="Detail" height="280px" stripe>
              <el-table-column width="360px" prop="name" label="可回收垃圾目录">
              </el-table-column>
            </el-table>
            <el-button
              slot="reference"
              type="primary"
              @click="getRecylableBarbage()"
              class="lookDetail"
              >查看详情</el-button
            >
          </el-popover>
        </div>
      </div>
    </div>
    <div
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
      typeList: [
        {
          typeId: 1,
          name: "可回收垃圾(RECYLABLE)",
          title:
            "可回收物指适宜回收利用和资源化利用的生活废弃物。可回收物主要品种包括：废纸、废弃塑料瓶、废金属、废包装物、废旧纺织物、废弃电器电子产品、废玻璃、废纸塑铝复合包装等。",
          desc: "根据《城市生活垃圾分类及其评价标准》行业标准以及参考德国垃圾分类法，可回收物是指适宜回收循环使用和资源利用的废物。主要包括：1、纸类：未严重玷污的文字用纸、包装用纸和其他纸制品等。如报纸、各种包装纸、办公用纸、广告纸片、纸盒、复印纸等；2、塑料：废容器塑料、包装塑料等塑料制品。比如各种塑料袋、塑料瓶、泡沫塑料、一次性塑料餐盒餐具、硬塑料等；3、金属：各种类别的废金属物品。如易拉罐、铁皮罐头盒、铅皮牙膏皮等；4、玻璃：有色和无色废玻璃制品；",
          pic: "https://pic.imgdb.cn/item/612f811844eaada7391d0d54.jpg",
        },
        {
          typeId: 2,
          name: "有害垃圾(HAZARDOUS)",
          title:
            "有害垃圾指对人体健康或者自然环境造成直接或者潜在危害的生活废弃物。常见的有害垃圾包括废灯管、废油漆、杀虫剂、废弃化妆品、过期药品、废电池、废灯泡、废水银温度计等，有害垃圾需按照特殊正确的方法安全处理",
          desc: " 1、废镍镉电池和氧化汞电池（包括手机、iPad、照相机等使用的充电电池以及纽扣电池）以及单子类危险废物；日光灯、节能灯等废荧光灯类、灯泡；废药品及其包装物、废杀虫剂和消毒剂及其包装物、废水银温度计、废水银血压计、废胶片及废相纸、废硒鼓墨盒；废油漆和溶剂及其包装物、废矿物油及其包装物；",
          pic: "https://pic.imgdb.cn/item/612f813444eaada7391d485d.jpg",
        },
        {
          typeId: 3,
          name: "湿垃圾(HOUSEHOLD)",
          title:
            "湿垃圾（英文名称也称：organicwaste）又称为厨余垃圾、有机垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。",
          desc: "湿垃圾是指日常生活垃圾中可分解的有机物质部分。有机垃圾包括食物残渣、菜根、菜叶，动物蹄、角、瓜皮、果屑、蛋壳、鱼鳞、毛发、植物枝干、树叶、杂草、动物尸体、牲畜粪便等。有机垃圾应由专人负责收集，收集容器必须密封、有盖、防渗漏、防蝇、防鼠。湿垃圾是居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾，包括丢弃不用的菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头、动物内脏、鱼鳞、树叶、杂草等。",
          pic: "https://pic.imgdb.cn/item/612f815744eaada7391d9382.jpg",
        },
        {
          typeId: 4,
          name: "干垃圾(RESIDUAL)",
          title:
            "干垃圾即其它垃圾，指除可回收物、有害垃圾、湿垃圾以外的其它生活废弃物。其他垃圾包括砖瓦陶瓷、渣土、卫生间废纸、瓷器碎片等难以回收的废弃物，采取卫生填埋可有效减少对地下水、地表水、土壤及空气的污染，在当今社会，还无有效化解其他垃圾的好方法，所以需尽量少产生。",
          desc: "干垃圾包括：餐巾纸、卫生间用纸、尿不湿、猫砂、狗尿垫、污损纸张、烟蒂、干燥剂，污损塑料、尼龙制品、编织袋、防碎气泡膜，大骨头、硬贝壳、硬果壳（椰子壳、榴莲壳、核桃壳、玉米衣、甘蔗皮）、硬果实（榴莲核、菠萝蜜核），毛发、灰土、炉渣、橡皮泥、太空沙、带胶制品，一次性餐具、镜子、竹制品，成分复杂的制品。危害较小，但无再次利用价值。",
          pic: "https://pic.imgdb.cn/item/612f817f44eaada7391def79.jpg",
        },
      ],
      ationUrl: "",
      Result: "",
      // 图片地址数组
      imgList: [
        { url: require("@/assets/img/carouselIndex.jpg") },
        { url: require("@/assets/img/carousel1.jpeg") },
        { url: require("@/assets/img/carousel2.jpeg") },
        { url: require("@/assets/img/carousel3.jpeg") },
        { url: require("@/assets/img/carousel4.jpeg") },
      ],
      image1: [{ url: require("@/assets/img/recyble.jpg") }],
      image2: [{ url: require("@/assets/img/hazardous.jpg") }],
      image3: [{ url: require("@/assets/img/household.jpg") }],
      image4: [{ url: require("@/assets/img/residual.jpg") }],
      uploadImg: [{ url: require("@/assets/img/upload.png") }],

      // 图片父容器高度
      bannerHeight: 370,
      // 浏览器宽度
      screenWidth: 0,
      Detail: [],
    };
  },
  methods: {
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
          //console.log(imgResult)
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
            // console.log(Result)
          });
      });
    },
    setSize: function () {
      // 通过浏览器宽度(图片宽度)计算高度
      this.bannerHeight = (350 / 1920) * this.screenWidth;
    },
    getRecylableBarbage() {
      request
        .get("http://47.243.88.190:8889/garbagetypebyid?typeid=1")
        .then((response) => {
          this.Detail = response;
          console.log(this.Detail);
        });
    },
    getHazardousBarbage() {
      request
        .get("http://47.243.88.190:8889/garbagetypebyid?typeid=2")
        .then((response) => {
          this.Detail = response;
          console.log(this.Detail);
        });
    },
    getHouseholdBarbage() {
      request
        .get("http://47.243.88.190:8889/garbagetypebyid?typeid=3")
        .then((response) => {
          this.Detail = response;
          console.log(this.Detail);
        });
    },
    getResidualBarbage() {
      request
        .get("http://47.243.88.190:8889/garbagetypebyid?typeid=4")
        .then((response) => {
          this.Detail = response;
          console.log(this.Detail);
        });
    },
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

  mouseOver() {
    this.isActive = false;
  },
  mouseLeave() {
    this.isActive = true;
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
    }
  }
}

.container {
  background-color: #fff;
  margin: 0px auto;
  .banner {
    padding-top: 20px;
  }
  .itemBox {
    width: 100%;
    overflow: hidden;
    margin-top: 5px;
    background-color: #fff;
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
}
h3 {
  font-size: 1em;
  font-weight: bold;
  color: #222;
}
h1,
.item {
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  box-shadow: 0 0 2px #c2c2c2;
}
h2 {
  letter-spacing: -0.05em;
  margin: 0 0 0.5em;
  line-height: 1;
  color: #222;
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
