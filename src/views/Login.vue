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
    
    // 登录成功后直接跳转，不显示弹窗
    router.push('/home')
  }
}

const goToRegister = () => {
  isSliding.value = true
  setTimeout(() => {
    router.push('/register')
  }, 300)
}
</script>

<style scoped>
/* 登录页面背景样式 */
.auth-container {
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
.auth-container::before {
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

.auth-card {
  display: flex;
  width: 900px;
  max-width: 90%;
  min-height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.slide-out {
  transform: translateX(-100%);
  opacity: 0;
}

.auth-left {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.auth-right {
  flex: 1;
  background: linear-gradient(135deg, #5d99eb 0%, #1867c0 100%);
  color: white;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 添加右侧装饰元素 */
.auth-right::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -20%;
  width: 60%;
  height: 140%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
  transform: rotate(30deg);
}

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
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-top: auto;
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
  .login-box {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
}
</style>