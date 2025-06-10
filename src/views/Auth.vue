<template>
  <div class="auth-container">
    <!-- 背景动画元素 -->
    <div class="grid-overlay"></div>
    <div class="grid-overlay-2"></div>
    <div class="light-beam"></div>
    <div class="light-beam-2"></div>
    <div class="particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
    <!-- 使用Vue的Transition组件进行平滑切换 -->
    <div class="auth-components-container">
      <component 
        :is="currentComponent" 
        @switch-to-login="switchToLogin" 
        @switch-to-register="switchToRegister"
        @switch-to-reset="switchToReset"
        :key="route.path"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, markRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import ResetPasswordForm from '../components/auth/ResetPasswordForm.vue'

const route = useRoute()
// 使用markRaw包装组件，避免不必要的响应式处理
const LoginFormComponent = markRaw(LoginForm)
const RegisterFormComponent = markRaw(RegisterForm)
const ResetPasswordFormComponent = markRaw(ResetPasswordForm)
const currentComponent = shallowRef(LoginFormComponent) // 设置默认组件为登录组件

// 根据路由路径决定显示哪个组件
onMounted(() => {
  updateComponent()
})

// 监听路由变化
watch(() => route.path, () => {
  updateComponent()
})

const updateComponent = () => {
  const path = route.path
  if (path === '/login') {
    currentComponent.value = LoginFormComponent
  } else if (path === '/register') {
    currentComponent.value = RegisterFormComponent
  } else if (path === '/reset-password') {
    currentComponent.value = ResetPasswordFormComponent
  }
}

// 切换到登录组件
const switchToLogin = () => {
  window.history.pushState(null, '', '/login')
  currentComponent.value = LoginFormComponent
}

// 切换到注册组件
const switchToRegister = () => {
  window.history.pushState(null, '', '/register')
  currentComponent.value = RegisterFormComponent
}

// 切换到重置密码组件
const switchToReset = () => {
  window.history.pushState(null, '', '/reset-password')
  currentComponent.value = ResetPasswordFormComponent
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

/* 复用所有背景动画样式 */
.auth-container::before,
.auth-container::after {
  content: '';
  position: fixed;
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

/* 网格覆盖层 */
.auth-container .grid-overlay {
  position: fixed;
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

.auth-container .grid-overlay-2 {
  position: fixed;
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

/* 光束效果 */
.auth-container .light-beam {
  position: fixed;
  top: 0;
  left: 0;
  width: 150%;
  height: 150%;
  background: linear-gradient(37deg, transparent 0%, rgba(255,255,255,0.04) 40%, transparent 100%);
  transform-origin: 10% 20%;
  animation: beam 20s ease-in-out infinite alternate;
  z-index: 1;
}

.auth-container .light-beam-2 {
  position: fixed;
  top: -50%;
  left: -20%;
  width: 170%;
  height: 170%;
  background: linear-gradient(143deg, transparent 0%, rgba(255,255,255,0.03) 60%, transparent 100%);
  transform-origin: 90% 80%;
  animation: beam2 25s ease-in-out infinite alternate;
  z-index: 1;
}

/* 浮动粒子 */
.auth-container .particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.auth-container .particle {
  position: fixed;
  display: block;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 30s infinite ease-in-out;
}

.auth-container .particle:nth-child(1) {
  width: 80px;
  height: 80px;
  top: 10vh;
  left: 10vw;
  animation-delay: 0s;
  background: rgba(255, 255, 255, 0.08);
}

.auth-container .particle:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 70vh;
  left: 80vw;
  animation-delay: 2s;
  background: rgba(255, 255, 255, 0.06);
}

.auth-container .particle:nth-child(3) {
  width: 40px;
  height: 40px;
  top: 40vh;
  left: 60vw;
  animation-delay: 4s;
  background: rgba(255, 255, 255, 0.1);
}

.auth-container .particle:nth-child(4) {
  width: 100px;
  height: 100px;
  top: 80vh;
  left: 20vw;
  animation-delay: 6s;
  background: rgba(255, 255, 255, 0.05);
}

.auth-container .particle:nth-child(5) {
  width: 50px;
  height: 50px;
  top: 30vh;
  left: 90vw;
  animation-delay: 8s;
  background: rgba(255, 255, 255, 0.07);
}

/* 组件容器 */
.auth-components-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

/* 动画关键帧 */
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

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-4vh) translateX(2vw);
  }
  50% {
    transform: translateY(1vh) translateX(4vw);
  }
  75% {
    transform: translateY(3vh) translateX(-3vw);
  }
}
</style> 