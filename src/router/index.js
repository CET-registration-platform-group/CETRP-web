import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import Home from '../views/Home.vue'
import { ElMessage } from 'element-plus'

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
        redirect: (to) => {
          // 动态重定向到用户当前步骤
          const user = localStorage.getItem('user')
          if (user) {
            try {
              const userInfo = JSON.parse(user)
              // 这里先重定向到agreement，实际的重定向逻辑在路由守卫中处理
              return '/home/agreement'
            } catch (error) {
              console.error('解析用户信息失败:', error)
              return '/home/agreement'
            }
          }
          return '/home/agreement'
        }
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
  
  // 如果是需要认证的页面
  if (requiresAuth) {
    try {
      const userInfo = JSON.parse(user)
      
      // 检查用户信息是否包含id（作为studentId使用）
      if (!userInfo.id) {
        console.error('用户信息中缺少id:', userInfo)
        next('/login')
        return
      }
      
      // 导入报名服务
      const { registrationService } = await import('../services/registrationService.js')
      
      try {
        // 获取报名信息，使用id作为studentId。这一步会更新 registrationService 的 currentStep 和 completedSteps。
        await registrationService.getRegistrationInfo(userInfo.id)
        
        // 调试日志：检查 registrationService 的状态
        // console.log('路由守卫: registrationService.currentStep:', registrationService.currentStep)
        // console.log('路由守卫: registrationService.completedSteps:', registrationService.completedSteps)
        // console.log('路由守卫: 目标 path:', to.path)

        // 使用 registrationService 的 checkPageAccessibility 统一处理页面访问逻辑
        const accessResult = registrationService.checkPageAccessibility(to.path)

        if (!accessResult.accessible) {
          // console.log('路由守卫: 页面不可访问，将跳转到:', accessResult.redirectPath, '消息:', accessResult.message)
          // 显示提示信息
          ElMessage.warning(accessResult.message)
          next(accessResult.redirectPath)
          return
        }

      } catch (error) {
        // console.error('路由守卫: 获取报名信息失败或权限检查异常:', error)
        
        // 如果是404错误（报名信息不存在），并且尝试访问的不是协议页面，则重定向到协议页面。
        // 如果是协议页面，则允许访问。
        if (error.message.includes('404') || error.message.includes('报名信息不存在')) {
          // console.log('路由守卫: 新用户或报名信息不存在，允许访问第一步')
          // 如果尝试访问的是 /home 或 /home/agreement，则允许通过
          if (to.path === '/home' || to.path === '/home/agreement') {
            next()
            return
          } else {
            // 否则重定向到协议页面
            // console.log('路由守卫: 尝试访问非协议页面，但报名信息不存在，重定向到协议页面')
            ElMessage.error('报名信息不存在，请从第一步开始报名')
            next('/home/agreement')
            return
          }
        } else {
          // 其他错误，尝试重新获取用户信息或跳转到登录页面
          // console.error('路由守卫: 获取报名信息失败，可能是网络问题:', error)
          ElMessage.error('获取报名信息失败，请检查网络或重新登录')
          next('/login') // 对于关键错误，重定向到登录页
          return
        }
      }
    } catch (error) {
      console.error('路由权限检查失败 (用户信息解析或导入服务失败):', error)
      ElMessage.error('身份验证失败，请重新登录')
      next('/login')
      return
    }
  }

  next() // 允许访问，如果不需要认证或者通过了所有认证检查
})

export default router