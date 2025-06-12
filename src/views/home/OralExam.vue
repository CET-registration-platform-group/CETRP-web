<template>
  <div class="oral-exam-container">
    <h3 class="section-title">口试报考</h3>
    <p class="section-desc">请选择您要报考的口试科目</p>

    <div class="exam-notice">
      <el-alert
        title="考试时间及费用说明"
        type="info"
        :closable="false"
        show-icon
      >
        <div class="notice-content">
          <p>考试时间：2024年6月16日</p>
          <p>报名费用：CET-SET - 50元/科</p>
          <p>报名截止：2024年5月15日 23:59:59</p>
          <p class="notice-warning">注意：口试仅限已通过相应笔试的考生报考</p>
        </div>
      </el-alert>
    </div>

    <div class="exam-selection">
      <div 
        v-for="exam in examList" 
        :key="exam.id" 
        class="exam-item"
        :class="{ 
          'selected': selectedExam === exam.id
        }"
        @click="isStepCompleted ? null : selectExam(exam)"
      >
        <div class="exam-info">
          <div class="exam-name">{{ exam.name }}</div>
          <div class="exam-details">
            <span class="exam-time">{{ exam.time }}</span>
            <span class="exam-price">￥{{ exam.price }}</span>
          </div>
          <div class="exam-requirement" v-if="!exam.available">
            {{ exam.requirementText }}
          </div>
        </div>
        <div class="exam-select">
          <el-radio 
            v-model="selectedExam" 
            :label="exam.id"
            :disabled="!exam.available || isStepCompleted"
          ></el-radio>
        </div>
      </div>
    </div>

    <div class="exam-summary" v-if="selectedExam">
      <div class="summary-content">
        <div class="summary-text">
          已选择考试科目
          <span class="total-price">费用：￥{{ totalPrice }}</span>
        </div>
      </div>
    </div>

    <div class="error-message" v-if="showError">
      <el-alert
        :title="errorMessage"
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
        :disabled="isStepCompleted || loading || !selectedExam"
      >
        <span v-if="isStepCompleted">✓ 已完成</span>
        <span v-else-if="loading">处理中...</span>
        <span v-else>下一步</span>
      </button>
      
      <button
        v-if="!isStepCompleted"
        class="btn btn-skip"
        @click="handleSkip"
        :disabled="loading"
      >
        跳过口试报名
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
const selectedExam = ref(null)
const showError = ref(false)
const errorMessage = ref('')
const loading = ref(false)

// 检查步骤是否已完成
const isStepCompleted = computed(() => {
  return registrationService.completedSteps.includes(REGISTRATION_STEPS.ORAL_APPLY)
})

// 检查笔试成绩是否达到口试要求（模拟数据）
const checkQualification = (examType) => {
  // 实际项目中，这里应该从后端获取用户的笔试成绩信息
  const mockScores = {
    'cet4': 550,
    'cet6': 520
  }
  
  const requiredScore = 425 // 口试资格要求分数
  return mockScores[examType] >= requiredScore
}

const examList = computed(() => [
  {
    id: 'cet4-set',
    name: '大学英语四级口试（CET-SET4）',
    time: '2024-06-16 09:00-12:00',
    price: 50,
    requirementType: 'cet4',
    get available() {
      return checkQualification(this.requirementType)
    },
    get requirementText() {
      return '需要CET4笔试成绩达到425分'
    }
  },
  {
    id: 'cet6-set',
    name: '大学英语六级口试（CET-SET6）',
    time: '2024-06-16 14:00-17:00',
    price: 50,
    requirementType: 'cet6',
    get available() {
      return checkQualification(this.requirementType)
    },
    get requirementText() {
      return '需要CET6笔试成绩达到425分'
    }
  }
])

const totalPrice = computed(() => {
  const selectedExamObj = examList.value.find(e => e.id === selectedExam.value)
  return selectedExamObj ? selectedExamObj.price : 0
})

const selectExam = (exam) => {
  if (isStepCompleted.value) return; // 如果已完成，禁用选择
  if (!exam.available) {
    errorMessage.value = exam.requirementText
    showError.value = true
    return
  }
  
  selectedExam.value = exam.id
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

  if (!selectedExam.value) {
    errorMessage.value = '请选择一个考试科目'
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

    // 保存选择的口试考试信息
    const selectedExamObj = examList.value.find(e => e.id === selectedExam.value)
    const examData = {
      examDetails: [{
        id: selectedExamObj.id,
        name: selectedExamObj.name,
        time: selectedExamObj.time,
        price: selectedExamObj.price
      }],
      totalPrice: totalPrice.value
    }

    localStorage.setItem('oralExams', JSON.stringify(examData))

    // 调用完成步骤接口，更新后端报名状态
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.ORAL_APPLY)

    ElMessage.success('口试报考成功')

    // 跳转到下一步
    const nextStep = registrationService.getNextStep()
    if (nextStep) {
      setTimeout(() => {
        router.push(nextStep.path)
      }, 500)
    }
  } catch (error) {
    console.error('完成步骤失败:', error)
    ElMessage.error(error.message || '操作失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleSkip = async () => {
  const userInfo = getUserInfo()
  if (!userInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    return
  }

  try {
    loading.value = true
    console.log('开始跳过口试报名流程...')
    
    // 先完成口试报名步骤
    console.log('完成口试报名步骤...')
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.ORAL_APPLY)
    
    // 再完成口试缴费步骤
    console.log('完成口试缴费步骤...')
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.ORAL_PAY)
    
    // 保存跳过状态到localStorage
    localStorage.setItem('oralExams', JSON.stringify({
      examDetails: [],
      totalPrice: 0,
      skipped: true
    }))
    
    ElMessage.success('已跳过口试报名')
    console.log('准备跳转到报名完成页面...')
    
    // 跳转到报名完成页面
    console.log('执行跳转到 /home/complete')
    router.push('/home/complete')
  } catch (error) {
    console.error('跳过口试报名失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 检查是否有已保存的选择
  const savedExamsStr = localStorage.getItem('oralExams')
  if (savedExamsStr) {
    const savedExams = JSON.parse(savedExamsStr)
    selectedExam.value = savedExams.examDetails[0].id
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
        selectedExam.value = savedExams.examDetails[0].id
      }
    }
  } catch (error) {
    console.error('获取报名信息失败:', error)
  }
})
</script>

<style scoped>
.oral-exam-container {
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

.notice-warning {
  color: #E6A23C; /* 警告颜色 */
  font-weight: 500;
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
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  background-color: #d9ecff;
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

.exam-requirement {
  font-size: 12px;
  color: #F56C6C;
  margin-top: 5px;
}

.exam-select .el-radio {
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
  justify-content: center;
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

.btn-skip {
  background-color: #f0f0f0;
  color: #606266;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-skip:hover {
  background-color: #e6e8eb;
  border-color: #d0d3d9;
}

.btn-skip:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f7fa;
}

</style> 