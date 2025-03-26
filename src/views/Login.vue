<template>
  <div class="auth-container">
    <!-- 添加网格覆盖层 -->
    <div class="grid-overlay"></div>
    <div class="grid-overlay-2"></div>
    
    <!-- 添加光束效果 -->
    <div class="light-beam"></div>
    <div class="light-beam-2"></div>
    
    <!-- 浮动粒子 -->
    <div class="particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSliding = ref(false)

// 在组件挂载时检查是否是从注册页面跳转过来的
onMounted(() => {
  // 检查本地存储中的标记
  const transition = localStorage.getItem('auth_transition')
  if (transition === 'register_to_login') {
    // 如果是从注册页面跳转过来的，设置为true以显示滑入效果
    isSliding.value = true
    // 清除标记
    localStorage.removeItem('auth_transition')
    // 添加一个小延迟后将isSliding设置为false，触发动画
    setTimeout(() => {
      isSliding.value = false
    }, 50)
  }
})

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
  // 在本地存储中设置一个标记，表示是从登录页面跳转到注册页面
  localStorage.setItem('auth_transition', 'login_to_register')
  setTimeout(() => {
    router.push('/register')
  }, 500) // 从300ms增加到500ms，给动画更多时间完成
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

/* 替换波浪动画效果，使其更加不对称 */
.auth-container::before,
.auth-container::after {
  content: '';
  position: absolute;
  width: 300vw;
  height: 300vh;
  top: -100vh;
  left: -100vw;
  z-index: 1;
  background: transparent;
  opacity: 0.5;
}

.auth-container::before {
  background: 
    linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.12) 45%, transparent 100%);
  animation: wave1 25s linear infinite;
  top: -120vh;
  left: -80vw;
}

.auth-container::after {
  background: 
    linear-gradient(165deg, transparent 0%, rgba(255,255,255,0.08) 55%, transparent 100%);
  animation: wave2 32s linear infinite;
  top: -90vh;
  left: -110vw;
}

/* 调整网格覆盖层，使其不对称 */
.auth-container .grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(92deg, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(173deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 53px 47px;
  background-position: -10px -5px;
  z-index: 1;
  opacity: 0.6;
  animation: pulse 15s ease-in-out infinite;
}

/* 添加第二个网格层，增加复杂度 */
.auth-container .grid-overlay-2 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(103deg, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(11deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 73px 61px;
  background-position: 15px 10px;
  z-index: 1;
  opacity: 0.5;
  animation: pulse2 18s ease-in-out infinite;
}

/* 调整光线效果，使其更加不对称 */
.auth-container .light-beam {
  position: absolute;
  top: 0;
  left: 0;
  width: 150%;
  height: 150%;
  background: linear-gradient(37deg, transparent 0%, rgba(255,255,255,0.04) 40%, transparent 100%);
  transform-origin: 10% 20%;
  animation: beam 20s ease-in-out infinite alternate;
  z-index: 1;
}

/* 添加第二个光束，增加层次感 */
.auth-container .light-beam-2 {
  position: absolute;
  top: -50%;
  left: -20%;
  width: 170%;
  height: 170%;
  background: linear-gradient(143deg, transparent 0%, rgba(255,255,255,0.03) 60%, transparent 100%);
  transform-origin: 90% 80%;
  animation: beam2 25s ease-in-out infinite alternate;
  z-index: 1;
}

/* 浮动粒子效果保持不变，但调整透明度 */
.auth-container .particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.auth-container .particle {
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 30s infinite ease-in-out;
}

.auth-container .particle:nth-child(1) {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  background: rgba(255, 255, 255, 0.08);
}

.auth-container .particle:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 70%;
  left: 80%;
  animation-delay: 2s;
  background: rgba(255, 255, 255, 0.06);
}

.auth-container .particle:nth-child(3) {
  width: 40px;
  height: 40px;
  top: 40%;
  left: 60%;
  animation-delay: 4s;
  background: rgba(255, 255, 255, 0.1);
}

.auth-container .particle:nth-child(4) {
  width: 100px;
  height: 100px;
  top: 80%;
  left: 20%;
  animation-delay: 6s;
  background: rgba(255, 255, 255, 0.05);
}

.auth-container .particle:nth-child(5) {
  width: 50px;
  height: 50px;
  top: 30%;
  left: 90%;
  animation-delay: 8s;
  background: rgba(255, 255, 255, 0.07);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-40px) translateX(20px);
  }
  50% {
    transform: translateY(10px) translateX(40px);
  }
  75% {
    transform: translateY(30px) translateX(-30px);
  }
}

.auth-card {
  display: flex;
  width: 900px;
  max-width: 90%;
  min-height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  z-index: 2;
  /* 初始状态可能是从左侧滑入 */
  transform: translateX(0);
  opacity: 1;
}

/* 滑出动画 */
.auth-card.slide-out {
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

/* 不对称的动画关键帧 */
@keyframes wave1 {
  0% {
    transform: translate(-45%, -48%) rotate(0deg);
  }
  100% {
    transform: translate(-45%, -48%) rotate(360deg);
  }
}

@keyframes wave2 {
  0% {
    transform: translate(-52%, -51%) rotate(0deg);
  }
  100% {
    transform: translate(-52%, -51%) rotate(-360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1.02);
  }
  42% {
    opacity: 0.6;
    transform: scale(1);
  }
  71% {
    opacity: 0.5;
    transform: scale(1.01);
  }
}

@keyframes pulse2 {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1.01);
  }
  37% {
    opacity: 0.5;
    transform: scale(1);
  }
  63% {
    opacity: 0.4;
    transform: scale(1.02);
  }
}

@keyframes beam {
  0% {
    transform: rotate(-5deg) translateY(-40%) scale(1.5);
    opacity: 0.2;
  }
  40% {
    transform: rotate(8deg) translateY(-20%) scale(1.7);
    opacity: 0.3;
  }
  100% {
    transform: rotate(15deg) translateY(0%) scale(1.6);
    opacity: 0.4;
  }
}

@keyframes beam2 {
  0% {
    transform: rotate(10deg) translateY(20%) scale(1.6);
    opacity: 0.2;
  }
  60% {
    transform: rotate(-3deg) translateY(10%) scale(1.8);
    opacity: 0.3;
  }
  100% {
    transform: rotate(-12deg) translateY(0%) scale(1.7);
    opacity: 0.25;
  }
}
</style>