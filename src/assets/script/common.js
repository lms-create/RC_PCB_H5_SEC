
import request from '@/utils/request'
// import store from '@/store'
// import globalData from '@/assets/json/constant.json5'
import Vue from "vue";
export default{
  /**
   *ajax的封装（post）
   * @param funcUrl  请求的方法地址
   * @param argsData 入参
   * @param successFunc 成功的回调函数
   * @param errorFunc 失败的回调函数
   */
  post: function (funcUrl, argsData,responseType) {
    let UA = navigator.userAgent
    let TOKEN = 'lms-create'
    return request({
      url: funcUrl,
      method: 'post',
      data: {
        'args': argsData,
        'token': TOKEN,
        'deviceInfo': UA,
        'channel': 'pc'
      },
      responseType
    })
  },
  /**
   * @param funcUrl
   * @param argsData
   * @param responseType
   * 注：这里的 responseType 用于指定响应类型。文件下载时需要使用。
   */
  get: function (funcUrl, argsData, responseType) {
    let UA = navigator.userAgent
    let TOKEN = 'lms-create'
    return request({
      url: funcUrl,
      method: 'get',
      data: {
        'args': argsData,
        'token': TOKEN,
        'deviceInfo': UA,
        'channel': 'pc'
      },
      responseType
    })
  },
  /**
   * 清除html标签
   */
  delHtmlTag:function(str){
    if(!str){
      return str;
    }else{
      str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
      str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
      str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
      str=str.replace(/&#39;/ig,"'");//去掉&#39;
      return str;
    }
  },
  /**
   * trim函数表示去除 字符串前后 的空格
   * u3000 空格  u00A0 不间断空格
   * @param str
   * @returns {XML|void|string}
   */
  trim: function (str) {
    return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, "");
  },
  /**
   * 判断是否为空
   * 先判断是否为undefined，在判断是否为null，最后判断如果是字符串的话，是否是“”
   * 满足以上任何一种则返回true，其余情况返回false
   * @param obj
   * @returns {boolean}
   */
  isEmpty: function (obj) {
    if (obj === undefined) {
      return true;
    } else if (obj === null) {
      return true;
    } else if (typeof obj === "string") {
      if (this.trim(obj) === "") {
        return true;
      }
    }
    return false;
  },
  // 编辑器添加自定义上传图片
  editorPlugins: function () {
    CKEDITOR.plugins.add(
      "customImg",
      {
        init: function (editor) {
          editor.addCommand("customImg", {
            exec:function () {
              store.commit('app/SET_EDITOR_NAME', editor.name)
              store.commit('app/SET_DIALOG', true)
            }
          });
          editor.ui.addButton(
            "customImg",
            {
              label:'上传图片',
              command: "customImg",
              icon: "image",
              toolbar: 'insert,0'
            });
        }
      }
    );
    CKEDITOR.config.extraPlugins = "customImg";
  },
  /**
   * 文件下载
   * @param response 文件请求中拿到的 response
   * @param type 拿到的文件类型，如：application/vnd.ms-excel
   * 下载方法正常使用的前提，响应头中的字段包含：
   * content-disposition: attachment;filename=xxx.xls
   */
  downloadFile (response, type) {
    try {
      this.contentDisposition = response.headers['content-disposition']
      const pattern = new RegExp("filename=([^;]+\\.[^\\.;]+);*")
      const result = pattern.exec(this.contentDisposition)
      console.log(this.contentDisposition.split('filename=')[1])
      const filename = decodeURI(this.contentDisposition.split('filename=')[1])
      //数据处理
      let blob = new Blob([response.data], {type: type})
      let url = window.URL.createObjectURL(blob)
      let a = document.createElement("a")
      a.href = url
      a.download = filename
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e) {
      console.log(e)
    }
  },
  /**
   * 格式化 el-date-picker 中的时间范围
   * @param time 传入需要判断的时间，如：2020-08-08 9:20
   * @param isStart 是否是开始时间
   * @returns {string[]} 返回时间范围
   * 例子：time 为 2020-08-08 9:20，且 isStart 为 true，则返回 ['09:20:00-23:59:59']
   */
  formatTimeRange(time, isStart) {
    // 获取时间范围
    const temTime = new Date(time)
    const hour = temTime.getHours()
    const min = temTime.getMinutes()
    const formatTime = (hour < 10 ? ('0' + hour) : hour) + ':' + (min < 10 ? ('0' + min) : min) + ':' + '00'
    const timeRange = isStart ? (formatTime + '-23:59:59') : ('00:00:00-' + formatTime)
    return timeRange
  },
  exportFormat:function(name,value){
    let _query =''
    _.map(name,(item,index)=>{
      if(value[index]===null||value[index]===''){
        _query+=index===0 ? item+'=':'&'+item+'='
      }else{
        _query+=index===0 ? item+'='+value[index]:'&'+item+'='+value[index]
      }
    })
    return _query
  },
  // new Date
  getNewDate(date) {
    return new Date(date.replace(/-/g, '/'))
  },
  // 评分显示 4.6.4.7算4.5，4.8.4.9算5 4.2就算4 4.3算4.5
  formatRate:function (score) {
    if(score) {
      const num = score.toString().split('.')[0]
      const point = score.toString().split('.')[1]
      if(point<3){
        return num
      }else if(point<8){
        return num*1+0.5
      }else if(point<10){
        return num*1+1
      }
    }

  }
}
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};

// // 防抖处理
// const on = Vue.prototype.$on
// Vue.prototype.$on = function (event, func) {
//   if (event == 'click') {
//     on.call(this, event, window._.debounce(function(){
//       func.apply(this, arguments)
//     }, 1000, { leading: true, trailing: false }))
//   } else {
//     on.call(this, event, func)
//   }
// }
