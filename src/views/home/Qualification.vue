<template>
  <div class="qualification-container">
    <div class="query-section">
      <h3 class="section-title">查询资格信息</h3>
      <p class="section-desc">请输入您的证件信息进行查询</p>
      
      <div class="form-content">
        <div class="form-group">
          <label class="form-label">证件类型</label>
          <select class="form-input" v-model="formData.idType">
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
          />
          <div class="form-error" v-if="errors.name">{{ errors.name }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-default" @click="handleBack">返回</button>
        <button class="btn btn-primary" @click="handleQuery" :disabled="isLoading">
          <span v-if="isLoading">查询中...</span>
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
            <span class="label">专业信息：</span>
            <span class="value">{{ queryResult.majorInfo }}</span>
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
      
      <div class="action-buttons">
        <button class="btn btn-default" @click="resetQuery">重新查询</button>
        <button 
          class="btn btn-primary" 
          @click="handleNext" 
          v-if="queryResult.status === '符合报名资格'"
        >
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
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
  
  isLoading.value = true
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await fetch('/api/student/qualification/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idType: formData.idType,
        idNumber: formData.idNumber,
        name: formData.name
      })
    })

    const data = await response.json()
    
    if (data.code === 200) {
      queryResult.value = {
        status: data.data.qualified ? '符合报名资格' : '不符合报名资格',
        schoolInfo: data.data.schoolInfo,
        majorInfo: data.data.majorInfo,
        studentId: data.data.studentId,
        message: data.data.message
      }
    } else {
      queryResult.value = {
        status: '查询失败',
        message: data.message || '查询失败，请稍后重试'
      }
    }
  } catch (error) {
    console.error('查询出错', error)
    queryResult.value = {
      status: '查询失败',
      message: '网络错误，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

const resetQuery = () => {
  queryResult.value = null
}

const handleNext = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // 调用完成步骤接口
    const response = await fetch('/api/student/registration/complete-step', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        step: 2,
        data: {
          idType: formData.idType,
          idNumber: formData.idNumber,
          name: formData.name,
          schoolInfo: queryResult.value.schoolInfo,
          majorInfo: queryResult.value.majorInfo,
          studentId: queryResult.value.studentId
        }
      })
    })

    const data = await response.json()
    if (data.code === 200) {
      // 存储查询结果到localStorage，供后续步骤使用
      localStorage.setItem('qualificationInfo', JSON.stringify({
        idType: formData.idType,
        idNumber: formData.idNumber,
        name: formData.name,
        schoolInfo: queryResult.value.schoolInfo,
        majorInfo: queryResult.value.majorInfo,
        studentId: queryResult.value.studentId
      }))
      
      router.push('/home/confirm-info')
    } else {
      alert(data.message || '操作失败')
    }
  } catch (error) {
    console.error('完成步骤失败:', error)
    alert('操作失败，请重试')
  }
}

const handleBack = () => {
  router.push('/home/agreement')
}
</script>

<style scoped>
.qualification-container {
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

.form-content {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.result-section {
  background-color: var(--bg-light);
  border-radius: 8px;
  padding: 20px;
}

.result-content {
  margin-bottom: 20px;
}

.result-item {
  display: flex;
  align-items: baseline;
  margin-bottom: 15px;
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

.result-error {
  color: var(--danger-color);
  background-color: #fff2f2;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid var(--danger-color);
}

.error-tip {
  font-size: 14px;
  margin-top: 10px;
  color: var(--text-secondary);
}

.status-success {
  color: var(--success-color);
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
  
  .result-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .label {
    width: auto;
  }
}
</style> 