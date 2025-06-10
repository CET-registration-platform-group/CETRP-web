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
    path: '/reset-password',
    component: Auth
  },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/home/agreement'
      },
      {
        path: 'agreement',
        name: 'Agreement',
        component: () => import('../views/home/Agreement.vue'),
        meta: { title: '报名协议', step: 1, stepKey: 'AGREEMENT' }
      },
      {
        path: 'qualification',
        name: 'Qualification',
        component: () => import('../views/home/Qualification.vue'),
        meta: { title: '资格信息查询', step: 2, stepKey: 'QUAL_QUERY' }
      },
      {
        path: 'confirm-info',
        name: 'ConfirmInfo',
        component: () => import('../views/home/ConfirmInfo.vue'),
        meta: { title: '资格信息确认', step: 3, stepKey: 'QUAL_CONFIRM' }
      },
      {
        path: 'written-exam',
        name: 'WrittenExam',
        component: () => import('../views/home/WrittenExam.vue'),
        meta: { title: '笔试报考', step: 4, stepKey: 'WRITTEN_APPLY' }
      },
      {
        path: 'written-payment',
        name: 'WrittenPayment',
        component: () => import('../views/home/WrittenPayment.vue'),
        meta: { title: '笔试缴费', step: 5, stepKey: 'WRITTEN_PAY' }
      },
      {
        path: 'oral-exam',
        name: 'OralExam',
        component: () => import('../views/home/OralExam.vue'),
        meta: { title: '口试报考', step: 6, stepKey: 'ORAL_APPLY' }
      },
      {
        path: 'oral-payment',
        name: 'OralPayment',
        component: () => import('../views/home/OralPayment.vue'),
        meta: { title: '口试缴费', step: 7, stepKey: 'ORAL_PAY' }
      },
      {
        path: 'complete',
        name: 'Complete',
        component: () => import('../views/home/Complete.vue'),
        meta: { title: '完成报名', step: 8, stepKey: 'COMPLETE' }
      },
      {
        path: 'print-ticket',
        name: 'PrintTicket',
        component: () => import('../views/home/PrintTicket.vue'),
        meta: { title: '打印准考证', step: 9, stepKey: 'PRINT_ADMIT' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = localStorage.getItem('user')
  
  if (requiresAuth && !user) {
    next('/login')
    return
  }
  
  // 如果是需要认证的页面，检查步骤权限
  if (requiresAuth && to.meta.stepKey) {
    try {
      const userInfo = JSON.parse(user)
      
      // 检查用户信息是否包含id
      if (!userInfo.id) {
        console.error('用户信息中缺少id:', userInfo)
        next('/login')
        return
      }
      
      const { registrationService } = await import('../services/registrationService.js')
      
      try {
        // 获取报名信息，使用id作为studentId
        await registrationService.getRegistrationInfo(userInfo.id)
        
        // 检查当前路由是否可访问
        const isAccessible = registrationService.isStepAccessible(to.meta.stepKey)
        
        if (!isAccessible) {
          // 如果不可访问，跳转到当前可访问的步骤
          const currentStepConfig = registrationService.getCurrentStepConfig()
          next(currentStepConfig.path)
          return
        }
      } catch (error) {
        // 如果报名信息不存在，说明是新用户，允许访问第一步
        if (error.message === '报名信息不存在') {
          console.log('新用户，允许访问第一步')
          // 新用户可以访问第一步（报名协议）
          if (to.meta.stepKey === 'AGREEMENT') {
            next()
            return
          } else {
            // 如果不是第一步，跳转到第一步
            next('/home/agreement')
            return
          }
        } else {
          // 其他错误，跳转到登录页面
          console.error('获取报名信息失败:', error)
          next('/login')
          return
        }
      }
    } catch (error) {
      console.error('路由权限检查失败:', error)
      // 如果获取报名信息失败，跳转到登录页面而不是第一步，避免无限循环
      next('/login')
      return
    }
  }
  
  next()
})

export default router