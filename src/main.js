// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/style/common.less' // global css
import less from 'less'
import common from '@/assets/script/common'
import "../static/iconfont.css"

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(less);
window.$common = common
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})