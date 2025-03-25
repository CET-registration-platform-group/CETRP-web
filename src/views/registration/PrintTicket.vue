<template>
  <div class="print-ticket-container">
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
        <button class="btn btn-default" @click="handleBack">返回</button>
        <button class="btn btn-primary" @click="handlePrint">打印准考证</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const ticketRef = ref(null)

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

onMounted(() => {
  // 从localStorage获取确认的信息
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
    examInfo.examType = writtenExams.examDetails[0].id // 使用第一个考试类型
    examInfo.examTime = writtenExams.examDetails[0].time
    examInfo.examLocation = '郑州大学新校区第一教学楼'
  }
  
  // 生成准考证号
  ticketInfo.ticketId = generateTicketId()
})

// 生成准考证号
const generateTicketId = () => {
  const year = new Date().getFullYear()
  const examType = examInfo.examType === 'cet4' ? '1' : '2'
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `${year}${examType}${random}`
}

// 打印准考证
const handlePrint = () => {
  window.print()
}

const handleBack = () => {
  router.push('/home')
}
</script>

<style scoped>
.print-ticket-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
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

.ticket-container {
  background-color: white;
  border: 1px solid var(--border-color);
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
  color: var(--text-primary);
  margin-bottom: 10px;
}

.ticket-id {
  font-size: 16px;
  color: var(--text-secondary);
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
  border: 1px solid var(--border-color);
}

.info-table .label {
  width: 100px;
  background-color: var(--bg-light);
  color: var(--text-secondary);
  font-weight: 500;
}

.ticket-footer {
  border-top: 1px dashed var(--border-color);
  padding-top: 20px;
}

.notice {
  margin-bottom: 30px;
}

.notice h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.notice ol {
  padding-left: 20px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.stamp {
  text-align: right;
  color: var(--text-primary);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
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