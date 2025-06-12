<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="/public/vite.svg" alt="Logo" class="logo-img">
          <span>大学生四六级考试报名系统</span>
        </div>
        <div class="user-info">
          <span>欢迎您，{{ userInfo.name }}</span>
          <button class="logout-btn" @click="showLogoutModal = true">退出登录</button>
        </div>
      </div>
    </header>
    
    <div class="main-content">
      <aside class="sidebar">
        <nav class="nav-menu">
          <a 
            v-for="(item, index) in menuItems" 
            :key="index" 
            :href="item.path" 
            :class="['nav-item', { active: activeIndex === item.path }]"
            @click.prevent="navigateTo(item.path)"
          >
            <i :class="`icon-${item.icon.toLowerCase()}`"></i>
            <span>{{ item.title }}</span>
          </a>
        </nav>
      </aside>
      
      <main class="content">
        <div class="steps-container">
          <div class="steps">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              :class="['step', { 
                'active': activeStep === step.step,
                'completed': activeStep > step.step
              }]"
            >
              <div class="step-number">{{ step.step }}</div>
              <div class="step-title">{{ step.title }}</div>
              <div class="step-line" v-if="index < steps.length - 1"></div>
            </div>
          </div>
        </div>
        
        <div class="page-content">
          <router-view />
        </div>
      </main>
    </div>
    
    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 大学生四六级考试报名系统 All Rights Reserved</p>
      </div>
    </footer>

    <!-- 退出登录弹窗 -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-body">
          <p>确定要退出登录吗？</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="showLogoutModal = false">取消</button>
          <button class="btn btn-confirm" @click="handleLogout">确定登出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 弹窗状态
const showLogoutModal = ref(false)

// 用户信息
const userInfo = reactive({
  name: '',
  studentId: '',
  school: '',
  department: ''
})

// 报名状态
const registrationStatus = reactive({
  step: 1,
  completedSteps: []
})

// 菜单项
const menuItems = [
  { title: '报名协议', path: '/home/agreement', icon: 'Document' },
  { title: '资格信息查询', path: '/home/qualification', icon: 'Search' },
  { title: '资格信息确认', path: '/home/confirm-info', icon: 'Check' },
  { title: '笔试报考', path: '/home/written-exam', icon: 'Edit' },
  { title: '笔试缴费', path: '/home/written-payment', icon: 'Money' },
  { title: '口试报考', path: '/home/oral-exam', icon: 'Microphone' },
  { title: '口试缴费', path: '/home/oral-payment', icon: 'Money' },
  { title: '完成报名', path: '/home/complete', icon: 'Finished' },
]

// 步骤
const steps = [
  { title: '报名协议', step: 1 },
  { title: '资格查询', step: 2 },
  { title: '信息确认', step: 3 },
  { title: '笔试报考', step: 4 },
  { title: '笔试缴费', step: 5 },
  { title: '口试报考', step: 6 },
  { title: '口试缴费', step: 7 },
  { title: '完成报名', step: 8 },
]

// 当前激活的菜单项
const activeIndex = computed(() => route.path)

// 当前激活的步骤
const activeStep = computed(() => {
  const currentMeta = route.meta
  return currentMeta.step || registrationStatus.step
})

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 获取报名信息
const getRegistrationInfo = async () => {
  try {
    // 模拟获取报名信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟报名状态数据
    registrationStatus.step = 1
    registrationStatus.completedSteps = []
    
    // 可以从localStorage获取之前保存的状态
    const savedStatus = localStorage.getItem('registrationStatus')
    if (savedStatus) {
      const status = JSON.parse(savedStatus)
      registrationStatus.step = status.step
      registrationStatus.completedSteps = status.completedSteps
    }
  } catch (error) {
    console.error('获取报名信息失败:', error)
  }
}

// 获取用户信息
onMounted(async () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    userInfo.name = user.name
    userInfo.studentId = user.studentId
    userInfo.school = user.school
    userInfo.department = user.department
  } else {
    router.push('/login')
    return
  }

  // 获取报名信息
  await getRegistrationInfo()
})

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  showLogoutModal.value = false
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 头部样式 */
.header {
  background-color: #409EFF;
  color: #fff;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.logo-img {
  height: 30px;
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

/* 侧边栏 */
.sidebar {
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-right: 20px;
  padding: 15px 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #606266;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #f0f7ff;
  color: #409EFF;
}

.nav-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
  border-left-color: #409EFF;
}

.nav-item i {
  margin-right: 10px;
  font-size: 16px;
}

/* 图标样式 */
[class^="icon-"] {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 内容区域 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 步骤条 */
.steps-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #dcdfe6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  position: relative;
  z-index: 2;
}

.step.active .step-number,
.step.completed .step-number {
  background-color: #409EFF;
}

.step-title {
  font-size: 12px;
  color: #606266;
}

.step.active .step-title,
.step.completed .step-title {
  color: #409EFF;
}

.step-line {
  position: absolute;
  top: 15px;
  right: calc(-50% + 15px);
  width: calc(100% - 30px);
  height: 2px;
  background-color: #dcdfe6;
  z-index: 1;
}

.step.completed .step-line {
  background-color: #409EFF;
}

/* 页面内容 */
.page-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1;
}

/* 页脚 */
.footer {
  background-color: #f5f7fa;
  padding: 15px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 10px;
  }
  
  .sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .steps {
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .step-title {
    font-size: 10px;
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
  width: 380px;
  max-width: 90vw;
  animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-body {
  padding: 32px 24px 24px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.3px;
}

.modal-footer {
  display: flex;
  gap: 16px;
  padding: 0 24px 28px;
  justify-content: center;
}

.btn {
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 100px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-cancel {
  background-color: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.btn-cancel:hover {
  background-color: #e9ecef;
  color: #495057;
  border-color: #dee2e6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.15);
}

.btn-confirm {
  background: linear-gradient(135deg, #409EFF 0%, #5cadff 100%);
  color: white;
  border: 2px solid #409EFF;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #5cadff 0%, #409EFF 100%);
  border-color: #5cadff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.35);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 90vw;
    margin: 20px;
    border-radius: 12px;
  }
  
  .modal-body {
    padding: 28px 20px 20px;
  }
  
  .modal-body p {
    font-size: 16px;
  }
  
  .modal-footer {
    padding: 0 20px 24px;
    gap: 12px;
  }
  
  .btn {
    padding: 10px 24px;
    font-size: 14px;
    min-width: 80px;
  }
}
</style>