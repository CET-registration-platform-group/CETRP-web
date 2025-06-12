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
        :disabled="isGeneratingPDF"
      >
        {{ isGeneratingPDF ? '正在生成PDF...' : '打印准考证' }}
      </button>
    </div>

    <!-- PDF生成用的隐藏容器 -->
    <div ref="pdfContainer" class="pdf-container" style="display: none;">
      <div class="pdf-content">
        <div class="pdf-header">
          <h1>全国大学英语四六级考试</h1>
          <h1>准考证</h1>
        </div>
        
        <div class="pdf-section">
          <h3>身份信息</h3>
          <table class="pdf-table">
            <tbody>
              <tr>
                <td class="pdf-label">姓名：</td>
                <td class="pdf-value">{{ userInfo.name }}</td>
                <td class="pdf-label">学号：</td>
                <td class="pdf-value">{{ userInfo.studentId }}</td>
              </tr>
              <tr>
                <td class="pdf-label">证件类型：</td>
                <td class="pdf-value">{{ userInfo.idType }}</td>
                <td class="pdf-label">证件号：</td>
                <td class="pdf-value">{{ userInfo.idNumber }}</td>
              </tr>
              <tr>
                <td class="pdf-label">手机号：</td>
                <td class="pdf-value">{{ userInfo.phone }}</td>
                <td class="pdf-label">邮箱：</td>
                <td class="pdf-value">{{ userInfo.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pdf-section" v-if="writtenExamInfo.hasApplied">
          <h3>笔试考试信息</h3>
          <table class="pdf-table">
            <tbody>
              <tr>
                <td class="pdf-label">考试科目：</td>
                <td class="pdf-value" colspan="3">{{ writtenExamInfo.examNames }}</td>
              </tr>
              <tr>
                <td class="pdf-label">考试时间：</td>
                <td class="pdf-value" colspan="3">{{ writtenExamInfo.examTime }}</td>
              </tr>
              <tr>
                <td class="pdf-label">考试地点：</td>
                <td class="pdf-value" colspan="3">{{ writtenExamInfo.examLocation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pdf-section" v-if="!writtenExamInfo.hasApplied">
          <h2>笔试考试信息</h2>
          <p class="pdf-center-text">该考试未报名</p>
        </div>

        <div class="pdf-section" v-if="oralExamInfo.hasApplied">
          <h3>口试考试信息</h3>
          <table class="pdf-table">
            <tbody>
              <tr>
                <td class="pdf-label">考试科目：</td>
                <td class="pdf-value" colspan="3">{{ oralExamInfo.examNames }}</td>
              </tr>
              <tr>
                <td class="pdf-label">考试时间：</td>
                <td class="pdf-value" colspan="3">{{ oralExamInfo.examTime }}</td>
              </tr>
              <tr>
                <td class="pdf-label">考试地点：</td>
                <td class="pdf-value" colspan="3">{{ oralExamInfo.examLocation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pdf-section" v-if="!oralExamInfo.hasApplied">
          <h2>口试考试信息</h2>
          <p class="pdf-center-text">该考试未报名</p>
        </div>

        <div class="pdf-section">
          <h2>考生须知</h2>
          <div class="pdf-notice-content">
            <p class="pdf-notice-item">1. 考试当日考生须携带相应科目准考证、报考时使用身份证件及学校规定其他证件按规定时间到达准考证上指定的考场，迟到考生不得入场，配合监考员完成身份核对，考场签到表上签字，并按考点要求将与考试无关物品放置在指定位置。证件携带不齐全或不配合监考员完成身份核对、签到及拒绝将与考试无关物品放置在指定位置的考生将不得进入考场，情节严重的将按违规处理。</p>
            
            <p class="pdf-notice-item">2. 考生进入考场后须按准考证上的位置入座，否则按违规处理。</p>
            
            <p class="pdf-notice-item">3. 考生须听从监考员指令，在规定时间打开试卷、作答和停止作答，否则按违规处理。考试期间不得提前离场。</p>
            
            <p class="pdf-notice-item">4. 考生在答题前，请认真完成以下内容：(1)请检查试题册背面条形码粘贴条、答题卡的印刷质量，如有问题及时向监考员反映，确认无误后完成以下两点要求；(2)请将试题册背面条形码粘贴条揭下后粘贴在答题卡1的条形码粘贴框内，并将姓名和准考证号填写在试题册背面相应位置；(3)请在答题卡1和答题卡2指定位置用黑色签字笔填写准考证号、姓名和学校名称，并用HB-2B铅笔将对应准考证号的信息点涂黑。</p>
            
            <p class="pdf-notice-item">5. 考生在考试过程中，请注意以下内容：(1)所有题目必须在答题卡上规定位置作答，在试题册上或答题卡上非规定位置的作答一律无效；(2)请在规定时间内在答题卡指定位置依次完成作文、听力、阅读、翻译各部分考试，作答作文期间不得翻阅该试题册。听力录音播放完毕后，请立即停止作答，监考员将立即回收答题卡1，得到监考员指令后方可继续作答；(3)作文题内容印在试题册背面，作文题及其他主观题必须用黑色签字笔在答题卡指定区域内作答，不得撕毁试题册。</p>
            
            <p class="pdf-notice-item">6. 考生在考试过程中出现以下情况按违规处理：(1)不正确填写（涂）个人信息，错贴、不贴、毁损条形码粘贴条；(2)未按规定翻阅试题册、提前阅读试题、提前或在收答题卡期间作答；(3)未用所规定的笔作答、折叠或毁损答题卡导致无法评卷；(4)考试期间在非听力考试时间佩戴耳机；(5)CET相关规定中规定的违规行为。</p>
            
            <p class="pdf-notice-item">7. 在考试过程中出现突发事件导致考试无法正常进行时，考生须听从监考员安排，相关情况未解决之前，不得离开考场。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

const router = useRouter()
const isLoading = ref(false)
const isGeneratingPDF = ref(false)
const pdfContainer = ref(null)

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
    writtenExamInfo.examLocation = '河南科技学院新东校区 A#101 25号座位'
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
      oralExamInfo.examLocation = '河南科技学院 0#508 13号座位'
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

// 生成PDF并下载
const handlePrintTicket = async () => {
  try {
    isGeneratingPDF.value = true
    
    // 显示PDF容器
    pdfContainer.value.style.display = 'block'
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 使用html2canvas将内容转换为图片
    const canvas = await html2canvas(pdfContainer.value, {
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })
    
    // 隐藏PDF容器
    pdfContainer.value.style.display = 'none'
    
    // 创建PDF文档
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4纸宽度
    const pageHeight = 295 // A4纸高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // 添加图片到PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // 如果内容超过一页，添加新页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // 生成文件名（使用证件号码）
    const fileName = `大学英语四六级考试准考证(${userInfo.idNumber})`
    const zipName = fileName
    
    // 创建JSZip实例
    const zip = new JSZip()
    
    // 将PDF直接添加到压缩包中
    const pdfBlob = pdf.output('blob')
    zip.file(`${fileName}.pdf`, pdfBlob)
    
    // 生成压缩包
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // 创建下载链接
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${zipName}.zip`
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 释放URL对象
    URL.revokeObjectURL(url)
    
    ElMessage.success('准考证文件已生成并下载到您的下载文件夹')
    
  } catch (error) {
    console.error('生成PDF失败:', error)
    ElMessage.error('生成PDF失败，请重试')
    
    // 确保隐藏PDF容器
    if (pdfContainer.value) {
      pdfContainer.value.style.display = 'none'
    }
  } finally {
    isGeneratingPDF.value = false
  }
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

/* PDF样式 */
.pdf-container {
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 800px; /* 保持宽度不变，以适应A4纸 */
  background: white;
  padding: 40px; /* 增大内边距 */
  font-family: 'SimSun', serif;
}

.pdf-content {
  max-width: 100%;
}

.pdf-header {
  text-align: center;
  margin-bottom: 30px; /* 增大间距 */
  border-bottom: 2px solid #000;
  padding-bottom: 15px;
}

.pdf-header h1 {
  font-size: 24px; /* 增大字体 */
  font-weight: bold;
  margin-bottom: 10px; /* 增大间距 */
  color: #000;
}

.pdf-section {
  margin-bottom: 25px; /* 增大间距 */
}

.pdf-section h2 {
  font-size: 18px; /* 增大字体 */
  font-weight: bold;
  margin-bottom: 12px; /* 增大间距 */
  color: #000;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.pdf-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px; /* 增大间距 */
}

.pdf-table td {
  border: 1px solid #000;
  padding: 8px 12px; /* 增大内边距 */
  font-size: 14px; /* 增大字体 */
  vertical-align: top;
}

.pdf-label {
  background-color: #f5f5f5;
  font-weight: bold;
  width: 110px; /* 增大宽度 */
  text-align: center;
}

.pdf-value {
  background-color: #fff;
  min-width: 160px; /* 增大最小宽度 */
}

.pdf-header-cell {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
}

.pdf-center-text {
  text-align: center;
  font-size: 16px; /* 增大字体 */
  margin-top: 15px; /* 增大间距 */
  color: #333;
}

.pdf-notice-content {
  margin-top: 15px; /* 增大间距 */
}

.pdf-notice-item {
  font-size: 12px; /* 增大字体 */
  line-height: 1.6; /* 增大行高 */
  margin-bottom: 0;
  text-align: justify;
  color: #000;
}

.pdf-notice-item:last-child {
  margin-bottom: 0;
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