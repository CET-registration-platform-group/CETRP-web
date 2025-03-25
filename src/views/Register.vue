<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="/src/assets/cet-logo.svg" alt="Logo" class="logo-img">
        <h1 class="title">大学生四六级考试报名系统</h1>
        <h2 class="subtitle">用户注册</h2>
      </div>
      
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="studentId">学号</label>
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
          <label for="name">姓名</label>
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
        
        <div class="form-group">
          <label for="school">学校</label>
          <input 
            type="text" 
            id="school" 
            v-model="registerForm.school" 
            class="form-input"
            placeholder="请输入学校"
            required
          >
          <div class="form-error" v-if="errors.school">{{ errors.school }}</div>
        </div>
        
        <div class="form-group">
          <label for="department">院系</label>
          <input 
            type="text" 
            id="department" 
            v-model="registerForm.department" 
            class="form-input"
            placeholder="请输入院系"
            required
          >
          <div class="form-error" v-if="errors.department">{{ errors.department }}</div>
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
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
          <label for="confirmPassword">确认密码</label>
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
          <div class="form-error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const registerForm = reactive({
  studentId: '',
  name: '',
  school: '',
  department: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  studentId: '',
  name: '',
  school: '',
  department: '',
  password: '',
  confirmPassword: ''
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
  
  // 验证姓名
  if (!registerForm.name) {
    errors.name = '请输入姓名'
    isValid = false
  }
  
  // 验证学校
  if (!registerForm.school) {
    errors.school = '请输入学校'
    isValid = false
  }
  
  // 验证院系
  if (!registerForm.department) {
    errors.department = '请输入院系'
    isValid = false
  }
  
  // 验证密码
  if (!registerForm.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (registerForm.password.length < 6 || registerForm.password.length > 20) {
    errors.password = '密码长度应在6-20个字符之间'
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
  
  return isValid
}

const handleRegister = () => {
  if (validateForm()) {
    // 这里应该是实际的注册API调用
    // 模拟注册成功
    alert('注册成功，请登录')
    router.push('/login')
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 注册页面样式 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1867c0 0%, #0d47a1 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 添加动态背景元素 */
.register-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
  animation: rotate 30s linear infinite;
  z-index: 1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.register-box {
  width: 100%;
  max-width: 550px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  padding: 40px;
  position: relative;
  z-index: 2;
}

.register-header {
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

.subtitle {
  font-size: 18px;
  color: #606266;
  margin: 10px 0 0;
  font-weight: 400;
}

.register-form {
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
  .register-box {
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