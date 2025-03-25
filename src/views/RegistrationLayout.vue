<template>
  <div class="registration-layout">
    <header class="header">
      <div class="container">
        <div class="user-info">
          <span class="welcome">欢迎，{{ userInfo.name }}</span>
          <span class="school">{{ userInfo.school }}</span>
          <span class="department">{{ userInfo.department }}</span>
        </div>
        <div class="action-btns">
          <button class="btn-back" @click="backToHome">返回首页</button>
          <button class="btn-logout" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </header>

    <main class="container main-content">
      <!-- 报名流程进度条 -->
      <div class="progress-wrapper">
        <div class="registration-progress">
          <div
            v-for="(step, index) in registrationSteps"
            :key="index"
            class="progress-step"
            :class="{
              'active': currentStep >= step.step,
              'current': currentStep === step.step
            }"
            @click="goToStep(step.path)"
          >
            <div class="step-number">{{ step.step }}</div>
            <div class="step-title">{{ step.title }}</div>
            <div class="step-connector" v-if="index < registrationSteps.length - 1"></div>
          </div>
        </div>
      </div>

      <!-- 正在进行的步骤 -->
      <div class="registration-step theme-card">
        <h2 class="step-heading">{{ currentStepInfo.title }}</h2>
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userInfo = ref({
  name: '',
  school: '',
  department: ''
})

const registrationSteps = [
  { step: 1, title: '报名协议', path: '/registration/agreement' },
  { step: 2, title: '资格信息查询', path: '/registration/qualification' },
  { step: 3, title: '资格信息确认', path: '/registration/confirm-info' },
  { step: 4, title: '笔试报考', path: '/registration/written-exam' },
  { step: 5, title: '笔试缴费', path: '/registration/written-payment' },
  { step: 6, title: '口试报考', path: '/registration/oral-exam' },
  { step: 7, title: '口试缴费', path: '/registration/oral-payment' },
  { step: 8, title: '完成报名', path: '/registration/complete' }
]

const currentStep = computed(() => {
  return route.meta.step || 1
})

const currentStepInfo = computed(() => {
  return registrationSteps.find(step => step.step === currentStep.value) || registrationSteps[0]
})

onMounted(() => {
  // 从localStorage获取用户信息
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    userInfo.value = JSON.parse(storedUser)
  } else {
    router.push('/login')
  }
})

const backToHome = () => {
  router.push('/home')
}

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}

const goToStep = (path) => {
  // 实际应用中应该检查用户是否完成了前面的步骤
  router.push(path)
}
</script>

<style scoped>
.registration-layout {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  margin-bottom: 30px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.welcome {
  font-weight: 500;
  color: var(--text-primary);
}

.school, .department {
  color: var(--text-secondary);
}

.action-btns {
  display: flex;
  gap: 15px;
}

.btn-back, .btn-logout {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--btn-radius);
  background-color: white;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-back:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-logout:hover {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.main-content {
  display: grid;
  gap: 30px;
  padding-bottom: 50px;
}

.progress-wrapper {
  overflow-x: auto;
  padding: 10px 0;
}

.registration-progress {
  display: flex;
  min-width: max-content;
  margin: 0 auto 20px;
}

.progress-step {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 15px;
  cursor: pointer;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--text-tertiary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: var(--transition-fast);
}

.progress-step.active .step-number {
  background-color: var(--success-color);
}

.progress-step.current .step-number {
  background-color: var(--primary-color);
}

.step-title {
  margin-left: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.progress-step.active .step-title {
  color: var(--text-primary);
  font-weight: 500;
}

.step-connector {
  position: absolute;
  height: 2px;
  background-color: var(--border-color);
  width: calc(100% - 65px);
  right: -15px;
  top: 14px;
  z-index: -1;
}

.progress-step.active .step-connector {
  background-color: var(--success-color);
}

.registration-step {
  padding: 30px;
}

.step-heading {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 25px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 15px;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .registration-step {
    padding: 20px;
  }
}
</style> 