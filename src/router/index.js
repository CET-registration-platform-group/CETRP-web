import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Auth
  },
  {
    path: '/register',
    component: Auth
  },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true }
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = localStorage.getItem('user')
  
  if (requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router