<template>
  <div class="auth-card" :class="{ 'slide-out': isSliding, 'slide-in': isSlideIn }">
    <div class="auth-left">
      <div class="auth-header">
        <img src="/src/assets/cet-logo.svg" alt="Logo" class="logo-img">
        <h1 class="title">大学生四六级考试报名系统</h1>
      </div>
      
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="identityDocumentNumber">证件号码</label>
          <div class="input-wrapper">
            <i class="icon-user"></i>
            <input 
              type="text" 
              id="identityDocumentNumber" 
              v-model="loginForm.identityDocumentNumber" 
              placeholder="请输入证件号码"
              required
              minlength="8"
              maxlength="20"
            >
          </div>
          <div class="error-message" v-if="errors.identityDocumentNumber">{{ errors.identityDocumentNumber }}</div>
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <div class="input-wrapper">
            <i class="icon-lock"></i>
            <input 
              type="password" 
              id="password" 
              v-model="loginForm.password" 
              placeholder="请输入密码"
              required
              minlength="6"
              maxlength="20"
            >
          </div>
          <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
        </div>
        
        <div class="form-group">
          <button type="submit" class="auth-btn" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <div class="auth-link">
          <span>还没有账号？</span>
          <a href="javascript:void(0)" @click="goToRegister">立即注册</a>
          <span class="divider">|</span>
          <a href="javascript:void(0)" @click="goToReset">忘记密码？</a>
        </div>
      </form>
    </div>
    
    <div class="auth-right">
      <div class="info-content">
        <h2>欢迎使用</h2>
        <p>大学生四六级考试报名系统为您提供便捷的报名服务</p>
        <ul>
          <li>便捷的报名流程</li>
          <li>实时的考试信息</li>
          <li>安全的支付系统</li>
          <li>快速的成绩查询</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { USER_API, request } from '../../config/api.js'

const emit = defineEmits(['switch-to-register', 'switch-to-reset'])
const router = useRouter()
const isSliding = ref(false)
const isSlideIn = ref(true)
const loading = ref(false)

onMounted(() => {
  // 初始显示时的入场动画
  setTimeout(() => {
    isSlideIn.value = false
  }, 50)
  
  // 尝试从localStorage加载上次成功登录的证件号码
  const lastIdentityDocumentNumber = localStorage.getItem('lastIdentityDocumentNumber')
  if (lastIdentityDocumentNumber) {
    loginForm.identityDocumentNumber = lastIdentityDocumentNumber
  }
})

const loginForm = reactive({
  identityDocumentNumber: '',
  password: ''
})

const errors = reactive({
  identityDocumentNumber: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.identityDocumentNumber = ''
  errors.password = ''
  
  if (!loginForm.identityDocumentNumber) {
    errors.identityDocumentNumber = '请输入证件号码'
    isValid = false
  } else if (loginForm.identityDocumentNumber.length < 8 || loginForm.identityDocumentNumber.length > 20) {
    errors.identityDocumentNumber = '证件号码长度应在8-20个字符之间'
    isValid = false
  }
  
  if (!loginForm.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (loginForm.password.length < 6 || loginForm.password.length > 20) {
    errors.password = '密码长度应在6-20个字符之间'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (validateForm()) {
    try {
      loading.value = true
      
      // 根据API文档，使用POST请求，参数通过query传递
      const params = new URLSearchParams()
      
      // 只添加非空的参数
      if (loginForm.identityDocumentNumber && loginForm.identityDocumentNumber.trim()) {
        params.append('identityDocumentNumber', loginForm.identityDocumentNumber.trim())
      }
      
      if (loginForm.password && loginForm.password.trim()) {
        params.append('password', loginForm.password.trim())
      }
      
      // 调试信息
      console.log('发送的参数:', {
        identityDocumentNumber: loginForm.identityDocumentNumber,
        password: loginForm.password ? '***' : 'empty'
      })
      console.log('构建的URL参数:', params.toString())
      
      const data = await request(`${USER_API.LOGIN}?${params}`, {
        method: 'POST'
      })

      if (data.code === 200) {
        // 登录成功，保存用户信息和token
        const { token, user } = data.data
        
        // 调试信息
        console.log('登录成功，用户信息:', user)
        console.log('Token:', token)
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // 保存上次成功登录的证件号码
        localStorage.setItem('lastIdentityDocumentNumber', loginForm.identityDocumentNumber)
        
        ElMessage({
          message: data.message || '登录成功',
          type: 'success',
          duration: 3000,
          showClose: true
        })
        
        // 登录成功后根据当前步骤跳转到相应界面
        setTimeout(async () => {
          try {
            // 导入报名服务和步骤常量
            const { registrationService, REGISTRATION_STEPS } = await import('../../services/registrationService.js')
            
            // 获取用户的报名信息
            await registrationService.getRegistrationInfo(user.id)
            
            // 调试日志：检查 completedSteps 的类型和内容
            console.log('LoginForm: completedSteps 类型:', typeof registrationService.completedSteps)
            console.log('LoginForm: completedSteps 内容:', registrationService.completedSteps)
            console.log('LoginForm: completedSteps 长度:', registrationService.completedSteps.length)
            console.log('LoginForm: currentStep:', registrationService.currentStep)

            let redirectToPath = '/home/agreement' // 默认跳转到协议页面
            
            // 如果当前步骤为完成报名，直接跳转到完成报名界面
            if (registrationService.currentStep === REGISTRATION_STEPS.COMPLETE) {
              redirectToPath = '/home/complete'
              console.log('登录后当前步骤为完成报名，直接跳转到完成报名界面:', redirectToPath)
            }
            // 如果已完成步骤为空，强制跳转到报名协议页面
            else if (registrationService.completedSteps.length === 0) {
              console.log('登录后已完成步骤为空，强制跳转到报名协议页面:', redirectToPath)
            } else {
              // 否则，根据当前步骤或下一个步骤进行跳转
              const nextStepConfig = registrationService.getNextStep()
              if (nextStepConfig) {
                redirectToPath = nextStepConfig.path
                console.log('登录后跳转到下一个步骤:', redirectToPath)
              } else {
                // 如果没有下一个步骤（所有步骤已完成），跳转到完成页面
                redirectToPath = '/home/complete'
                console.log('登录后所有步骤已完成，跳转到完成页面:', redirectToPath)
              }
            }
            
            // 跳转到目标页面
            router.push(redirectToPath)
          } catch (error) {
            console.error('获取报名信息失败，跳转到默认页面:', error)
            
            // 如果获取报名信息失败，说明是新用户，跳转到第一步
            router.push('/home/agreement')
          }
        }, 500)
      } else {
        ElMessage({
          message: '证件号码或密码错误',
          type: 'error',
          duration: 3000,
          showClose: true
        })
      }
    } catch (error) {
      console.error('登录失败:', error)
      let errorMessage = '登录失败，请稍后重试'
      
      if (error.message.includes('400')) {
        errorMessage = '证件号码或密码错误'
      } else if (error.message.includes('401')) {
        errorMessage = '未授权访问'
      } else if (error.message.includes('403')) {
        errorMessage = '访问被禁止'
      } else if (error.message.includes('404')) {
        errorMessage = '接口不存在'
      } else if (error.message.includes('500')) {
        errorMessage = '服务器内部错误'
      }
      
      ElMessage({
        message: errorMessage,
        type: 'error',
        duration: 3000,
        showClose: true
      })
    } finally {
      loading.value = false
    }
  }
}

const goToRegister = () => {
  isSliding.value = true
  setTimeout(() => {
    emit('switch-to-register')
  }, 400)
}

const goToReset = () => {
  isSliding.value = true
  setTimeout(() => {
    emit('switch-to-reset')
  }, 400)
}
</script>

<style scoped>
.auth-card {
  display: flex;
  width: 900px;
  max-width: 90%;
  min-height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  z-index: 2;
  transform: translateX(0);
  opacity: 1;
}

/* 入场动画 */
.auth-card.slide-in {
  transform: translateX(-100%);
  opacity: 0;
}

/* 出场动画 */
.auth-card.slide-out {
  transform: translateX(-100%);
  opacity: 0;
}

.auth-left {
  flex: 1;
  padding: 40px;
  background-color: white;
}

.auth-right {
  width: 40%;
  background: linear-gradient(135deg, #1867c0 0%, #0d47a1 100%);
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  border-radius: 0;
}

/* 其余样式保持不变 */
.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-img {
  height: 60px;
  margin-bottom: 15px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.title {
  font-size: 24px;
  color: #1867c0;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.auth-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #606266;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: all 0.2s;
  background-color: #f9fafc;
  overflow: hidden;
}

.input-wrapper:focus-within {
  border-color: #1867c0;
  box-shadow: 0 0 0 2px rgba(24, 103, 192, 0.15);
  background-color: white;
}

.input-wrapper i {
  width: 20px;
  height: 20px;
  margin: 0 12px;
  color: #909399;
}

.icon-user {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231867c0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-lock {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231867c0"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

input {
  flex: 1;
  height: 42px;
  padding: 0 15px 0 0;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #303133;
  outline: none;
}

.error-message {
  color: #ff3b30;
  font-size: 12px;
  margin-top: 5px;
  min-height: 18px;
}

.auth-btn {
  width: 100%;
  height: 44px;
  background-color: #1867c0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(24, 103, 192, 0.2);
}

.auth-btn:hover {
  background-color: #5d99eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(24, 103, 192, 0.25);
}

.auth-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(24, 103, 192, 0.15);
}

.auth-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-btn:disabled:hover {
  background-color: #c0c4cc;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-link {
  text-align: center;
  font-size: 14px;
  color: #606266;
  margin-top: 15px;
}

.auth-link a {
  color: #1867c0;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
  transition: all 0.2s;
}

.auth-link a:hover {
  color: #5d99eb;
  text-decoration: underline;
}

.auth-link .divider {
  margin: 0 10px;
  color: #909399;
}

.info-content {
  text-align: center;
  position: relative;
  z-index: 5;
}

.info-content h2 {
  font-size: 28px;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-content p {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.6;
}

.info-content ul {
  text-align: left;
  padding-left: 20px;
  list-style-type: none;
}

.info-content li {
  margin-bottom: 15px;
  font-size: 15px;
  position: relative;
  padding-left: 25px;
}

.info-content li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: white;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card {
    flex-direction: column;
  }
  
  .auth-right {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-left {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
}
</style> 