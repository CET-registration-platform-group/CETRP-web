import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/registration',
    component: () => import('../views/RegistrationLayout.vue'),
    children: [
      {
        path: 'agreement',
        name: 'Agreement',
        component: () => import('../views/registration/Agreement.vue'),
        meta: { title: '报名协议', step: 1 }
      },
      {
        path: 'qualification',
        name: 'Qualification',
        component: () => import('../views/registration/Qualification.vue'),
        meta: { title: '资格信息查询', step: 2 }
      },
      {
        path: 'confirm-info',
        name: 'ConfirmInfo',
        component: () => import('../views/registration/ConfirmInfo.vue'),
        meta: { title: '资格信息确认', step: 3 }
      },
      {
        path: 'written-exam',
        name: 'WrittenExam',
        component: () => import('../views/registration/WrittenExam.vue'),
        meta: { title: '笔试报考', step: 4 }
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('../views/registration/Payment.vue'),
        meta: { title: '缴费', step: 5 }
      },
      {
        path: 'oral-exam',
        name: 'OralExam',
        component: () => import('../views/registration/OralExam.vue'),
        meta: { title: '口试报考', step: 6 }
      },
      {
        path: 'complete',
        name: 'Complete',
        component: () => import('../views/registration/Complete.vue'),
        meta: { title: '完成报名', step: 7 }
      },
      {
        path: 'print-ticket',
        name: 'PrintTicket',
        component: () => import('../views/registration/PrintTicket.vue'),
        meta: { title: '打印准考证', step: 8 }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问的不是登录或注册页面，且没有登录，则重定向到登录页面
  const isAuthenticated = localStorage.getItem('user')
  if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router