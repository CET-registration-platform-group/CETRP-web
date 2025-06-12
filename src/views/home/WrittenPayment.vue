<template>
  <div class="payment-container">
    <div class="payment-section">
      <h3 class="section-title">笔试缴费</h3>
      <p class="section-desc">请选择支付方式完成笔试报名费用支付</p>
      
      <div class="payment-info">
        <div class="info-card">
          <h4 class="card-title">订单信息</h4>
          <div class="info-item">
            <span class="label">订单号：</span>
            <span class="value">{{ orderInfo.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">考试名称：</span>
            <span class="value">2025年上半年全国大学英语四、六级考试(笔试)</span>
          </div>
          <div class="info-item">
            <span class="label">报考科目：</span>
            <span class="value">{{ orderInfo.examNames }}</span>
          </div>
          <div class="info-item">
            <span class="label">报考费用：</span>
            <span class="value price">¥ {{ orderInfo.totalPrice }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付期限：</span>
            <span class="value">{{ orderInfo.paymentDeadline }}</span>
          </div>
        </div>
        
        <div class="payment-methods">
          <h4 class="card-title">支付方式</h4>
          <div class="methods-list">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="method-item"
              :class="{ 'selected': selectedMethod === method.id }"
              @click="selectedMethod = method.id"
            >
              <div class="method-radio">
                <input 
                  type="radio" 
                  :id="method.id" 
                  name="paymentMethod" 
                  :checked="selectedMethod === method.id"
                />
                <label :for="method.id"></label>
              </div>
              <!-- <div class="method-logo">
                <img :src="method.logo" :alt="method.name" />
              </div> -->
              <div class="method-name">{{ method.name }}</div>
            </div>
          </div>
        </div>
        
        <div class="total-amount">
          <span class="amount-text">需支付：</span>
          <span class="amount-value">¥ {{ orderInfo.totalPrice }}</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button 
          class="btn" 
          :class="{ 'btn-primary': !isPaymentCompleted, 'btn-completed': isPaymentCompleted }"
          @click="handlePay" 
          :disabled="isLoading || !selectedMethod || isPaymentCompleted"
        >
          <span v-if="isPaymentCompleted">✓ 已支付</span>
          <span v-else-if="isLoading">支付中...</span>
          <span v-else>确认支付</span>
        </button>
      </div>
    </div>
    
    <!-- 支付结果 -->
    <div class="payment-result" v-if="paymentStatus">
      <div class="result-icon" :class="paymentStatus.success ? 'success' : 'failed'">
        <i class="icon"></i>
      </div>
      <h3 class="result-title">{{ paymentStatus.title }}</h3>
      <p class="result-message">{{ paymentStatus.message }}</p>
      
      <div class="result-actions">
        <button 
          v-if="!paymentStatus.success" 
          class="btn btn-primary" 
          @click="resetPayment"
        >
          重新支付
        </button>
        <button 
          class="btn btn-primary" 
          @click="handleNext"
        >
          {{ paymentStatus.success ? '继续报名' : '暂不支付' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'

const router = useRouter()
const isLoading = ref(false)
const selectedMethod = ref('')
const paymentStatus = ref(null)

// 检查支付是否已完成
const isPaymentCompleted = computed(() => {
  return registrationService.completedSteps.includes(REGISTRATION_STEPS.WRITTEN_PAY)
})

// 支付方式
const paymentMethods = [
  {
    id: 'alipay',
    name: '支付宝',
    logo: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNjI3NTM1OTAwMDYzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ4NzAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMjMwLjQgNzkxLjZjLTEyLjggMC0yNS42LTEyLjgtMjUuNi0yNS42VjI1NmMwLTEyLjggMTIuOC0yNS42IDI1LjYtMjUuNmg1NjMuMmMxMi44IDAgMjUuNiAxMi44IDI1LjYgMjUuNnY1MTJjMCAxMi44LTEyLjggMjUuNi0yNS42IDI1LjZIMjMwLjR6IiBmaWxsPSIjMUE4MUM0IiBwLWlkPSI0ODcxIj48L3BhdGg+PHBhdGggZD0iTTYxNC40IDU0NGMtNjQgMzItMTQwLjggNTcuNi0yMTcuNiA3Ni44LTEyLjggMy4yLTI1LjYgNi40LTM4LjQgOS42IDkuNiAzMiAyOC44IDY0IDU3LjYgODkuNkM0NzMuNiA3NTUuMiA1MzcuNiA3OTcuNiA2MjQgNzk3LjZjODYuNCAwIDE1My42LTQ0LjggMTkyLTExNS4yLTU3LjYtMjguOC0xMjEuNi02MC44LTIwMS42LTEzOC40eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iNDg3MiI+PC9wYXRoPjxwYXRoIGQ9Ik04MTYgNjA4YzAtMy4yLTMuMi02LjQtMy4yLTYuNCAzLjItMTYgNi40LTM1LjIgNi40LTU0LjQgMC00MS42LTkuNi04My4yLTI1LjYtMTIxLjZIMjMwLjRjLTEyLjggMC0yNS42IDEyLjgtMjUuNiAyNS42djUxMmMwIDEyLjggMTIuOCAyNS42IDI1LjYgMjUuNmg1NjMuMmMxMi44IDAgMjUuNi0xMi44IDI1LjYtMjUuNlY2MDhIMTYwLjZ2LTM1LjJINDgzLjJjLTEyLjggMy4yLTI1LjYgMy4yLTM4LjQgNi40LTM1LjIgNi40LTY3LjIgOS42LTk2IDEyLjgtMjguOCAzLjItNTcuNiA2LjQtODMuMiA5LjYgOS42IDI1LjYgMjUuNiA1NC40IDQ4IDczLjYgMzguNCAzOC40IDgzLjIgNTQuNCAx0NTMuNiA1NC40czExNS4yLTQxLjYgMTQ3LjItODkuNmMtNTcuNi0yOC44LTEwOC44LTU3LjYtMTk1LjItMTI4IDAgNi40LTMuMiAxMi44LTMuMiAxOS4yIDM1LjIgMTkuMiA2NCAzMiA5NiA0MS42IDYuNCAxLjYgOS42IDEuNiAxNiAzLjIgMCAwIDAtMy4yLTMuMi0zLjJ6TTQ4MCA1MTJoLTE3OS4ybDEyLjgzLjJoMTY2LjR2MTIuOHoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjQ4NzMiPjwvcGF0aD48L3N2Zz4='
  },
  {
    id: 'wechat',
    name: '微信支付',
    logo: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNTU1OTkxNjQzMTg5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNjg4LjM2NTcxNSAzNDMuNDI0MTQ4Yy0xNi4zODc5ODEgMC0zMi43NDUxNzIgMTAuOTM0MTIyLTMyLjc0NTE3MiAyNy4zNDc4ODMgMCAxNi4zNTQyMTIgMTYuMzU3MjgyIDI3LjMxNDExNCAzMi43NDUxNzIgMjcuMzE0MTE0IDE2LjQyMjc3NSAwIDMzLjA3MTI5LTEwLjkyMDk4IDMzLjA3MTI5LTI3LjMxNDExNEMyMjEuNDM3MDA1IDM1NC4zNTgyNyAyMDQuNzg4NDg5IDM0My40MjQxNDggMTg4LjM2NTcxNSAzNDMuNDI0MTQ4ek01MBIB1MDkuOTcyODc4IDE2LjM4Nzk4MSA0ODguMDE3Mjk3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMjAuNzUwMTc5LCAxMzQuMzEwNDk1KSIgZmlsbD0iIzUwQjY3NCIgcC1pZD0iMjM0OSI+PC9wYXRoPjwvc3ZnPg=='
  },
  {
    id: 'unionpay',
    name: '银联支付',
    logo: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNjk4ODQ1NDQyNTkwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjYzODgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODMxLjggNjUzLjRjMC0xMS42LTkuNC0yMC44LTIwLjgtMjAuOEgyMTNjLTExLjYgMC0yMC44IDkuNC0yMC44IDIwLjh2MzAuNmMwIDExLjYgOS40IDIwLjggMjAuOCAyMC44aDU5OGMxMS42IDAgMjAuOC05LjQgMjAuOC0yMC44di0zMC42ek0yMzMuOCA0OTUuOGg1NTYuNGMxMS42IDAgMjAuOC05LjQgMjAuOC0yMC44di0zMC42YzAtMTEuNi05LjQtMjAuOC0yMC44LTIwLjhIMjMzLjhjLTExLjYgMC0yMC44IDkuNC0yMC44IDIwLjh2MzAuNmMwIDExLjQgOS40IDIwLjggMjAuOCAyMC44eiBtNjEzLjYtMTg0LjZIMTcwLjZjLTMyLjggMC01OS40IDI2LjYtNTkuNCA1OS40djI4Mi44YzAgMzIuOCAyNi42IDU5LjQgNTkuNCA1OS40aDY3MC44YzMyLjggMCA1OS40LTI2LjYgNTkuNC01OS40VjM3MC42Yy0wLjItMzIuOC0yNi44LTU5LjQtNTkuNC01OS40eiIgZmlsbD0iIzFCM0I4OSIgcC1pZD0iNjM4OSI+PC9wYXRoPjxwYXRoIGQ9Ik02ODAuNiA1NDRIMzQzLjRjLTkuNCAwLTE3IDcuNi0xNyAxN3YxOC4yYzAgOS40IDcuNiAxNyAxNyAxN2gzMzcuMmM5LjQgMCAxNy03LjYgMTctMTdWNTYxYzAtOS40LTcuNi0xNy0xNy0xN3pNMTggMCIgZmlsbD0iI0YxN, NkM2OCwgNzMuNiwgODIgNTkuMiwgNjcuNCwgNDkuNCwgNjcuNCwgNDIuNiwgNjcuNCwgMjQ3LjIsIDU2LjQsIDI0Ny4yLCA0OS40LCAyNDcuMiwgNDAuMnYyM2MwIDExLjQgOS40IDIwLjggMjAuOCAyMC44aDEzMi4yYzExLjYgMCAyMC44LTkuNCAyMC44LTIwLjh2LTIzYy0wLjItMTEuNi05LjYtMjEtMjEtMjF6IiBmaWxsPSIjRTYxNzE3IiBwLWlkPSI2MzkwIj48L3BhdGg+PC9zdmc+'
  }
]

// 订单信息
const orderInfo = reactive({
  orderNo: '',
  examNames: '',
  totalPrice: 0,
  paymentDeadline: ''
})

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

onMounted(async () => {
  // 生成订单号
  orderInfo.orderNo = 'CET' + new Date().getTime()
  
  // 从localStorage获取考试信息
  const writtenExams = localStorage.getItem('writtenExams')
  if (writtenExams) {
    const exams = JSON.parse(writtenExams)
    orderInfo.totalPrice = exams.totalPrice
    
    // 拼接考试名称
    orderInfo.examNames = exams.examDetails.map(exam => exam.name).join('、')
  } else {
    // 如果没有考试信息，返回上一步
    router.push('/home/written-exam')
  }
  
  // 设置支付期限
  const deadline = new Date()
  deadline.setHours(deadline.getHours() + 2)
  orderInfo.paymentDeadline = `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}-${String(deadline.getDate()).padStart(2, '0')} ${String(deadline.getHours()).padStart(2, '0')}:${String(deadline.getMinutes()).padStart(2, '0')}`

  // 获取报名信息，确保状态同步
  const userInfo = getUserInfo()
  if (userInfo) {
    try {
      await registrationService.getRegistrationInfo(userInfo.id)
      
      // 检查是否已完成笔试缴费
      if (registrationService.completedSteps.includes(REGISTRATION_STEPS.WRITTEN_PAY)) {
        console.log('笔试缴费步骤已完成')
        // 检查localStorage中的支付状态
        const writtenPaymentStr = localStorage.getItem('written_payment')
        if (writtenPaymentStr) {
          const payment = JSON.parse(writtenPaymentStr)
          if (payment.isPaid) {
            // 显示支付成功状态
            paymentStatus.value = {
              success: true,
              title: '支付成功',
              message: '您已成功完成笔试缴费'
            }
          }
        }
      }
    } catch (error) {
      console.error('获取报名信息失败:', error)
    }
  }
})

const handlePay = async () => {
  if (!selectedMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  
  isLoading.value = true
  
  const userInfo = getUserInfo()
  if (!userInfo) {
    ElMessage.error('用户信息不存在，请重新登录')
    router.push('/login')
    isLoading.value = false
    return
  }

  try {
    // 模拟支付请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 假设支付成功
    paymentStatus.value = {
      success: true,
      title: '支付成功',
      message: '您已成功支付笔试报名费用，可以继续进行后续报名流程。'
    }
    
    // 更新缴费状态到 localStorage (前端临时存储)
    const paymentData = {
      paid: true,
      orderNo: orderInfo.orderNo,
      payTime: new Date().toISOString(),
      payMethod: selectedMethod.value,
      amount: orderInfo.totalPrice
    }
    localStorage.setItem('writtenPayment', JSON.stringify(paymentData))

    // 调用完成步骤接口，更新后端报名状态
    await registrationService.completeStep(userInfo.id, REGISTRATION_STEPS.WRITTEN_PAY)

    ElMessage.success('支付成功并完成步骤')

    // 自动跳转到下一步
    const nextStep = registrationService.getNextStep()
    if (nextStep) {
      setTimeout(() => {
        router.push(nextStep.path)
      }, 500)
    }

  } catch (error) {
    console.error('支付失败或完成步骤失败:', error)
    ElMessage.error(error.message || '操作失败，请重试')
    paymentStatus.value = {
      success: false,
      title: '支付失败',
      message: error.message || '支付过程中出现错误，请稍后重试。'
    }
  } finally {
    isLoading.value = false
  }
}

const resetPayment = () => {
  paymentStatus.value = null
}

// 这个 handleNext 是支付结果后的"继续报名"按钮，逻辑不变
const handleNext = () => {
  if (paymentStatus.value && paymentStatus.value.success) {
    router.push('/home/oral-exam')
  } else {
    router.push('/home') // 支付失败时返回首页
  }
}

const handleBack = () => {
  router.push('/home/written-exam')
}
</script>

<style scoped>
.payment-container {
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

.payment-info {
  display: grid;
  gap: 20px;
}

.info-card, .payment-methods {
  background-color: var(--bg-light);
  border-radius: 8px;
  padding: 20px;
}

.card-title {
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
  width: 120px;
  flex-shrink: 0;
}

.value {
  color: var(--text-primary);
  font-weight: 500;
}

.value.price {
  color: var(--primary-color);
  font-weight: 600;
}

.methods-list {
  display: grid;
  gap: 15px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition-fast);
}

.method-item:hover {
  border-color: var(--primary-color);
}

.method-item.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-bg);
}

.method-radio {
  position: relative;
}

.method-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.method-radio label {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background-color: white;
  cursor: pointer;
  position: relative;
}

.method-item.selected .method-radio label {
  border-color: var(--primary-color);
}

.method-item.selected .method-radio label:after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--primary-color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.method-logo {
  width: 40px;
  height: 40px;
}

.method-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.method-name {
  font-size: 14px;
  color: var(--text-primary);
}

.total-amount {
  margin-top: 20px;
  text-align: right;
  padding: 15px;
  border-top: 1px dashed var(--border-color);
}

.amount-text {
  font-size: 16px;
  color: var(--text-primary);
  margin-right: 10px;
}

.amount-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-completed {
  background-color: #67c23a;
  color: white;
  cursor: not-allowed;
}

.btn-completed:hover {
  background-color: #67c23a;
}

/* 支付结果 */
.payment-result {
  background-color: white;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: var(--card-shadow);
}

.result-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon.success {
  background-color: var(--success-bg);
}

.result-icon.failed {
  background-color: var(--danger-bg);
}

.result-icon .icon {
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.result-icon.success .icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2334c759"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>');
}

.result-icon.failed .icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff3b30"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>');
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.result-message {
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.result-actions {
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
  
  .action-buttons, .result-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 