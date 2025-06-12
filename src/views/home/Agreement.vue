<template>
  <div class="agreement-container">
    <div class="agreement-content">
      <h3 class="agreement-title">全国大学英语四、六级考试(CET)报名协议</h3>
      
      <div class="agreement-text">
        <p>尊敬的考生：</p>
        <p>欢迎参加全国大学英语四、六级考试(CET)。在报名前，请认真阅读以下协议内容：</p>
        
        <h4>一、考试须知</h4>
        <p>1. 全国大学英语四、六级考试(CET)由教育部高等教育司主办，是一项大规模标准化考试。</p>
        <p>2. 考生须严格遵守《全国大学英语四、六级考试考生须知》中的各项规定。</p>
        <p>3. 考生须按要求完成报名、缴费和准考证打印等各个环节。</p>
        
        <h4>二、考生资格</h4>
        <p>1. 全日制普通高等院校在校学生，凭学校学籍信息参加考试。</p>
        <p>2. 专升本、研究生及其他各类在校学生，可凭所在学校出具的在籍证明报名参加考试。</p>
        <p>3. 符合条件的社会人员可按照相关规定报名参加考试。</p>
        
        <h4>三、信息采集</h4>
        <p>1. 考生须如实填写个人信息，包括但不限于姓名、证件号码、联系方式等。</p>
        <p>2. 考生应当对所提供信息的真实性、准确性和完整性负责，如因信息有误导致无法参加考试或影响考试成绩，由考生本人承担责任。</p>
        <p>3. 考生信息将按照国家相关法律法规予以保护，不会用于与考试无关的其他用途。</p>
        
        <h4>四、缴费规定</h4>
        <p>1. 考生须在规定时间内完成报名费用的缴纳，否则报名无效。</p>
        <p>2. 缴费成功后，除符合退费条件外，已缴纳的费用不予退还。</p>
        <p>3. 退费申请须在规定时间内提出，并符合退费条件。</p>
        
        <h4>五、考试违规处理</h4>
        <p>1. 考生在考试过程中须遵守考场纪律，不得有任何违规行为。</p>
        <p>2. 对于违反考试规定的考生，将按照《国家教育考试违规处理办法》进行处理。</p>
        <p>3. 严重违规者将被记入诚信档案，并可能影响今后的相关考试资格。</p>
        
        <h4>六、成绩公布</h4>
        <p>1. 考试成绩将于考后约两个月内公布。</p>
        <p>2. 考生可通过官方指定渠道查询成绩。</p>
        <p>3. 如对成绩有疑问，可按规定程序申请成绩复查。</p>
        
        <h4>七、免责声明</h4>
        <p>1. 因不可抗力因素导致考试延期、取消或其他变更，主办方将及时通知考生并妥善处理。</p>
        <p>2. 考生应遵守考试当地疫情防控等相关规定，因个人原因不符合防疫要求无法参加考试的，责任自负。</p>
        <p>3. 本协议最终解释权归全国大学英语四、六级考试委员会所有。</p>
        
        <p class="agreement-conclusion">本人已阅读并同意上述协议内容，承诺遵守各项规定，并对自己的报名信息和考试行为负责。</p>
      </div>
    </div>
    
    <div class="agreement-actions">
      <label class="agreement-checkbox">
        <input type="checkbox" v-model="isAgreed" :disabled="isStepCompleted">
        <span class="checkbox-text">我已阅读并同意《全国大学英语四、六级考试(CET)报名协议》</span>
      </label>
      <button 
        class="btn-next" 
        @click="handleCompleteStep"
        :disabled="!isAgreed || loading || isStepCompleted"
        :class="{ 
          'loading': loading,
          'completed': isStepCompleted 
        }"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else-if="isStepCompleted" class="completed-icon">✓</span>
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'

const router = useRouter()
const isAgreed = ref(false)
const loading = ref(false)

// 计算属性：当前步骤是否已完成
const isStepCompleted = computed(() => {
  return registrationService.completedSteps.includes(REGISTRATION_STEPS.AGREEMENT)
})

// 按钮文本
const buttonText = computed(() => {
  if (isStepCompleted.value) {
    return '已完成'
  }
  return '同意并继续'
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
  if (!isAgreed.value) {
    ElMessage.warning('请先同意报名协议')
    return
  }

  if (isStepCompleted.value) {
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
    
    // 调用报名服务完成步骤，使用id作为studentId
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.AGREEMENT)
    
    ElMessage.success('协议确认成功')
    
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

// 页面加载时检查当前步骤状态
onMounted(async () => {
  const userInfo = getUserInfo()
  console.log(userInfo)
  
  if (!userInfo) {
    console.error('用户信息不存在')
    router.push('/login')
    return
  }

  // 验证 id 是否有效
  if (!userInfo.id || isNaN(userInfo.id)) {
    console.log('用户ID:', userInfo.id)
    console.error('用户 ID 无效')
    ElMessage.error('用户ID无效，请重新登录')
    router.push('/login')
    return
  }

  try {
    // 获取报名信息，使用id作为studentId
    await registrationService.getRegistrationInfo(userInfo.id)
    
    // 如果当前步骤已完成，自动勾选复选框
    if (registrationService.completedSteps.includes(REGISTRATION_STEPS.AGREEMENT)) {
      isAgreed.value = true
    }
  } catch (error) {
    console.error('获取报名信息失败:', error)
    // 如果获取失败，可能是首次访问，继续显示当前页面
  }
})
</script>

<style scoped>
.agreement-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.agreement-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
}

.agreement-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.agreement-text {
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
}

.agreement-text h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-top: 20px;
  margin-bottom: 10px;
}

.agreement-text p {
  margin-bottom: 10px;
}

.agreement-conclusion {
  font-weight: 600;
  margin-top: 20px;
  text-align: right;
}

.agreement-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.agreement-checkbox input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  accent-color: #409EFF;
}

.agreement-checkbox .checkbox-text {
  user-select: none;
}

.btn-next {
  background-color: #409EFF;
  color: white;
  border: none;
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
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.btn-next:hover {
  background-color: #66b1ff;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.btn-next:active {
  background-color: #3a8ee6;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
}

.btn-next:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #a0cfff;
  box-shadow: none;
}

.btn-next.completed {
  background-color: #67c23a;
  cursor: not-allowed;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.btn-next.completed:hover {
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

.completed-icon {
  font-size: 20px;
  font-weight: bold;
  margin-right: 5px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .agreement-content {
    padding: 15px;
  }
}
</style> 