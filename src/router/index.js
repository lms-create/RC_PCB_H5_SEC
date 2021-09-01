import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'Home',
            component: () =>
                import ('@/views/home/index.vue')
        },
        {
            path: '/find',
            name: 'Find',
            component: () =>
                import ('@/views/find/index.vue')
        },
        {
            path: '/find/detail',
            name: 'FindDetail',
            component: () =>
                import ('@/views/find/detail.vue')
        },
        {
            path: '/test/answer',
            name: 'TestAnswer',
            component: () =>
                import ('@/views/test/answer.vue')

        },
        {
            path: '/test',
            name: 'TestStart',
            component: () =>
                import ('@/views/test/start.vue')

        }, {
            path: '/test/index',
            name: 'TestIndex',
            component: () =>
                import ('@/views/test/index.vue')

        }
    ]
})