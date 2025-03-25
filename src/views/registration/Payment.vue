<template>
  <div class="payment-container">
    <h3 class="section-title">{{ paymentType === 'written' ? '笔试' : '口试' }}缴费</h3>
    <p class="section-desc">请选择支付方式完成缴费</p>

    <!-- 订单信息 -->
    <div class="order-info">
      <div class="info-header">
        <h4>订单信息</h4>
        <span class="order-id">订单号：{{ orderId }}</span>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="label">考试类型：</span>
          <span>{{ examInfo.examNames }}</span>
        </div>
        <div class="info-item">
          <span class="label">考试时间：</span>
          <span>{{ examInfo.examTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">考试地点：</span>
          <span>{{ examInfo.examLocation }}</span>
        </div>
        <div class="info-item">
          <span class="label">应付金额：</span>
          <span class="amount">￥{{ examInfo.totalPrice }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付期限：</span>
          <span class="deadline">{{ paymentDeadline }}</span>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-methods">
      <h4>支付方式</h4>
      <div class="methods-list">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="method-item"
          :class="{ 'selected': selectedMethod === method.id }"
          @click="selectMethod(method.id)"
        >
          <img :src="method.logo" :alt="method.name" class="method-logo">
          <span class="method-name">{{ method.name }}</span>
          <el-radio v-model="selectedMethod" :label="method.id"></el-radio>
        </div>
      </div>
    </div>

    <!-- 支付金额 -->
    <div class="payment-amount">
      <span>支付金额</span>
      <span class="amount">￥{{ examInfo.totalPrice }}</span>
    </div>

    <!-- 支付结果 -->
    <div v-if="paymentStatus !== 'pending'" class="payment-result">
      <el-result
        :icon="paymentStatus === 'success' ? 'success' : 'error'"
        :title="paymentStatus === 'success' ? '支付成功' : '支付失败'"
        :sub-title="paymentStatus === 'success' ? '您已完成支付' : '请重新尝试支付'"
      >
        <template #extra>
          <button 
            v-if="paymentStatus === 'success'"
            class="btn btn-primary"
            @click="handleNext"
          >
            继续
          </button>
          <button 
            v-else
            class="btn btn-primary"
            @click="resetPayment"
          >
            重新支付
          </button>
        </template>
      </el-result>
    </div>

    <!-- 操作按钮 -->
    <div v-else class="action-buttons">
      <button class="btn btn-default" @click="handleBack">返回</button>
      <button 
        class="btn btn-primary" 
        :disabled="!selectedMethod || isLoading"
        @click="handlePay"
      >
        {{ isLoading ? '支付中...' : '立即支付' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const paymentType = computed(() => route.query.type || 'written')

const selectedMethod = ref('')
const isLoading = ref(false)
const paymentStatus = ref('pending') // pending, success, failed
const orderId = ref('')

const examInfo = reactive({
  examNames: '',
  examTime: '',
  examLocation: '',
  totalPrice: 0
})

const paymentMethods = [
  {
    id: 'alipay',
    name: '支付宝',
    logo: '/images/alipay.png'
  },
  {
    id: 'wechat',
    name: '微信支付',
    logo: '/images/wechat.png'
  },
  {
    id: 'unionpay',
    name: '银联支付',
    logo: '/images/unionpay.png'
  }
]

const paymentDeadline = computed(() => {
  const date = new Date()
  date.setHours(date.getHours() + 24)
  return date.toLocaleString('zh-CN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 生成订单号
const generateOrderId = () => {
  const date = new Date()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${random}`
}

const selectMethod = (methodId) => {
  selectedMethod.value = methodId
}

const handleBack = () => {
  router.push(paymentType.value === 'written' ? '/registration/written-exam' : '/registration/oral-exam')
}

const handlePay = async () => {
  if (!selectedMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  isLoading.value = true
  
  try {
    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟成功
    paymentStatus.value = 'success'
    
    // 保存支付状态
    localStorage.setItem('payment_status', JSON.stringify({
      type: paymentType.value,
      isPaid: true,
      amount: examInfo.totalPrice,
      orderId: orderId.value,
      paymentMethod: selectedMethod.value,
      paymentTime: new Date().toISOString()
    }))
    
  } catch (error) {
    paymentStatus.value = 'failed'
    ElMessage.error('支付失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const handleNext = () => {
  if (paymentType.value === 'written') {
    router.push('/registration/oral-exam')
  } else {
    router.push('/registration/complete')
  }
}

const resetPayment = () => {
  paymentStatus.value = 'pending'
  selectedMethod.value = ''
}

onMounted(() => {
  // 生成订单号
  orderId.value = generateOrderId()
  
  // 获取考试信息
  const storageKey = paymentType.value === 'written' ? 'writtenExams' : 'oralExams'
  const examDataStr = localStorage.getItem(storageKey)
  
  if (examDataStr) {
    const examData = JSON.parse(examDataStr)
    examInfo.examNames = examData.examDetails.map(exam => exam.name).join('、')
    examInfo.examTime = examData.examDetails.map(exam => exam.time).join('、')
    examInfo.examLocation = '郑州大学新校区第一教学楼'
    examInfo.totalPrice = examData.totalPrice
  } else {
    ElMessage.error('未找到考试信息')
    handleBack()
  }
})
</script>

<style scoped>
.payment-container {
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

.order-info {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 30px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
}

.info-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.order-id {
  color: var(--text-secondary);
  font-size: 14px;
}

.info-content {
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

.info-item .amount {
  color: var(--primary);
  font-weight: 500;
}

.info-item .deadline {
  color: var(--warning);
}

.payment-methods {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.payment-methods h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.methods-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.method-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-item:hover {
  border-color: var(--primary);
}

.method-item.selected {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

.method-logo {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.method-name {
  flex: 1;
  color: var(--text-primary);
}

.payment-amount {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-amount .amount {
  color: var(--primary);
  font-size: 20px;
  font-weight: 500;
}

.payment-result {
  margin-bottom: 30px;
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
  
  .info-item .label {
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