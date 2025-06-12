<template>
  <div class="confirm-info-container">
    <div class="confirm-section">
      <h3 class="section-title">确认个人信息</h3>
      <p class="section-desc">请仔细核对以下信息，确认无误后继续下一步</p>
      
      <!-- 当没有资格信息时显示提示 -->
      <div v-if="!hasQualificationInfo" class="no-info-tip">
        <div class="tip-content">
          <i class="tip-icon">⚠️</i>
          <h4>请先完成资格信息查询</h4>
          <p>您需要先完成资格信息查询步骤，才能进行信息确认。</p>
          <button class="btn btn-primary" @click="goToQualification">前往资格信息查询</button>
        </div>
      </div>
      
      <!-- 当有资格信息时显示确认表单 -->
      <div v-else>
        <div class="info-content">
          <div class="info-card">
            <h4 class="info-card-title">基本信息</h4>
            <div class="info-item">
              <span class="label">证件类型：</span>
              <span class="value">{{ userInfo.idType }}</span>
            </div>
            <div class="info-item">
              <span class="label">证件号码：</span>
              <span class="value">{{ userInfo.idNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">姓名：</span>
              <span class="value">{{ userInfo.name }}</span>
            </div>
          </div>
          
          <div class="info-card">
            <h4 class="info-card-title">学校信息</h4>
            <div class="info-item">
              <span class="label">学校：</span>
              <span class="value">{{ userInfo.schoolInfo }}</span>
            </div>
            <div class="info-item">
              <span class="label">资格状态：</span>
              <span class="value">已通过资格验证</span>
            </div>
            <div class="info-item">
              <span class="label">学号：</span>
              <span class="value">{{ userInfo.studentId }}</span>
            </div>
          </div>
          
          <div class="info-card">
            <h4 class="info-card-title">联系方式</h4>
            <div class="info-item">
              <span class="label">手机号码：</span>
              <span class="value">{{ userInfo.phone || '未设置' }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮箱：</span>
              <span class="value">{{ userInfo.email || '未设置' }}</span>
            </div>
          </div>
        </div>
        
        <div class="confirm-checkbox">
          <label>
            <input type="checkbox" v-model="isConfirmed" />
            <span>我已仔细核对以上信息，确认无误</span>
          </label>
        </div>
        
        <div class="action-buttons" :style="{ justifyContent: 'center' }">
          <button 
            class="btn" 
            :class="{ 'btn-primary': !isStepCompleted, 'btn-completed': isStepCompleted }"
            @click="handleNext" 
            :disabled="!isConfirmed || isStepCompleted || loading"
          >
            <span v-if="isStepCompleted">✓ 已完成</span>
            <span v-else-if="loading">确认中...</span>
            <span v-else>确认并继续</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'

const router = useRouter()
const isConfirmed = ref(false)
const loading = ref(false)
const userInfo = reactive({
  idType: '',
  idNumber: '',
  name: '',
  schoolInfo: '',
  majorInfo: '',
  studentId: '',
  phone: '',
  email: ''
})

// 计算属性：当前步骤是否已完成
const isStepCompleted = computed(() => {
  return registrationService.completedSteps.includes(REGISTRATION_STEPS.QUAL_CONFIRM)
})

// 检查是否有资格信息
const hasQualificationInfo = computed(() => {
  const qualificationInfo = localStorage.getItem('qualificationInfo')
  return !!qualificationInfo
})

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

// 跳转到资格查询页面
const goToQualification = () => {
  router.push('/home/qualification')
}

onMounted(async () => {
  // 从localStorage获取之前查询的资格信息
  const qualificationInfo = localStorage.getItem('qualificationInfo')
  
  if (qualificationInfo) {
    const info = JSON.parse(qualificationInfo)
    userInfo.idType = info.idType
    userInfo.idNumber = info.idNumber
    userInfo.name = info.name
    userInfo.schoolInfo = info.schoolInfo
    userInfo.majorInfo = info.majorInfo
    userInfo.studentId = info.studentId
  } else {
    // 如果没有资格信息，重定向到资格查询页面
    router.push('/home/qualification')
    return
  }
  
  // 获取报名信息
  const currentUserInfo = getUserInfo()
  if (!currentUserInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    return
  }

  // 从用户信息中获取手机号和邮箱
  userInfo.phone = currentUserInfo.phone || ''
  userInfo.email = currentUserInfo.email || ''

  try {
    // 获取最新报名信息以同步状态
    await registrationService.getRegistrationInfo(currentUserInfo.id)

    // 如果当前步骤已完成，自动勾选确认框
    if (isStepCompleted.value) {
      isConfirmed.value = true
    }
    
  } catch (error) {
    console.error('获取报名信息失败:', error)
    ElMessage.error(error.message || '获取报名信息失败，请重试')
  }
})

// 处理下一步
const handleNext = async () => {
  if (!isConfirmed.value) {
    ElMessage.warning('请先勾选确认信息无误')
    return
  }

  if (isStepCompleted.value) {
    return
  }

  const currentUserInfo = getUserInfo()
  if (!currentUserInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    return
  }
  
  try {
    loading.value = true
    
    // 存储确认后的完整信息
    const confirmInfo = {
      ...userInfo,
      phone: userInfo.phone,
      email: userInfo.email
    }
    localStorage.setItem('confirmInfo', JSON.stringify(confirmInfo))

    // 调用报名服务完成步骤
    await registrationService.completeStep(currentUserInfo.id, REGISTRATION_STEPS.QUAL_CONFIRM)
    
    ElMessage.success('信息确认成功')
    
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
</script>

<style scoped>
.confirm-info-container {
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

.no-info-tip {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
}

.tip-content {
  max-width: 400px;
  margin: 0 auto;
}

.tip-icon {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.tip-content h4 {
  color: #856404;
  margin-bottom: 10px;
  font-size: 18px;
}

.tip-content p {
  color: #856404;
  margin-bottom: 20px;
  line-height: 1.5;
}

.info-content {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.info-card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border-color);
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: var(--text-secondary);
  width: 100px;
  flex-shrink: 0;
}

.value {
  color: var(--text-primary);
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-error {
  color: var(--danger-color);
  font-size: 12px;
  margin-top: 5px;
}

.confirm-checkbox {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.confirm-checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.confirm-checkbox span {
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-completed {
  background-color: #67c23a;
  color: white;
  cursor: not-allowed;
}

.btn-completed:hover {
  background-color: #67c23a;
}

@media (max-width: 768px) {
  .info-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .label {
    width: auto;
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