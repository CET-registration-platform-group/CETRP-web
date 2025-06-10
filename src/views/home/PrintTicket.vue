<template>
  <div class="print-ticket-container">
    <StepNavigation 
      current-step-key="PRINT_ADMIT"
      step-description="请确认准考证信息无误，然后打印准考证"
      :can-proceed="true"
      :loading="loading"
      next-button-text="完成报名"
      @complete-step="handleCompleteStep"
    />
    
    <div class="print-ticket-content">
      <h3 class="section-title">打印准考证</h3>
      <p class="section-desc">请确认以下信息无误，然后打印准考证</p>
      
      <div class="ticket-container" ref="ticketRef">
        <div class="ticket-header">
          <h2>全国大学英语{{ examInfo.examType === 'cet4' ? '四' : '六' }}级考试准考证</h2>
          <div class="ticket-id">准考证号：{{ ticketInfo.ticketId }}</div>
        </div>
        
        <div class="ticket-body">
          <div class="ticket-info">
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="label">姓名：</td>
                  <td>{{ userInfo.name }}</td>
                  <td class="label">学号：</td>
                  <td>{{ userInfo.studentId }}</td>
                </tr>
                <tr>
                  <td class="label">学校：</td>
                  <td>{{ userInfo.schoolInfo }}</td>
                  <td class="label">专业：</td>
                  <td>{{ userInfo.majorInfo }}</td>
                </tr>
                <tr>
                  <td class="label">考试科目：</td>
                  <td>{{ examInfo.examNames }}</td>
                  <td class="label">考试时间：</td>
                  <td>{{ examInfo.examTime }}</td>
                </tr>
                <tr>
                  <td class="label">考点：</td>
                  <td colspan="3">{{ examInfo.examLocation }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="ticket-footer">
          <div class="notice">
            <h3>考生须知：</h3>
            <ol>
              <li>考生须持本准考证和有效身份证件参加考试。</li>
              <li>考生须按照准考证上规定的时间和地点参加考试，迟到15分钟以上者不得入场。</li>
              <li>考试过程中不得使用手机等电子设备，不得交头接耳，不得抄袭他人答案，否则按违规处理。</li>
              <li>考试结束前30分钟内不得离场。</li>
              <li>考试结束后，考生须将答题卡和试卷交给监考人员，否则按违规处理。</li>
            </ol>
          </div>
          <div class="stamp">考试委员会盖章</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="handlePrint">打印准考证</button>
        <button class="btn btn-primary" @click="handleCompleteStep">完成报名</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'


const router = useRouter()
const ticketRef = ref(null)
const loading = ref(false)

const userInfo = reactive({
  name: '',
  studentId: '',
  schoolInfo: '',
  majorInfo: ''
})

const examInfo = reactive({
  examType: '',
  examNames: '',
  examTime: '',
  examLocation: ''
})

const ticketInfo = reactive({
  ticketId: ''
})

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

// 完成当前步骤
const handleCompleteStep = async () => {
  const userInfo = getUserInfo()
  if (!userInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    return
  }

  try {
    loading.value = true
    
    // 保存打印准考证状态到本地存储
    localStorage.setItem('ticketPrinted', 'true')
    
    ElMessage.success('报名完成！请妥善保管您的准考证')
    
    // 跳转到完成页面
    setTimeout(() => {
      router.push('/home/complete')
    }, 500)
  } catch (error) {
    console.error('完成步骤失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 打印准考证
const handlePrint = () => {
  window.print()
}

onMounted(async () => {
  const user = getUserInfo()
  if (!user) {
    router.push('/login')
    return
  }

  // 检查是否已完成前面的步骤
  const agreementAgreed = localStorage.getItem('agreementAgreed')
  if (agreementAgreed !== 'true') {
    ElMessage.warning('请先完成前面的步骤')
    router.push('/home/agreement')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    // 获取准考证信息
    const response = await fetch('/api/student/registration/ticket', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    if (data.code === 200) {
      // 使用接口返回的数据
      userInfo.name = data.data.name
      userInfo.studentId = data.data.studentId
      userInfo.schoolInfo = data.data.schoolInfo
      userInfo.majorInfo = data.data.majorInfo
      examInfo.examNames = data.data.examNames
      examInfo.examType = data.data.examType
      examInfo.examTime = data.data.examTime
      examInfo.examLocation = data.data.examLocation
      ticketInfo.ticketId = data.data.ticketId
    } else {
      // 如果接口失败，使用localStorage中的数据作为备用
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
        examInfo.examType = writtenExams.examDetails[0].id
        examInfo.examTime = writtenExams.examDetails[0].time
        examInfo.examLocation = '郑州大学新校区第一教学楼'
      }
      
      // 生成准考证号
      ticketInfo.ticketId = generateTicketId()
    }
  } catch (error) {
    console.error('获取准考证信息失败:', error)
    // 使用localStorage中的数据作为备用
    const confirmInfoStr = localStorage.getItem('confirmInfo')
    if (confirmInfoStr) {
      const confirmInfo = JSON.parse(confirmInfoStr)
      userInfo.name = confirmInfo.name
      userInfo.studentId = confirmInfo.studentId
      userInfo.schoolInfo = confirmInfo.schoolInfo
      userInfo.majorInfo = confirmInfo.majorInfo
    }
    
    const writtenExamsStr = localStorage.getItem('writtenExams')
    if (writtenExamsStr) {
      const writtenExams = JSON.parse(writtenExamsStr)
      examInfo.examNames = writtenExams.examDetails.map(exam => exam.name).join('、')
      examInfo.examType = writtenExams.examDetails[0].id
      examInfo.examTime = writtenExams.examDetails[0].time
      examInfo.examLocation = '郑州大学新校区第一教学楼'
    }
    
    ticketInfo.ticketId = generateTicketId()
  }
})

// 生成准考证号
const generateTicketId = () => {
  const year = new Date().getFullYear()
  const examType = examInfo.examType === 'cet4' ? '1' : '2'
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `${year}${examType}${random}`
}
</script>

<style scoped>
.print-ticket-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.print-ticket-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}

.section-desc {
  color: #606266;
  margin-bottom: 20px;
}

.ticket-container {
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
}

.ticket-header {
  text-align: center;
  margin-bottom: 30px;
}

.ticket-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.ticket-id {
  font-size: 16px;
  color: #606266;
}

.ticket-body {
  margin-bottom: 30px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 12px;
  border: 1px solid #e4e7ed;
}

.info-table .label {
  width: 100px;
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

.ticket-footer {
  border-top: 1px dashed #e4e7ed;
  padding-top: 20px;
}

.notice {
  margin-bottom: 30px;
}

.notice h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.notice ol {
  padding-left: 20px;
  color: #606266;
  line-height: 1.8;
}

.stamp {
  text-align: right;
  color: #303133;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-secondary {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-secondary:hover {
  background-color: #ecf5ff;
  color: #409EFF;
  border-color: #409EFF;
}

@media print {
  .section-title,
  .section-desc,
  .action-buttons {
    display: none;
  }
  
  .ticket-container {
    border: none;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .ticket-container {
    padding: 15px;
  }
  
  .info-table td {
    padding: 8px;
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