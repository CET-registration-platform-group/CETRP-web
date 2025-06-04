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
          <button class="logout-btn" @click="handleLogout">退出登录</button>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 用户信息
const userInfo = reactive({
  name: '',
  studentId: '',
  school: '',
  department: ''
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
  { title: '打印准考证', path: '/home/print-ticket', icon: 'Printer' },
  { title: '参加考试', path: '/home/exam', icon: 'Reading' },
  { title: '查询成绩', path: '/home/result', icon: 'DataAnalysis' }
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
  { title: '打印准考证', step: 9 },
  { title: '参加考试', step: 10 },
  { title: '结束', step: 11 }
]

// 当前激活的菜单项
const activeIndex = computed(() => route.path)

// 当前激活的步骤
const activeStep = computed(() => {
  const currentMeta = route.meta
  return currentMeta.step || 1
})

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 获取用户信息
onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    userInfo.name = user.name
    userInfo.studentId = user.studentId
    userInfo.school = user.school
    userInfo.department = user.department
  } else {
    router.push('/login')
  }
})

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('user')
    alert('退出成功')
    router.push('/login')
  }
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
</style>