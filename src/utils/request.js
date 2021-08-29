import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import router from '@/router'
const TokenKey = 'lms-create-admin'
import Cookies from 'js-cookie'
// const token = ''
// console.log(constant,'sss');
// 创建axios实例
const service = axios.create({
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 30000 // 请求超时
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    // if (store.getters.token) {
      // 让每个请求携带token
      // ['X-Token'] 是一个自定义标题键
      // 请根据实际情况进行修改
    //   config.headers['X-Token'] = getToken()
    // }
    const data = JSON.parse(sessionStorage.getItem('managerInfo'))
    const token = data ? data.token : ''
    if (token) {
      config.headers['Authorization'] = token
    }
    // config.url = config.url.indexOf('http://') > -1 ? config.url : 'http://' + config.url
    // config.url = config.url.indexOf('/api') > -1 ? config.url : '/api' + config.url
    return config
  },
  (error) => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，如标题或状态
   * 请返回response=>response
   */

  /**
    *通过自定义代码确定请求状态
    *这里只是一个例子
    *您还可以通过HTTP状态代码来判断状态
    */
  (response) => {
    if (response.data.retcode === 401 || response.data.retcode === 5002 || response.data.retcode === 5003 || response.data.retcode === 5004) {
      Message({
        message: response.data.msg.prompt,
        type: 'error',
        duration: 5 * 1000
      })
      Cookies.remove(TokenKey)
      sessionStorage.clear()
      // store.commit('user/SET_TOKEN', null, { root: true })
      // store.commit('user/SET_NAME', null, { root: true })
      router.push('/login?redirect=/index')
    } else {
      // 接口正常时，访问接口，则延长token时长-------有用户信息则延长，如果一直延长的话，接口调用的时候----------改成24小时
      // if (store.getters.token) {
      //   var millisecond = new Date().getTime()
      //   Cookies.set(TokenKey, store.getters.token, { expires: new Date(millisecond + 60 * 1000 * 60 * 24) })
      // }
    }
    return response.data
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
