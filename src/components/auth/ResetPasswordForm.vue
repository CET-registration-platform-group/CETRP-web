<template>
  <div class="auth-card" :class="{ 'slide-out': isSliding, 'slide-in': isSlideIn }">
    <div class="auth-inner">
      <div class="auth-header">
        <img src="/src/assets/cet-logo.svg" alt="Logo" class="logo-img">
        <h1 class="title">大学生四六级考试报名系统</h1>
        <h2 class="subtitle">重置密码</h2>
      </div>
      
      <form class="auth-form" @submit.prevent="handleResetPassword">
        <div class="form-section">
          <h3 class="section-title">重置密码</h3>
          
          <div class="form-group">
            <label for="email">电子邮箱 <span class="required">*</span></label>
            <input 
              type="email" 
              id="email" 
              v-model="resetForm.email" 
              class="form-input"
              placeholder="请输入注册时使用的电子邮箱"
              required
            >
            <div class="form-error" v-if="errors.email">{{ errors.email }}</div>
          </div>
          
          <div class="form-group">
            <label for="verificationCode">验证码 <span class="required">*</span></label>
            <div class="verification-code-group">
              <input 
                type="text" 
                id="verificationCode" 
                v-model="resetForm.verificationCode" 
                class="form-input verification-code-input"
                placeholder="请输入验证码"
                required
              >
              <button 
                type="button" 
                class="btn btn-default send-code-btn"
                @click="sendVerificationCode"
                :disabled="loading"
              >
                {{ loading ? '发送中...' : '发送验证码' }}
              </button>
            </div>
            <div class="form-error" v-if="errors.verificationCode">{{ errors.verificationCode }}</div>
          </div>
          
          <div class="form-group">
            <label for="newPassword">新密码 <span class="required">*</span></label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="resetForm.newPassword" 
              class="form-input"
              placeholder="请输入新密码"
              required
              minlength="6"
              maxlength="20"
            >
            <div class="form-hint">密码长度应在6-20个字符之间，且必须包含大小写字母和数字</div>
            <div class="form-error" v-if="errors.newPassword">{{ errors.newPassword }}</div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码 <span class="required">*</span></label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="resetForm.confirmPassword" 
              class="form-input"
              placeholder="请再次输入新密码"
              required
              minlength="6"
              maxlength="20"
            >
            <div class="form-hint">请再次输入新密码以确认</div>
            <div class="form-error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
          </div>
        </div>
        
        <div class="btn-group">
          <button 
            type="submit" 
            class="btn btn-primary btn-block" 
            :disabled="loading"
          >
            重置密码
          </button>
          <button 
            type="button" 
            class="btn btn-default btn-block" 
            @click="goToLogin"
          >
            返回登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { USER_API, request } from '../../config/api.js'

const emit = defineEmits(['switch-to-login'])
const router = useRouter()
const isSliding = ref(false)
const isSlideIn = ref(true)
const loading = ref(false)

onMounted(() => {
  // 初始显示时的入场动画
  setTimeout(() => {
    isSlideIn.value = false
  }, 50)
})

const resetForm = reactive({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

const validateForm = () => {
  let isValid = true
  
  // 重置错误信息
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // 验证邮箱
  if (!resetForm.email) {
    errors.email = '请输入电子邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.email)) {
    errors.email = '请输入有效的电子邮箱'
    isValid = false
  }
  
  // 验证验证码
  if (!resetForm.verificationCode) {
    errors.verificationCode = '请输入验证码'
    isValid = false
  } else if (!/^\d{6}$/.test(resetForm.verificationCode)) {
    errors.verificationCode = '验证码必须是6位数字'
    isValid = false
  }
  
  // 验证新密码
  if (!resetForm.newPassword) {
    errors.newPassword = '请输入新密码'
    isValid = false
  } else if (resetForm.newPassword.length < 6 || resetForm.newPassword.length > 20) {
    errors.newPassword = '密码长度应在6-20个字符之间'
    isValid = false
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/.test(resetForm.newPassword)) {
    errors.newPassword = '密码必须包含大小写字母和数字'
    isValid = false
  }
  
  // 验证确认密码
  if (!resetForm.confirmPassword) {
    errors.confirmPassword = '请再次输入新密码'
    isValid = false
  } else if (resetForm.confirmPassword !== resetForm.newPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }
  
  return isValid
}

const sendVerificationCode = async () => {
  if (!resetForm.email) {
    errors.email = '请先输入邮箱地址'
    return
  }
  
  try {
    loading.value = true
    // 构建查询参数
    const params = new URLSearchParams({
      email: resetForm.email
    })
    
    const response = await request(`${USER_API.SEND_RESET_EMAIL}?${params}`, {
      method: 'POST'
    })

    if (response.code === 200) {
      ElMessage({
        message: response.message || '验证码已发送，请查收邮件',
        type: 'success',
        duration: 3000,
        showClose: true
      })
    } else {
      ElMessage.error(response.message || '发送验证码失败')
    }
  } catch (error) {
    console.error('发送验证码错误:', error.message)
    let errorMessage = '发送验证码失败，请稍后重试'
    
    if (error.message.includes('400')) {
      errorMessage = '邮箱格式不正确'
    } else if (error.message.includes('500')) {
      errorMessage = '服务器内部错误，请稍后重试'
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

const handleResetPassword = async () => {
  if (validateForm()) {
    try {
      loading.value = true
      
      // 构建查询参数
      const params = new URLSearchParams({
        email: resetForm.email,
        code: resetForm.verificationCode,
        newPassword: resetForm.newPassword
      })
      
      const data = await request(`${USER_API.RESET_PASSWORD}?${params}`, {
        method: 'POST'
      })

      if (data.code === 200) {
        ElMessage({
          message: data.message || '密码重置成功！请使用新密码登录',
          type: 'success',
          duration: 3000,
          showClose: true
        })
        
        // 重置成功后跳转到登录页面
        setTimeout(() => {
          goToLogin()
        }, 1000)
      } else {
        ElMessage.error(data.message || '密码重置失败')
      }
    } catch (error) {
      console.error('重置密码错误:', error)
      let errorMessage = '重置密码失败，请稍后重试'
      
      if (error.message.includes('400')) {
        errorMessage = '重置信息有误，请检查后重试'
      } else if (error.message.includes('500')) {
        errorMessage = '服务器内部错误，请稍后重试'
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

const goToLogin = () => {
  isSliding.value = true
  setTimeout(() => {
    emit('switch-to-login')
  }, 400)
}
</script>

<style scoped>
.auth-card {
  display: block;
  width: 650px;
  max-width: 90%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  z-index: 2;
  padding: 0;
  transform: translateX(0);
  opacity: 1;
  max-height: 80vh;
}

/* 创建内部容器来处理滚动 */
.auth-inner {
  padding: 40px;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

/* 添加滚动条样式 */
.auth-inner::-webkit-scrollbar {
  width: 8px;
}

.auth-inner::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.auth-inner::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.auth-inner::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 入场动画 */
.auth-card.slide-in {
  transform: translateX(100%);
  opacity: 0;
}

/* 出场动画 */
.auth-card.slide-out {
  transform: translateX(100%);
  opacity: 0;
}

.auth-header {
  text-align: center;
  margin-bottom: 20px;
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

.subtitle {
  font-size: 18px;
  color: #606266;
  margin: 10px 0 0;
  font-weight: 400;
}

.section-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.form-section {
  margin-bottom: 25px;
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

.required {
  color: #ff3b30;
  margin-left: 2px;
}

.form-input {
  width: 100%;
  height: 42px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  color: #303133;
  transition: all 0.2s;
  background-color: #f9fafc;
}

.form-input:focus {
  border-color: #1867c0;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 103, 192, 0.15);
  background-color: white;
}

.form-error {
  color: #ff3b30;
  font-size: 12px;
  margin-top: 5px;
  min-height: 18px;
}

.form-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.4;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #1867c0;
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(24, 103, 192, 0.2);
}

.btn-primary:hover {
  background-color: #5d99eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(24, 103, 192, 0.25);
}

.btn-primary:active {
  background-color: #0d47a1;
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(24, 103, 192, 0.15);
}

.btn-default {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-default:hover {
  color: #1867c0;
  border-color: #5d99eb;
  background-color: #eef5ff;
}

.btn-block {
  display: block;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 576px) {
  .auth-card {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}

.verification-code-group {
  display: flex;
  gap: 10px;
}

.verification-code-input {
  flex: 1;
}

.send-code-btn {
  white-space: nowrap;
  min-width: 120px;
}

.send-code-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 