<template>
  <div class="complete-container">
    <h3 class="section-title">报名完成</h3>
    <p class="section-desc">您已完成报名流程，请确认以下信息</p>

    <div class="status-cards">
      <!-- 报名信息卡片 -->
      <div class="status-card">
        <div class="card-header">
          <h4>报名信息</h4>
        </div>
        <div class="card-content">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">学号：</span>
            <span>{{ userInfo.studentId }}</span>
          </div>
          <div class="info-item">
            <span class="label">证件类型：</span>
            <span>{{ userInfo.idType }}</span>
          </div>
          <div class="info-item">
            <span class="label">证件号：</span>
            <span>{{ userInfo.idNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号：</span>
            <span>{{ userInfo.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">邮箱：</span>
            <span>{{ userInfo.email }}</span>
          </div>
        </div>
      </div>

      <!-- 笔试考试信息卡片 -->
      <div class="status-card">
        <div class="card-header">
          <h4>笔试考试信息</h4>
        </div>
        <div class="card-content">
          <div v-if="writtenExamInfo.hasApplied" class="info-item">
            <span class="label">考试科目：</span>
            <span>{{ writtenExamInfo.examNames }}</span>
          </div>
          <div v-if="writtenExamInfo.hasApplied" class="info-item">
            <span class="label">考试时间：</span>
            <span>{{ writtenExamInfo.examTime }}</span>
          </div>
          <div v-if="writtenExamInfo.hasApplied" class="info-item">
            <span class="label">考试地点：</span>
            <span>{{ writtenExamInfo.examLocation }}</span>
          </div>
          <div v-if="!writtenExamInfo.hasApplied" class="info-item">
            <span class="label">状态：</span>
            <span class="status warning">该考试未报名</span>
          </div>
        </div>
      </div>

      <!-- 口试考试信息卡片 -->
      <div class="status-card">
        <div class="card-header">
          <h4>口试考试信息</h4>
        </div>
        <div class="card-content">
          <div v-if="oralExamInfo.hasApplied" class="info-item">
            <span class="label">考试科目：</span>
            <span>{{ oralExamInfo.examNames }}</span>
          </div>
          <div v-if="oralExamInfo.hasApplied" class="info-item">
            <span class="label">考试时间：</span>
            <span>{{ oralExamInfo.examTime }}</span>
          </div>
          <div v-if="oralExamInfo.hasApplied" class="info-item">
            <span class="label">考试地点：</span>
            <span>{{ oralExamInfo.examLocation }}</span>
          </div>
          <div v-if="!oralExamInfo.hasApplied" class="info-item">
            <span class="label">状态：</span>
            <span class="status warning">该考试未报名</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button 
        class="btn btn-primary" 
        @click="handlePrintTicket"
      >
        打印准考证
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'

const router = useRouter()
const isLoading = ref(false)

const userInfo = reactive({
  name: '',
  studentId: '',
  idType: '',
  idNumber: '',
  phone: '',
  email: ''
})

const writtenExamInfo = reactive({
  examNames: '',
  examTime: '',
  examLocation: '',
  hasApplied: false
})

const oralExamInfo = reactive({
  examNames: '',
  examTime: '',
  examLocation: '',
  hasApplied: false
})

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

// 检查考试报名状态
const checkExamStatus = () => {
  // 检查笔试报名状态
  const writtenExams = localStorage.getItem('writtenExams')
  if (writtenExams) {
    const exams = JSON.parse(writtenExams)
    writtenExamInfo.hasApplied = true
    writtenExamInfo.examNames = exams.examDetails.map(exam => exam.name).join('、')
    writtenExamInfo.examTime = exams.examDetails[0].time
    writtenExamInfo.examLocation = '郑州大学新校区第一教学楼'
  }

  // 检查口试报名状态
  const oralExams = localStorage.getItem('oralExams')
  if (oralExams) {
    const exams = JSON.parse(oralExams)
    // 检查是否跳过口试报名
    if (exams.skipped) {
      oralExamInfo.hasApplied = false
      oralExamInfo.examNames = ''
      oralExamInfo.examTime = ''
      oralExamInfo.examLocation = ''
    } else if (exams.examDetails && exams.examDetails.length > 0) {
      oralExamInfo.hasApplied = true
      oralExamInfo.examNames = exams.examDetails.map(exam => exam.name).join('、')
      oralExamInfo.examTime = exams.examDetails[0].time
      oralExamInfo.examLocation = '郑州大学新校区第一教学楼'
    }
  }
}

onMounted(async () => {
  // 获取用户信息
  const confirmInfoStr = localStorage.getItem('confirmInfo')
  if (confirmInfoStr) {
    const confirmInfo = JSON.parse(confirmInfoStr)
    userInfo.name = confirmInfo.name
    userInfo.studentId = confirmInfo.studentId
    userInfo.idType = confirmInfo.idType || '身份证'
    userInfo.idNumber = confirmInfo.idNumber
    userInfo.phone = confirmInfo.phone
    userInfo.email = confirmInfo.email
  }

  // 检查考试报名状态
  checkExamStatus()

  // 获取最新报名信息以同步状态
  const currentUserInfo = getUserInfo()
  if (!currentUserInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    return
  }

  try {
    isLoading.value = true
    await registrationService.getRegistrationInfo(currentUserInfo.id)

    // 只有在完成口试缴费后才自动完成报名步骤
    const currentCompletedSteps = registrationService.completedSteps
    if (currentCompletedSteps.includes(REGISTRATION_STEPS.ORAL_PAY) || currentCompletedSteps.includes(REGISTRATION_STEPS.WRITTEN_PAY)) {
      // 避免重复调用，只在必要时调用completeStep
      if (!currentCompletedSteps.includes(REGISTRATION_STEPS.COMPLETE)) {
        await registrationService.completeStep(currentUserInfo.id, REGISTRATION_STEPS.COMPLETE)
        ElMessage.success('已完成报名流程')
      }
    } else if (currentCompletedSteps.includes(REGISTRATION_STEPS.WRITTEN_APPLY) && !currentCompletedSteps.includes(REGISTRATION_STEPS.ORAL_APPLY)) {
      // 如果跳过口试，并且已经完成笔试报考，直接完成报名
      if (!currentCompletedSteps.includes(REGISTRATION_STEPS.COMPLETE)) {
        await registrationService.completeStep(currentUserInfo.id, REGISTRATION_STEPS.COMPLETE)
        ElMessage.success('已完成报名流程')
      }
    }

  } catch (error) {
    console.error('获取报名信息或完成报名失败:', error)
    ElMessage.error(error.message || '系统异常，请联系管理员')
  } finally {
    isLoading.value = false
  }
})

// 跳转到打印准考证页面
const handlePrintTicket = () => {
  router.push('/home/print-ticket')
}
</script>

<style scoped>
.complete-container {
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.section-desc {
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.status-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.status-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  background: var(--bg-light);
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.card-content {
  padding: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  width: 100px;
  color: var(--text-secondary);
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.status.success {
  background: var(--success-bg);
  color: var(--success);
}

.status.warning {
  background: var(--warning-bg);
  color: var(--warning);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 