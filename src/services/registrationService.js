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
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到登录令牌')
      }

      const response = await fetch(`http://localhost:8080/api/student/registration/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.code === 200) {
        this.registrationInfo = data.data
        this.completedSteps = data.data.completedSteps || []
        this.currentStep = data.data.currentStep
        return data.data
      } else if (data.code === 404) {
        // 报名信息不存在，初始化新用户的报名信息
        console.log('新用户，初始化报名信息')
        this.registrationInfo = {
          studentId: studentId,
          completedSteps: [],
          currentStep: 'AGREEMENT'
        }
        this.completedSteps = []
        this.currentStep = 'AGREEMENT'
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
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到登录令牌')
      }

      const response = await fetch('http://localhost:8080/api/student/registration/complete-step', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: studentId,
          completedStep: completedStep
        })
      })

      const data = await response.json()
      
      if (data.code === 200) {
        // 更新本地状态
        if (!this.completedSteps.includes(completedStep)) {
          this.completedSteps.push(completedStep)
        }
        this.currentStep = data.data.currentStep
        return data.data
      } else {
        throw new Error(data.message || '完成步骤失败')
      }
    } catch (error) {
      console.error('完成步骤失败:', error)
      throw error
    }
  }

  // 检查步骤是否可访问
  isStepAccessible(stepKey) {
    if (!this.completedSteps || this.completedSteps.length === 0) {
      // 如果没有完成的步骤，只能访问第一步
      return stepKey === REGISTRATION_STEPS.AGREEMENT
    }

    // 检查是否已完成前一步骤
    const stepOrder = Object.values(REGISTRATION_STEPS)
    const currentStepIndex = stepOrder.indexOf(this.currentStep)
    const targetStepIndex = stepOrder.indexOf(stepKey)

    // 可以访问当前步骤或下一步骤
    return targetStepIndex <= currentStepIndex + 1
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

  // 重置报名信息
  reset() {
    this.registrationInfo = null
    this.completedSteps = []
    this.currentStep = null
  }
}

// 创建单例实例
export const registrationService = new RegistrationService() 