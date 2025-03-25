<template>
  <div class="confirm-info-container">
    <div class="info-section">
      <h3 class="section-title">确认个人信息</h3>
      <p class="section-desc">请仔细核对以下信息，确认无误后继续下一步</p>
      
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
            <span class="label">专业：</span>
            <span class="value">{{ userInfo.majorInfo }}</span>
          </div>
          <div class="info-item">
            <span class="label">学号：</span>
            <span class="value">{{ userInfo.studentId }}</span>
          </div>
        </div>
        
        <div class="info-card">
          <h4 class="info-card-title">补充信息</h4>
          <div class="form-group">
            <label class="form-label">手机号码</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="请输入手机号码" 
              v-model="formData.phone" 
              maxlength="11"
            />
            <div class="form-error" v-if="errors.phone">{{ errors.phone }}</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input 
              type="email" 
              class="form-input" 
              placeholder="请输入邮箱" 
              v-model="formData.email"
            />
            <div class="form-error" v-if="errors.email">{{ errors.email }}</div>
          </div>
        </div>
      </div>
      
      <div class="confirm-checkbox">
        <label>
          <input type="checkbox" v-model="isConfirmed" />
          <span>我已仔细核对以上信息，确认无误</span>
        </label>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-default" @click="handleBack">返回</button>
        <button class="btn btn-primary" @click="handleNext" :disabled="!isConfirmed || !isValid">确认并继续</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isConfirmed = ref(false)
const userInfo = reactive({
  idType: '',
  idNumber: '',
  name: '',
  schoolInfo: '',
  majorInfo: '',
  studentId: ''
})

const formData = reactive({
  phone: '',
  email: ''
})

const errors = reactive({
  phone: '',
  email: ''
})

const validateForm = () => {
  let isValid = true
  
  // 重置错误信息
  errors.phone = ''
  errors.email = ''
  
  // 验证手机号
  if (!formData.phone) {
    errors.phone = '请输入手机号码'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = '请输入有效的手机号码'
    isValid = false
  }
  
  // 验证邮箱
  if (!formData.email) {
    errors.email = '请输入邮箱'
    isValid = false
  } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  return isValid
}

// 实时验证表单
const isValid = computed(() => {
  return formData.phone && /^1[3-9]\d{9}$/.test(formData.phone) &&
         formData.email && /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)
})

onMounted(() => {
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
    // 如果没有信息，返回上一步
    router.push('/registration/qualification')
  }
})

const handleNext = () => {
  if (!validateForm() || !isConfirmed.value) {
    return
  }
  
  // 存储确认后的完整信息
  const confirmInfo = {
    ...userInfo,
    phone: formData.phone,
    email: formData.email
  }
  localStorage.setItem('confirmInfo', JSON.stringify(confirmInfo))
  
  router.push('/registration/written-exam')
}

const handleBack = () => {
  router.push('/registration/qualification')
}
</script>

<style scoped>
.confirm-info-container {
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

.info-content {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background-color: var(--bg-light);
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

.form-label {
  font-weight: 500;
  color: var(--text-secondary);
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