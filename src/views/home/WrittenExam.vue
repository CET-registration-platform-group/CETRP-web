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
        @click="toggleExam(exam.id)"
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

    <div class="action-buttons">
      <button class="btn btn-default" @click="handleBack">返回</button>
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
  const index = selectedExams.value.indexOf(examId)
  if (index === -1) {
    selectedExams.value.push(examId)
  } else {
    selectedExams.value.splice(index, 1)
  }
  showError.value = false
}

const handleBack = () => {
  router.push('/home/confirm-info')
}

const handleNext = async () => {
  if (selectedExams.value.length === 0) {
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

    localStorage.setItem('writtenExams', JSON.stringify(examData))

    // 调用完成步骤接口
    const response = await fetch('/api/student/registration/complete-step', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        step: 4,
        data: examData
      })
    })

    const data = await response.json()
    if (data.code === 200) {
      router.push('/home/written-payment')
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
  const savedExamsStr = localStorage.getItem('writtenExams')
  if (savedExamsStr) {
    const savedExams = JSON.parse(savedExamsStr)
    selectedExams.value = savedExams.examDetails.map(exam => exam.id)
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

.exam-item:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.exam-item.selected {
  border-color: var(--primary);
  background-color: var(--primary-light);
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