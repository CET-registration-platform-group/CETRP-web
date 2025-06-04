<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="/public/vite.svg" alt="Logo" class="logo-img">
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-img {
  height: 50px;
  margin-bottom: 15px;
}

.title {
  font-size: 22px;
  color: #409EFF;
  margin: 0;
  font-weight: 600;
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
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #409EFF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-error {
  color: #f56c6c;
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
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-default {
  background-color: #f4f4f5;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-default:hover {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
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