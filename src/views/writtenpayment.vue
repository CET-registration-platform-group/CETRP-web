<template>
  <div class="payment-container">
    <div class="card">
      <div class="card-header">
        <span>笔试缴费</span>
      </div>
      <div class="payment-content">
        <div class="alert alert-warning">
          <i class="icon-warning"></i>
          <span>请确认以下信息并完成缴费</span>
        </div>
        
        <div class="info-section">
          <h3>考试信息</h3>
          <div class="descriptions">
            <div class="descriptions-row">
              <div class="descriptions-item">
                <div class="descriptions-label">考试类型</div>
                <div class="descriptions-content">{{ examInfo.examTypeName }}</div>
              </div>
              <div class="descriptions-item">
                <div class="descriptions-label">考试时间</div>
                <div class="descriptions-content">{{ examInfo.examDate }}</div>
              </div>
            </div>
            <div class="descriptions-row">
              <div class="descriptions-item">
                <div class="descriptions-label">考点</div>
                <div class="descriptions-content">{{ examInfo.examLocationName }}</div>
              </div>
              <div class="descriptions-item">
                <div class="descriptions-label">考场</div>
                <div class="descriptions-content">{{ examInfo.examRoomName }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h3>缴费信息</h3>
          <div class="descriptions">
            <div class="descriptions-row">
              <div class="descriptions-item">
                <div class="descriptions-label">缴费金额</div>
                <div class="descriptions-content">{{ examInfo.fee }}元</div>
              </div>
              <div class="descriptions-item">
                <div class="descriptions-label">缴费状态</div>
                <div class="descriptions-content">{{ paymentStatus }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="payment-methods" v-if="!isPaid">
          <h3>选择支付方式</h3>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="payment" value="alipay" v-model="paymentMethod">
              <span>支付宝</span>
            </label>
            <label class="radio-item">
              <input type="radio" name="payment" value="wechat" v-model="paymentMethod">
              <span>微信支付</span>
            </label>
            <label class="radio-item">
              <input type="radio" name="payment" value="bank" v-model="paymentMethod">
              <span>银行卡支付</span>
            </label>
          </div>
          
          <div class="payment-qrcode" v-if="paymentMethod">
            <div class="qrcode-container">
              <img :src="getQRCodeUrl()" alt="支付二维码" class="qrcode-img">
            </div>
            <p class="payment-tip">请使用{{ getPaymentMethodName() }}扫描二维码完成支付</p>
          </div>
        </div>
        
        <div class="payment-success" v-if="isPaid">
          <div class="result-success">
            <div class="result-icon">
              <i class="icon-success"></i>
            </div>
            <h3 class="result-title">缴费成功</h3>
            <p class="result-subtitle">您已成功完成笔试缴费，可继续进行后续报名流程</p>
          </div>
        </div>
        
        <div class="btn-group">
          <button class="btn btn-default" @click="handleBack">返回</button>
          <button class="btn btn-primary" @click="handlePay" v-if="!isPaid">确认支付</button>
          <button class="btn btn-primary" @click="handleNext" v-if="isPaid">下一步</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const paymentMethod = ref('')
const isPaid = ref(false)

const examInfo = reactive({
  examType: '',
  examTypeName: '',
  examDate: '',
  examLocation: '',
  examLocationName: '',
  examRoom: '',
  examRoomName: '',
  fee: 0
})

const paymentStatus = computed(() => {
  return isPaid.value ? '已缴费' : '未缴费'
})

onMounted(() => {
  // 获取笔试报考信息
  const writtenExamStr = localStorage.getItem('written_exam')
  const confirmedInfoStr = localStorage.getItem('confirmed_info')
  
  if (writtenExamStr && confirmedInfoStr) {
    const writtenExam = JSON.parse(writtenExamStr)
    const confirmedInfo = JSON.parse(confirmedInfoStr)
    
    examInfo.examType = confirmedInfo.examType
    examInfo.examTypeName = confirmedInfo.examTypeName
    examInfo.examDate = confirmedInfo.examDate
    examInfo.fee = confirmedInfo.fee
    examInfo.examLocation = writtenExam.examLocation
    examInfo.examLocationName = writtenExam.examLocationName
    examInfo.examRoom = writtenExam.examRoom
    examInfo.examRoomName = writtenExam.examRoomName
    
    // 检查是否已缴费
    const paymentStr = localStorage.getItem('written_payment')
    if (paymentStr) {
      const payment = JSON.parse(paymentStr)
      isPaid.value = payment.status === 'paid'
    }
  } else {
    // 如果没有笔试报考信息，返回笔试报考页面
    alert('请先完成笔试报考')
    router.push('/home/written-exam')
  }
})

const getPaymentMethodName = () => {
  switch (paymentMethod.value) {
    case 'alipay':
      return '支付宝'
    case 'wechat':
      return '微信'
    case 'bank':
      return '银行卡'
    default:
      return ''
  }
}

const getQRCodeUrl = () => {
  // 模拟不同支付方式的二维码
  switch (paymentMethod.value) {
    case 'alipay':
      return 'https://via.placeholder.com/200?text=支付宝支付'
    case 'wechat':
      return 'https://via.placeholder.com/200?text=微信支付'
    case 'bank':
      return 'https://via.placeholder.com/200?text=银行卡支付'
    default:
      return ''
  }
}

const handlePay = () => {
  if (!paymentMethod.value) {
    alert('请选择支付方式')
    return
  }
  
  if (confirm('确认支付' + examInfo.fee + '元?')) {
    // 模拟支付过程
    setTimeout(() => {
      isPaid.value = true
      
      // 保存支付信息
      localStorage.setItem('written_payment', JSON.stringify({
        status: 'paid',
        method: paymentMethod.value,
        amount: examInfo.fee,
        time: new Date().toISOString()
      }))
      
      alert('支付成功')
    }, 1000)
  }
}

const handleBack = () => {
  router.push('/home/written-exam')
}

const handleNext = () => {
  router.push('/home/oral-exam')
}
</script>

<style scoped>
.payment-container {
  padding: 20px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card-header {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  font-weight: bold;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert {
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.alert-warning {
  background-color: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #faecd8;
}

.icon-warning {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e6a23c"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.info-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.info-section h3 {
  margin-bottom: 15px;
  color: #409EFF;
}

.descriptions {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.descriptions-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.descriptions-row:last-child {
  border-bottom: none;
}

.descriptions-item {
  flex: 1;
  display: flex;
  padding: 0;
  border-right: 1px solid #ebeef5;
}

.descriptions-item:last-child {
  border-right: none;
}

.descriptions-label {
  width: 30%;
  padding: 12px;
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
  font-weight: bold;
  color: #606266;
}

.descriptions-content {
  flex: 1;
  padding: 12px;
  color: #606266;
}

.payment-methods {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.payment-methods h3 {
  margin-bottom: 15px;
  color: #409EFF;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-item input {
  margin-right: 5px;
}

.payment-qrcode {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-container {
  margin: 20px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.qrcode-img {
  width: 200px;
  height: 200px;
  display: block;
}

.payment-tip {
  font-size: 14px;
  color: #606266;
}

.payment-success {
  margin-top: 20px;
}

.result-success {
  text-align: center;
  padding: 30px 0;
}

.result-icon {
  margin-bottom: 20px;
}

.icon-success {
  display: inline-block;
  width: 72px;
  height: 72px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2367c23a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.result-title {
  font-size: 20px;
  color: #67c23a;
  margin-bottom: 10px;
}

.result-subtitle {
  font-size: 14px;
  color: #606266;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-primary {
  background-color: #409EFF;
  color: white;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-default {
  background-color: #f4f4f5;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-default:hover {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .descriptions-row {
    flex-direction: column;
  }
  
  .descriptions-item {
    border-right: none;
    border-bottom: 1px solid #ebeef5;
  }
  
  .descriptions-item:last-child {
    border-bottom: none;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>