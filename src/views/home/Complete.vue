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
            <span class="label">学校：</span>
            <span>{{ userInfo.schoolInfo }}</span>
          </div>
          <div class="info-item">
            <span class="label">专业：</span>
            <span>{{ userInfo.majorInfo }}</span>
          </div>
        </div>
      </div>

      <!-- 考试信息卡片 -->
      <div class="status-card">
        <div class="card-header">
          <h4>考试信息</h4>
        </div>
        <div class="card-content">
          <div class="info-item">
            <span class="label">考试科目：</span>
            <span>{{ examInfo.examNames }}</span>
          </div>
          <div class="info-item">
            <span class="label">考试时间：</span>
            <span>{{ examInfo.examTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">考试地点：</span>
            <span>{{ examInfo.examLocation }}</span>
          </div>
          <div class="info-item">
            <span class="label">付费状态：</span>
            <span :class="['status', paymentInfo.isPaid ? 'success' : 'warning']">
              {{ paymentInfo.isPaid ? '已付费' : '待付费' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 下一步提示 -->
    <div class="next-steps">
      <h4>下一步</h4>
      <div class="step-items">
        <div class="step-item" v-if="!paymentInfo.isPaid">
          <el-icon><Warning /></el-icon>
          <span>请尽快完成考试费用支付，以确保您的报名信息生效</span>
        </div>
        <div class="step-item" v-else>
          <el-icon><Document /></el-icon>
          <span>您可以打印准考证了</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="btn btn-default" @click="handleBack">返回首页</button>
      <button 
        v-if="!paymentInfo.isPaid"
        class="btn btn-primary" 
        @click="handlePayment"
      >
        立即支付
      </button>
      <button 
        v-else
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
import { Warning, Document } from '@element-plus/icons-vue'

const router = useRouter()

const userInfo = reactive({
  name: '',
  studentId: '',
  schoolInfo: '',
  majorInfo: ''
})

const examInfo = reactive({
  examNames: '',
  examTime: '',
  examLocation: ''
})

const paymentInfo = reactive({
  isPaid: false,
  amount: 0
})

onMounted(async () => {
  // 获取用户信息
  const confirmInfoStr = localStorage.getItem('confirmInfo')
  if (confirmInfoStr) {
    const confirmInfo = JSON.parse(confirmInfoStr)
    userInfo.name = confirmInfo.name
    userInfo.studentId = confirmInfo.studentId
    userInfo.schoolInfo = confirmInfo.schoolInfo
    userInfo.majorInfo = confirmInfo.majorInfo
  }

  // 获取考试信息
  const writtenExamsStr = localStorage.getItem('writtenExams')
  if (writtenExamsStr) {
    const writtenExams = JSON.parse(writtenExamsStr)
    examInfo.examNames = writtenExams.examDetails.map(exam => exam.name).join('、')
    examInfo.examTime = writtenExams.examDetails[0].time
    examInfo.examLocation = '郑州大学新校区第一教学楼'
  }

  // 获取支付状态
  const paymentStatusStr = localStorage.getItem('payment_status')
  if (paymentStatusStr) {
    const paymentStatus = JSON.parse(paymentStatusStr)
    paymentInfo.isPaid = paymentStatus.isPaid
    paymentInfo.amount = paymentStatus.amount
  }

  // 完成报名流程
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await fetch('/api/student/registration/complete-step', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        step: 8,
        data: {
          userInfo,
          examInfo,
          paymentInfo,
          completed: true
        }
      })
    })

    const data = await response.json()
    if (data.code !== 200) {
      console.error('完成报名失败:', data.message)
    }
  } catch (error) {
    console.error('完成报名失败:', error)
  }
})

// 返回首页
const handleBack = () => {
  router.push('/home')
}

// 跳转到支付页面
const handlePayment = () => {
  router.push('/home/written-payment')
}

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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.next-steps {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.next-steps h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.step-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .status-cards {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 