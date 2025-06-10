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
          'selected': selectedExams.includes(exam.id),
          'disabled': !exam.available
        }"
        @click="toggleExam(exam)"
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
          <el-checkbox 
            v-model="selectedExams" 
            :label="exam.id"
            :disabled="!exam.available"
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
        :title="errorMessage"
        type="error"
        :closable="false"
        show-icon
      ></el-alert>
    </div>

    <div class="action-buttons">
      <button class="btn btn-default" @click="handleBack">返回</button>
      <button class="btn btn-default" @click="handleSkip">跳过口试报名</button>
      <button class="btn btn-primary" @click="handleNext">下一步</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const selectedExams = ref([])
const showError = ref(false)
const errorMessage = ref('')

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

const examList = [
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
]

const totalPrice = computed(() => {
  return selectedExams.value.reduce((total, examId) => {
    const exam = examList.find(e => e.id === examId)
    return total + (exam ? exam.price : 0)
  }, 0)
})

const toggleExam = (exam) => {
  if (!exam.available) {
    errorMessage.value = exam.requirementText
    showError.value = true
    return
  }
  
  const index = selectedExams.value.indexOf(exam.id)
  if (index === -1) {
    selectedExams.value.push(exam.id)
  } else {
    selectedExams.value.splice(index, 1)
  }
  showError.value = false
}

const handleBack = () => {
  router.push('/home/written-payment')
}

const handleSkip = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    localStorage.setItem('skip_oral', 'true')

    // 调用完成步骤接口
    const response = await fetch('/api/student/registration/complete-step', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        step: 6,
        data: { skip: true }
      })
    })

    const data = await response.json()
    if (data.code === 200) {
      router.push('/home/complete')
    } else {
      alert(data.message || '操作失败')
    }
  } catch (error) {
    console.error('完成步骤失败:', error)
    alert('操作失败，请重试')
  }
}

const handleNext = async () => {
  if (selectedExams.value.length === 0) {
    errorMessage.value = '请至少选择一个考试科目'
    showError.value = true
    return
  }

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

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

    localStorage.setItem('oralExams', JSON.stringify(examData))
    localStorage.setItem('skip_oral', 'false')

    // 调用完成步骤接口
    const response = await fetch('/api/student/registration/complete-step', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        step: 6,
        data: examData
      })
    })

    const data = await response.json()
    if (data.code === 200) {
      router.push('/home/oral-payment')
    } else {
      alert(data.message || '操作失败')
    }
  } catch (error) {
    console.error('完成步骤失败:', error)
    alert('操作失败，请重试')
  }
}

onMounted(() => {
  // 检查是否有已保存的选择
  const savedExamsStr = localStorage.getItem('oralExams')
  if (savedExamsStr) {
    const savedExams = JSON.parse(savedExamsStr)
    selectedExams.value = savedExams.examDetails.map(exam => exam.id)
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
  color: var(--warning);
  font-weight: 500;
  margin-top: 5px;
}

.exam-selection {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.exam-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.exam-item:not(.disabled):hover {
  border-color: var(--primary);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.exam-item.selected {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

.exam-item.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.exam-info {
  flex: 1;
}

.exam-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.exam-details {
  display: flex;
  gap: 20px;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 8px;
}

.exam-requirement {
  font-size: 14px;
  color: var(--warning);
}

.exam-price {
  color: var(--primary);
  font-weight: 500;
}

.exam-summary {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-text {
  color: var(--text-primary);
  font-size: 16px;
}

.total-price {
  margin-left: 20px;
  color: var(--primary);
  font-weight: 500;
}

.error-message {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .exam-details {
    flex-direction: column;
    gap: 5px;
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