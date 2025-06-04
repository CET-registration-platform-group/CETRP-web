<template>
  <div class="auth-container">
    <div class="auth-card" :class="{ 'slide-out': isSliding }">
      <div class="auth-left">
        <div class="auth-header">
          <img src="/src/assets/cet-logo.svg" alt="Logo" class="logo-img">
          <h1 class="title">大学生四六级考试报名系统</h1>
        </div>
        
        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">学号</label>
            <div class="input-wrapper">
              <i class="icon-user"></i>
              <input 
                type="text" 
                id="username" 
                v-model="loginForm.username" 
                placeholder="请输入学号"
                required
                minlength="8"
                maxlength="20"
              >
            </div>
            <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
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
            <button type="submit" class="auth-btn">登录</button>
          </div>
          
          <div class="auth-link">
            <span>还没有账号？</span>
            <a href="javascript:void(0)" @click="goToRegister">立即注册</a>
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/styles/login-bg.css'

const router = useRouter()
const isSliding = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''
  
  if (!loginForm.username) {
    errors.username = '请输入学号'
    isValid = false
  } else if (loginForm.username.length < 8 || loginForm.username.length > 20) {
    errors.username = '学号长度应在8-20个字符之间'
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

const handleLogin = () => {
  if (validateForm()) {
    // 这里应该是实际的登录API调用
    // 模拟登录成功
    localStorage.setItem('user', JSON.stringify({
      username: loginForm.username,
      name: '测试用户',
      studentId: loginForm.username,
      school: '示例大学',
      department: '计算机科学与技术学院'
    }))
    
    // 显示成功消息
    alert('登录成功')
    
    // 跳转到首页
    router.push('/home')
  }
}
</script>

<style scoped>
/* 使用login-bg.css中的样式，这里只添加额外的样式 */
.slide-out {
  transform: translateX(-100%);
  opacity: 0;
}

.login-header {
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

.login-form {
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
  border-radius: 4px;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.input-wrapper i {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  color: #909399;
}

.icon-user {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23909399"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-lock {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23909399"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

input {
  flex: 1;
  height: 40px;
  padding: 0 15px 0 0;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #606266;
  outline: none;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
  min-height: 18px;
}

.login-btn {
  width: 100%;
  height: 40px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #66b1ff;
}

.login-btn:active {
  background-color: #3a8ee6;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #606266;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
}
</style>