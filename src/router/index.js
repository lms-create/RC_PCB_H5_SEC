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
                import('@/views/find/detail.vue')
        },
        {
            path: '/test',
            component: () =>
                import ('@/views/test/index.vue'),
            children: [{
                    path: '/',
                    redirect: '/test/start'
                },
                {
                    path: '/test/start',
                    component: () =>
                        import ('@/views/test/start.vue')
                },
                {
                    path: '/test/answer',
                    component: () =>
                        import ('@/views/test/answer.vue')
                }
            ]

        }
    ]
})