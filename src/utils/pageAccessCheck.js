import { registrationService } from '../services/registrationService.js'
import { ElMessage } from 'element-plus'

/**
 * 检查页面访问性并处理跳转
 * @param {string} currentPath - 当前页面路径
 * @param {Function} router - Vue Router实例
 * @param {string} studentId - 学生ID
 * @returns {Promise<boolean>} - 返回true表示页面可访问，false表示已跳转
 */
export async function checkPageAccess(currentPath, router, studentId) {
  try {
    // 获取报名信息
    await registrationService.getRegistrationInfo(studentId)
    
    // 检查页面访问性
    const accessResult = registrationService.checkPageAccessibility(currentPath)
    
    // 添加调试日志
    console.log('页面访问检查结果:', {
      currentPath,
      studentId,
      currentStep: registrationService.currentStep,
      completedSteps: registrationService.completedSteps,
      accessResult
    })
    
    if (!accessResult.accessible) {
      // 显示提示信息
      ElMessage.warning(accessResult.message)
      
      // 跳转到正确的页面
      setTimeout(() => {
        console.log('跳转到页面:', accessResult.redirectPath)
        router.push(accessResult.redirectPath)
      }, 1000)
      
      return false
    }
    
    return true
  } catch (error) {
    console.error('页面访问检查失败:', error)
    ElMessage.error('页面访问检查失败，请重新登录')
    router.push('/login')
    return false
  }
}

/**
 * 获取用户信息
 * @returns {Object|null} - 用户信息对象或null
 */
export function getUserInfo() {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
} 