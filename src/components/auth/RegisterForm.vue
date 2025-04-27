<template>
  <div class="auth-card" :class="{ 'slide-out': isSliding, 'slide-in': isSlideIn }">
    <div class="auth-inner">
      <div class="auth-header">
        <img src="/src/assets/cet-logo.svg" alt="Logo" class="logo-img">
        <h1 class="title">大学生四六级考试报名系统</h1>
        <h2 class="subtitle">用户注册</h2>
      </div>
      
      <form class="auth-form" @submit.prevent="handleRegister">
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">账号信息</h3>
          
          <div class="form-group">
            <label for="studentId">学号 <span class="required">*</span></label>
            <input 
              type="text" 
              id="studentId" 
              v-model="registerForm.studentId" 
              class="form-input"
              placeholder="请输入学号"
              required
              minlength="8"
              maxlength="20"
            >
            <div class="form-error" v-if="errors.studentId">{{ errors.studentId }}</div>
          </div>
          
          <div class="form-group">
            <label for="email">电子邮箱 <span class="required">*</span></label>
            <input 
              type="email" 
              id="email" 
              v-model="registerForm.email" 
              class="form-input"
              placeholder="请输入电子邮箱"
              required
            >
            <div class="form-error" v-if="errors.email">{{ errors.email }}</div>
          </div>
          
          <div class="form-group">
            <label for="phone">手机号 <span class="required">*</span></label>
            <input 
              type="tel" 
              id="phone" 
              v-model="registerForm.phone" 
              class="form-input"
              placeholder="请输入手机号"
              required
            >
            <div class="form-hint">邮箱和手机号用于重置密码，请务必填写正确</div>
            <div class="form-error" v-if="errors.phone">{{ errors.phone }}</div>
          </div>
          
          <div class="form-group">
            <label for="password">密码 <span class="required">*</span></label>
            <input 
              type="password" 
              id="password" 
              v-model="registerForm.password" 
              class="form-input"
              placeholder="请输入密码"
              required
              minlength="6"
              maxlength="20"
            >
            <div class="form-error" v-if="errors.password">{{ errors.password }}</div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码 <span class="required">*</span></label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="registerForm.confirmPassword" 
              class="form-input"
              placeholder="请再次输入密码"
              required
              minlength="6"
              maxlength="20"
            >
            <div class="form-hint">密码长度为6-18个字符，且必须同时包含：字母、数字和特殊符号(@$%^&*_-.)</div>
            <div class="form-error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
          </div>
        </div>
        
        <!-- 个人信息 -->
        <div class="form-section">
          <h3 class="section-title">个人信息</h3>
          
          <div class="form-group">
            <label for="idType">证件类型 <span class="required">*</span></label>
            <select 
              id="idType" 
              v-model="registerForm.idType" 
              class="form-input"
              required
            >
              <option value="" disabled selected>--请选择证件类型--</option>
              <option value="身份证">身份证</option>
              <option value="护照">护照</option>
              <option value="港澳通行证">港澳通行证</option>
              <option value="台湾通行证">台湾通行证</option>
              <option value="其他">其他</option>
            </select>
            <div class="form-error" v-if="errors.idType">{{ errors.idType }}</div>
          </div>
          
          <div class="form-group">
            <label for="idNumber">证件号码 <span class="required">*</span></label>
            <input 
              type="text" 
              id="idNumber" 
              v-model="registerForm.idNumber" 
              class="form-input"
              placeholder="请输入证件号码"
              required
            >
            <div class="form-hint">系统将通过证件号码自动关联您的学校和院系信息</div>
            <div class="form-error" v-if="errors.idNumber">{{ errors.idNumber }}</div>
          </div>
          
          <div class="form-group">
            <label for="name">姓名 <span class="required">*</span></label>
            <input 
              type="text" 
              id="name" 
              v-model="registerForm.name" 
              class="form-input"
              placeholder="请输入姓名"
              required
            >
            <div class="form-error" v-if="errors.name">{{ errors.name }}</div>
          </div>
        </div>
        
        <div class="btn-group">
          <button type="submit" class="btn btn-primary btn-block">注册</button>
          <button type="button" class="btn btn-default btn-block" @click="goToLogin">返回登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['switch-to-login'])
const router = useRouter()
const isSliding = ref(false)
const isSlideIn = ref(true)

onMounted(() => {
  // 初始显示时的入场动画
  setTimeout(() => {
    isSlideIn.value = false
  }, 50)
})

const registerForm = reactive({
  studentId: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  idType: '',
  idNumber: '',
  name: ''
})

const errors = reactive({
  studentId: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  idType: '',
  idNumber: '',
  name: ''
})

const validateForm = () => {
  let isValid = true
  
  // 重置所有错误信息
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // 验证学号
  if (!registerForm.studentId) {
    errors.studentId = '请输入学号'
    isValid = false
  } else if (registerForm.studentId.length < 8 || registerForm.studentId.length > 20) {
    errors.studentId = '学号长度应在8-20个字符之间'
    isValid = false
  }
  
  // 验证邮箱
  if (!registerForm.email) {
    errors.email = '请输入电子邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    errors.email = '请输入有效的电子邮箱'
    isValid = false
  }
  
  // 验证手机号
  if (!registerForm.phone) {
    errors.phone = '请输入手机号'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    errors.phone = '请输入有效的手机号'
    isValid = false
  }
  
  // 验证密码
  if (!registerForm.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (registerForm.password.length < 6 || registerForm.password.length > 18) {
    errors.password = '密码长度应在6-18个字符之间'
    isValid = false
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$%^&*_\-.])[A-Za-z\d@$%^&*_\-.]{6,18}$/.test(registerForm.password)) {
    errors.password = '密码必须包含字母、数字和特殊符号'
    isValid = false
  }
  
  // 验证确认密码
  if (!registerForm.confirmPassword) {
    errors.confirmPassword = '请再次输入密码'
    isValid = false
  } else if (registerForm.confirmPassword !== registerForm.password) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }
  
  // 验证证件类型
  if (!registerForm.idType) {
    errors.idType = '请选择证件类型'
    isValid = false
  }
  
  // 验证证件号码
  if (!registerForm.idNumber) {
    errors.idNumber = '请输入证件号码'
    isValid = false
  } else if (registerForm.idType === '身份证' && !/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(registerForm.idNumber)) {
    errors.idNumber = '请输入有效的身份证号码'
    isValid = false
  }
  
  // 验证姓名
  if (!registerForm.name) {
    errors.name = '请输入姓名'
    isValid = false
  }
  
  return isValid
}

const handleRegister = () => {
  if (validateForm()) {
    // 这里应该是实际的注册API调用
    // 显示注册成功的消息通知
    ElMessage({
      message: '注册成功！请登录您的账号',
      type: 'success',
      duration: 3000,
      showClose: true
    })
    
    // 注册成功后跳转到登录页面
    setTimeout(() => {
      goToLogin()
    }, 1000) // 延迟1秒，让用户看到成功消息
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
</style> 