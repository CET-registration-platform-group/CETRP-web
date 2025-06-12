import { REGISTRATION_API, request } from '../config/api.js'

// 报名步骤常量
export const REGISTRATION_STEPS = {
  AGREEMENT: 'AGREEMENT',
  QUAL_QUERY: 'QUAL_QUERY',
  QUAL_CONFIRM: 'QUAL_CONFIRM',
  WRITTEN_APPLY: 'WRITTEN_APPLY',
  WRITTEN_PAY: 'WRITTEN_PAY',
  ORAL_APPLY: 'ORAL_APPLY',
  ORAL_PAY: 'ORAL_PAY',
  COMPLETE: 'COMPLETE',
  PRINT_ADMIT: 'PRINT_ADMIT'
}

// 报名步骤配置
const STEP_CONFIG = {
  [REGISTRATION_STEPS.AGREEMENT]: {
    path: '/home/agreement',
    title: '报名协议',
    step: 1
  },
  [REGISTRATION_STEPS.QUAL_QUERY]: {
    path: '/home/qualification',
    title: '资格信息查询',
    step: 2
  },
  [REGISTRATION_STEPS.QUAL_CONFIRM]: {
    path: '/home/confirm-info',
    title: '资格信息确认',
    step: 3
  },
  [REGISTRATION_STEPS.WRITTEN_APPLY]: {
    path: '/home/written-exam',
    title: '笔试报考',
    step: 4
  },
  [REGISTRATION_STEPS.WRITTEN_PAY]: {
    path: '/home/written-payment',
    title: '笔试缴费',
    step: 5
  },
  [REGISTRATION_STEPS.ORAL_APPLY]: {
    path: '/home/oral-exam',
    title: '口试报考',
    step: 6
  },
  [REGISTRATION_STEPS.ORAL_PAY]: {
    path: '/home/oral-payment',
    title: '口试缴费',
    step: 7
  },
  [REGISTRATION_STEPS.COMPLETE]: {
    path: '/home/complete',
    title: '完成报名',
    step: 8
  },
  [REGISTRATION_STEPS.PRINT_ADMIT]: {
    path: '/home/print-ticket',
    title: '打印准考证',
    step: 9
  }
}

// 报名服务类
class RegistrationService {
  constructor() {
    this.registrationInfo = null
    this.completedSteps = []
    this.currentStep = null
  }

  // 获取报名信息
  async getRegistrationInfo(studentId) {
    if (!studentId || isNaN(studentId)) {
      console.error('学生 ID 无效');
      throw new Error('学生 ID 无效');
    }
    try {
      const data = await request(REGISTRATION_API.GET_INFO(studentId))
      
      if (data.code === 200) {
        this.registrationInfo = data.data
        // 从后台返回的数据中解析已完成的步骤和当前步骤
        // 确保 completedSteps 是一个数组，即使后端返回的是字符串 '[]'
        try {
          this.completedSteps = JSON.parse(data.data.completedSteps || '[]')
        } catch (e) {
          console.error('解析 completedSteps 失败，使用默认空数组:', e)
          this.completedSteps = []
        }
        this.currentStep = data.data.currentStep || REGISTRATION_STEPS.AGREEMENT
        return data.data
      } else if (data.code === 404) {
        // 报名信息不存在，初始化新用户的报名信息
        console.log('新用户，初始化报名信息')
        this.registrationInfo = {
          studentId: studentId,
          completedSteps: [],
          currentStep: REGISTRATION_STEPS.AGREEMENT
        }
        this.completedSteps = []
        this.currentStep = REGISTRATION_STEPS.AGREEMENT
        return this.registrationInfo
      } else {
        throw new Error(data.message || '获取报名信息失败')
      }
    } catch (error) {
      console.error('获取报名信息失败:', error)
      throw error
    }
  }

  // 完成当前步骤
  async completeStep(studentId, completedStep) {
    try {
      console.log('发送完成步骤请求:', {
        studentId: studentId,
        completedStep: completedStep
      })
      
      // 构建查询参数
      const params = new URLSearchParams({
        studentId: studentId.toString(),
        completedStep: completedStep
      })
      
      const data = await request(`${REGISTRATION_API.COMPLETE_STEP}?${params}`, {
        method: 'POST'
      })
      
      if (data.code === 200) {
        // 完成步骤后，重新获取最新的报名信息
        await this.getRegistrationInfo(studentId)
        return data.data
      } else {
        throw new Error(data.message || '完成步骤失败')
      }
    } catch (error) {
      console.error('完成步骤失败:', error)
      console.error('请求详情:', {
        url: `${REGISTRATION_API.COMPLETE_STEP}?studentId=${studentId}&completedStep=${completedStep}`,
        method: 'POST'
      })
      throw error
    }
  }

  // 检查步骤是否可访问 - 根据后台返回的报名状态判断
  isStepAccessible(stepKey) {
    // 调试日志：isStepAccessible 内部状态
    console.log('isStepAccessible: 检查步骤', stepKey)
    console.log('isStepAccessible: 当前步骤 (this.currentStep):', this.currentStep)
    console.log('isStepAccessible: 已完成步骤 (this.completedSteps):', this.completedSteps)

    // 如果没有报名信息，只能访问第一步
    if (!this.registrationInfo) {
      return stepKey === REGISTRATION_STEPS.AGREEMENT
    }

    // 获取步骤顺序
    const stepOrder = Object.values(REGISTRATION_STEPS)
    const currentStepIndex = stepOrder.indexOf(this.currentStep)
    const targetStepIndex = stepOrder.indexOf(stepKey)

    // 调试日志：索引值
    console.log('isStepAccessible: currentStepIndex:', currentStepIndex)
    console.log('isStepAccessible: targetStepIndex:', targetStepIndex)

    // 可以访问已完成的步骤、当前步骤或下一步骤
    // 1. 如果目标步骤已经完成，可以访问
    if (this.completedSteps.includes(stepKey)) {
      return true
    }
    
    // 2. 可以访问当前步骤
    if (stepKey === this.currentStep) {
      return true
    }
    
    // 3. 可以访问下一步骤
    if (targetStepIndex === currentStepIndex + 1) {
      return true
    }

    return false
  }

  // 检查页面访问性并返回正确的跳转路径
  checkPageAccessibility(currentPath) {
    // 根据路径找到对应的步骤
    const stepKey = Object.keys(STEP_CONFIG).find(key => 
      STEP_CONFIG[key].path === currentPath
    )
    
    if (!stepKey) {
      // 如果找不到对应的步骤，返回第一步
      return {
        accessible: false,
        redirectPath: STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT].path,
        message: '页面路径无效，请从第一步开始'
      }
    }

    // 如果获取到的已完成步骤为空，不管当前步骤，直接跳转到报名协议界面
    if (this.completedSteps && this.completedSteps.length === 0) {
      if (stepKey === REGISTRATION_STEPS.AGREEMENT) {
        return {
          accessible: true,
          redirectPath: null,
          message: null
        }
      } else {
        return {
          accessible: false,
          redirectPath: STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT].path,
          message: `请先完成${STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT].title}`
        }
      }
    }
    
    // 检查当前步骤是否可访问
    if (this.isStepAccessible(stepKey)) {
      return {
        accessible: true,
        redirectPath: null,
        message: null
      }
    }

    // 如果不可访问，找到应该跳转到的页面
    // 跳转到当前步骤的下一个页面
    if (this.currentStep) {
      const stepOrder = Object.values(REGISTRATION_STEPS)
      const currentIndex = stepOrder.indexOf(this.currentStep)
      const nextStepKey = stepOrder[currentIndex + 1]
      
      if (nextStepKey) {
        const nextStepConfig = STEP_CONFIG[nextStepKey]
        return {
          accessible: false,
          redirectPath: nextStepConfig.path,
          message: `请先完成${nextStepConfig.title}`
        }
      } else {
        // 如果没有下一步，跳转到当前步骤
        const currentStepConfig = STEP_CONFIG[this.currentStep]
        return {
          accessible: false,
          redirectPath: currentStepConfig.path,
          message: `请先完成${currentStepConfig.title}`
        }
      }
    }

    // 如果没有当前步骤，跳转到第一步
    return {
      accessible: false,
      redirectPath: STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT].path,
      message: `请先完成${STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT].title}`
    }
  }

  // 获取当前步骤配置
  getCurrentStepConfig() {
    if (!this.currentStep) {
      return STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT]
    }
    return STEP_CONFIG[this.currentStep] || STEP_CONFIG[REGISTRATION_STEPS.AGREEMENT]
  }

  // 获取下一步骤
  getNextStep() {
    if (!this.currentStep) {
      return STEP_CONFIG[REGISTRATION_STEPS.QUAL_QUERY]
    }

    const stepOrder = Object.values(REGISTRATION_STEPS)
    const currentIndex = stepOrder.indexOf(this.currentStep)
    const nextStepKey = stepOrder[currentIndex + 1]

    return nextStepKey ? STEP_CONFIG[nextStepKey] : null
  }

  // 获取所有步骤配置
  getAllStepConfig() {
    return STEP_CONFIG
  }

  // 获取当前报名状态
  getCurrentRegistrationStatus() {
    return {
      registrationInfo: this.registrationInfo,
      completedSteps: this.completedSteps,
      currentStep: this.currentStep
    }
  }

  // 重置报名信息
  reset() {
    this.registrationInfo = null
    this.completedSteps = []
    this.currentStep = null
  }
}

// 创建单例实例
export const registrationService = new RegistrationService() 