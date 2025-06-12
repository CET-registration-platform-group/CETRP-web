<template>
  <div class="qualification-container">
    <div class="query-section">
      <h3 class="section-title">查询资格信息</h3>
      <p class="section-desc">请输入您的证件信息进行查询</p>
      
      <div class="form-content">
        <div class="form-group">
          <label class="form-label">证件类型</label>
          <select class="form-input" v-model="formData.idType" :disabled="isStepCompleted">
            <option value="居民身份证">中华人民共和国居民身份证</option>
            <option value="护照">护照</option>
            <option value="港澳通行证">港澳通行证</option>
            <option value="台湾通行证">台湾通行证</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">证件号码</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="请输入证件号码" 
            v-model="formData.idNumber" 
            maxlength="18"
            :disabled="isStepCompleted"
          />
          <div class="form-error" v-if="errors.idNumber">{{ errors.idNumber }}</div>
        </div>
        
        <div class="form-group">
          <label class="form-label">姓名</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="请输入姓名" 
            v-model="formData.name" 
            maxlength="20"
            :disabled="isStepCompleted"
          />
          <div class="form-error" v-if="errors.name">{{ errors.name }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary" @click="handleQuery" :disabled="isLoading || isStepCompleted">
          <span v-if="isLoading">查询中...</span>
          <span v-else-if="isStepCompleted">已查询</span>
          <span v-else>查询</span>
        </button>
      </div>
    </div>
    
    <!-- 查询结果 -->
    <div class="result-section" v-if="queryResult">
      <h3 class="section-title">查询结果</h3>
      
      <div class="result-content">
        <div class="result-item">
          <span class="label">查询状态：</span>
          <span class="value" :class="{'status-success': queryResult.status === '符合报名资格'}">
            {{ queryResult.status }}
          </span>
        </div>
        
        <div class="result-info" v-if="queryResult.status === '符合报名资格'">
          <div class="result-item">
            <span class="label">学籍信息：</span>
            <span class="value">{{ queryResult.schoolInfo }}</span>
          </div>
          <div class="result-item">
            <span class="label">学号：</span>
            <span class="value">{{ queryResult.studentId }}</span>
          </div>
        </div>
        
        <div class="result-error" v-if="queryResult.status !== '符合报名资格'">
          <p>{{ queryResult.message }}</p>
          <p class="error-tip">如有疑问，请联系所在学校教务处或考试中心。</p>
        </div>
      </div>
    </div>
    
    <div class="qualification-actions">
      <button 
        class="btn-next" 
        @click="handleCompleteStep"
        :disabled="!canProceed || loading || isStepCompleted"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'
import { QUALIFICATION_API, request } from '../../config/api.js'
import { REGISTRATION_API } from '../../config/api.js'

const router = useRouter()
const isLoading = ref(false)
const loading = ref(false)
const queryResult = ref(null)

const formData = reactive({
  idType: '居民身份证',
  idNumber: '',
  name: ''
})

const errors = reactive({
  idNumber: '',
  name: ''
})

// 计算属性：当前步骤是否已完成
const isStepCompleted = computed(() => {
  return registrationService.completedSteps.includes(REGISTRATION_STEPS.QUAL_QUERY)
})

// 按钮文本
const buttonText = computed(() => {
  if (isStepCompleted.value) {
    return '已完成'
  }
  return '确认并继续'
})

// 计算是否可以继续
const canProceed = computed(() => {
  return queryResult.value && queryResult.value.status === '符合报名资格'
})

const validateForm = () => {
  let isValid = true
  
  // 重置错误信息
  errors.idNumber = ''
  errors.name = ''
  
  // 验证证件号码
  if (!formData.idNumber) {
    errors.idNumber = '请输入证件号码'
    isValid = false
  } else if (formData.idType === '居民身份证' && !/^\d{17}[\dX]$/.test(formData.idNumber)) {
    errors.idNumber = '请输入有效的身份证号码'
    isValid = false
  }
  
  // 验证姓名
  if (!formData.name) {
    errors.name = '请输入姓名'
    isValid = false
  } else if (formData.name.length < 2) {
    errors.name = '姓名长度不能少于2个字符'
    isValid = false
  }
  
  return isValid
}

const handleQuery = async () => {
  if (!validateForm()) {
    return
  }
  
  // 如果步骤已完成，不执行查询
  if (isStepCompleted.value) {
    return
  }

  isLoading.value = true
  
  try {
    // 直接调用报名信息接口进行资格查询
    // 如果报名信息存在，说明用户有资格报名
    const userInfo = getUserInfo()
    if (!userInfo) {
      ElMessage.error('用户信息不存在，请重新登录')
      router.push('/login')
      return
    }
    
    const data = await request(REGISTRATION_API.GET_INFO(userInfo.id))
    
    if (data.code === 200) {
      // 报名信息存在，资格查询成功
      queryResult.value = {
        status: '符合报名资格',
        schoolInfo: '已通过资格验证',
        studentId: userInfo.id,
        message: '符合报名资格'
      }
      
      ElMessage.success('资格查询成功')
    } else if (data.code === 404) {
      // 报名信息不存在，但用户已登录，说明是新用户，也有资格报名
      queryResult.value = {
        status: '符合报名资格',
        schoolInfo: '新用户',
        studentId: userInfo.id,
        message: '符合报名资格（新用户）'
      }
      
      ElMessage.success('资格查询成功（新用户）')
    } else {
      queryResult.value = {
        status: '查询失败',
        message: data.message || '查询失败，请稍后重试'
      }
      ElMessage.error(data.message || '查询失败，请稍后重试')
    }
  } catch (error) {
    console.error('查询出错', error)
    queryResult.value = {
      status: '查询失败',
      message: '网络错误，请稍后重试'
    }
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

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
  if (!canProceed.value) {
    ElMessage.warning('请先完成资格查询')
    return
  }

  // 如果步骤已完成，不执行任何操作
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
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.QUAL_QUERY)
    
    // 存储查询结果到localStorage，供后续步骤使用
    localStorage.setItem('qualificationInfo', JSON.stringify({
      idType: formData.idType,
      idNumber: formData.idNumber,
      name: formData.name,
      schoolInfo: queryResult.value.schoolInfo,
      studentId: queryResult.value.studentId
    }))
    
    ElMessage.success('资格确认成功')
    
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
  if (!userInfo) {
    router.push('/login')
    return
  }
  
  if (!userInfo.id || isNaN(userInfo.id)) {
    ElMessage.error('用户ID无效，请重新登录')
    router.push('/login')
    return
  }

  try {
    // 获取报名信息，使用id作为studentId
    await registrationService.getRegistrationInfo(userInfo.id)
    
    // 如果当前步骤已完成，自动填充数据并禁用查询按钮
    if (isStepCompleted.value) {
      const qualInfo = localStorage.getItem('qualificationInfo')
      if (qualInfo) {
        const parsedQualInfo = JSON.parse(qualInfo)
        formData.idType = parsedQualInfo.idType
        formData.idNumber = parsedQualInfo.idNumber
        formData.name = parsedQualInfo.name
        // 模拟查询结果为已完成状态
        queryResult.value = {
          status: '符合报名资格',
          schoolInfo: parsedQualInfo.schoolInfo,
          studentId: parsedQualInfo.studentId,
          message: '已完成资格查询'
        }
      }
    }
  } catch (error) {
    console.error('获取报名信息失败:', error)
  }
})
</script>

<style scoped>
.qualification-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.query-section,
.result-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.section-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  margin-bottom: 10px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  color: #303133;
  background-color: #f9fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #409EFF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  background-color: white;
}

.form-input:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-error {
  color: #F56C6C;
  font-size: 12px;
  margin-top: 5px;
  min-height: 18px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.btn-primary:hover {
  background-color: #66b1ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.btn-primary:active {
  background-color: #3a8ee6;
  box-shadow: 0 1px 4px rgba(64, 158, 255, 0.1);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #a0cfff;
  box-shadow: none;
}

.result-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #e4e7ed;
}

.result-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
}

.result-item .label {
  color: #909399;
  flex-shrink: 0;
  width: 80px;
}

.result-item .value {
  color: #303133;
  flex-grow: 1;
}

.status-success {
  color: #67C23A;
  font-weight: 600;
}

.result-error {
  color: #F56C6C;
  font-size: 14px;
  line-height: 1.6;
}

.error-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.qualification-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
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
  .section-title {
    font-size: 16px;
  }
  
  .section-desc {
    font-size: 12px;
  }
}

</style> 