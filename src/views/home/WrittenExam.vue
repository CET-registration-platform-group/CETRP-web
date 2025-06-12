<template>
  <div class="written-exam-container">
    <h3 class="section-title">笔试报考</h3>
    <p class="section-desc">请选择您要报考的科目</p>

    <div class="exam-notice">
      <el-alert
        title="考试时间及费用说明"
        type="info"
        :closable="false"
        show-icon
      >
        <div class="notice-content">
          <p>考试时间：2024年6月15日 09:00-11:20</p>
          <p>报名费用：CET4 - 25元/科，CET6 - 30元/科</p>
          <p>报名截止：2024年5月15日 23:59:59</p>
        </div>
      </el-alert>
    </div>

    <div class="exam-selection">
      <div 
        v-for="exam in examList" 
        :key="exam.id" 
        class="exam-item"
        :class="{ 'selected': selectedExams.includes(exam.id) }"
        @click="isStepCompleted ? null : toggleExam(exam.id)"
      >
        <div class="exam-info">
          <div class="exam-name">{{ exam.name }}</div>
          <div class="exam-details">
            <span class="exam-time">{{ exam.time }}</span>
            <span class="exam-price">￥{{ exam.price }}</span>
          </div>
        </div>
        <div class="exam-select">
          <el-checkbox 
            v-model="selectedExams" 
            :label="exam.id"
            :disabled="isStepCompleted"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="exam-summary" v-if="selectedExams.length > 0">
      <div class="summary-content">
        <div class="summary-text">
          已选择 {{ selectedExams.length }} 个科目
          <span class="total-price">总计：￥{{ totalPrice }}</span>
        </div>
      </div>
    </div>

    <div class="error-message" v-if="showError">
      <el-alert
        title="请至少选择一个考试科目"
        type="error"
        :closable="false"
        show-icon
      ></el-alert>
    </div>

    <div class="action-buttons" :style="{ justifyContent: 'center' }">
      <button 
        class="btn" 
        :class="{ 'btn-primary': !isStepCompleted, 'btn-completed': isStepCompleted }"
        @click="handleNext" 
        :disabled="isStepCompleted || loading || selectedExams.length === 0"
      >
        <span v-if="isStepCompleted">✓ 已完成</span>
        <span v-else-if="loading">处理中...</span>
        <span v-else>下一步</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'

const router = useRouter()
const selectedExams = ref([])
const showError = ref(false)
const loading = ref(false)

// 检查步骤是否已完成
const isStepCompleted = computed(() => {
  return registrationService.completedSteps.includes(REGISTRATION_STEPS.WRITTEN_APPLY)
})

const examList = [
  {
    id: 'cet4',
    name: '大学英语四级考试（CET4）',
    time: '2024-06-15 09:00-11:20',
    price: 25
  },
  {
    id: 'cet6',
    name: '大学英语六级考试（CET6）',
    time: '2024-06-15 15:00-17:20',
    price: 30
  }
]

const totalPrice = computed(() => {
  return selectedExams.value.reduce((total, examId) => {
    const exam = examList.find(e => e.id === examId)
    return total + (exam ? exam.price : 0)
  }, 0)
})

const toggleExam = (examId) => {
  if (isStepCompleted.value) return; // 如果已完成，禁用选择
  const index = selectedExams.value.indexOf(examId)
  if (index === -1) {
    selectedExams.value.push(examId)
  } else {
    selectedExams.value.splice(index, 1)
  }
  showError.value = false
}

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

const handleNext = async () => {
  if (isStepCompleted.value) {
    return
  }

  if (selectedExams.value.length === 0) {
    showError.value = true
    return
  }

  const userInfo = getUserInfo()
  if (!userInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    return
  }

  try {
    loading.value = true

    // 保存选择的考试信息
    const selectedExamDetails = examList
      .filter(exam => selectedExams.value.includes(exam.id))
      .map(exam => ({
        id: exam.id,
        name: exam.name,
        time: exam.time,
        price: exam.price
      }))

    const examData = {
      examDetails: selectedExamDetails,
      totalPrice: totalPrice.value
    }

    localStorage.setItem('writtenExams', JSON.stringify(examData))

    // 调用报名服务完成步骤
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.WRITTEN_APPLY)

    ElMessage.success('笔试报考成功')

    // 跳转到下一步
    const nextStep = registrationService.getNextStep()
    if (nextStep) {
      setTimeout(() => {
        router.push(nextStep.path)
      }, 500)
    }
  } catch (error) {
    console.error('完成步骤失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 检查是否有已保存的选择
  const savedExamsStr = localStorage.getItem('writtenExams')
  if (savedExamsStr) {
    const savedExams = JSON.parse(savedExamsStr)
    selectedExams.value = savedExams.examDetails.map(exam => exam.id)
  }

  // 获取报名信息
  const userInfo = getUserInfo()
  if (!userInfo) {
    router.push('/login')
    return
  }

  try {
    await registrationService.getRegistrationInfo(userInfo.id)
    
    // 如果当前步骤已完成，显示已完成的提示
    if (isStepCompleted.value) {
      // 确保已选择的考试科目显示
      if (savedExamsStr) {
        const savedExams = JSON.parse(savedExamsStr)
        selectedExams.value = savedExams.examDetails.map(exam => exam.id)
      }
    }
  } catch (error) {
    console.error('获取报名信息失败:', error)
  }
})
</script>

<style scoped>
.written-exam-container {
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
  margin-bottom: 20px;
}

.exam-notice {
  margin-bottom: 30px;
}

.notice-content {
  margin-top: 10px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.exam-selection {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.exam-item {
  background-color: #f9fafc;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.exam-item:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.exam-item.selected {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  background-color: #ecf5ff;
}

.exam-info {
  flex-grow: 1;
}

.exam-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.exam-details {
  font-size: 14px;
  color: #606266;
}

.exam-time {
  margin-right: 15px;
}

.exam-price {
  font-weight: 600;
  color: #E6A23C;
}

.exam-select .el-checkbox {
  transform: scale(1.2);
}

.exam-summary {
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 30px;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-text {
  font-size: 16px;
  color: #409EFF;
  font-weight: 500;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #E6A23C;
  margin-left: 20px;
}

.error-message {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 150px;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.btn-primary:hover {
  background-color: #66b1ff;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.btn-primary:active {
  background-color: #3a8ee6;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
}

.btn-default {
  background-color: #f0f2f5;
  color: #606266;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-default:hover {
  background-color: #e6e8eb;
  border-color: #d0d3d9;
}

.btn-default:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f7fa;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #a0cfff;
  box-shadow: none;
}

.btn-completed {
  background-color: #67c23a;
  color: white;
  cursor: not-allowed;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.btn-completed:hover {
  background-color: #85ce61;
}

/* Loading spinner */
.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style> 