<template>
  <div class="step-navigation">
    <div class="step-header">
      <div class="step-info">
        <h2 class="step-title">{{ currentStepConfig.title }}</h2>
        <p class="step-description">{{ stepDescription }}</p>
      </div>
      <div class="step-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ currentStep }}/{{ totalSteps }}</span>
      </div>
    </div>
    
    <div class="step-actions" style="justify-content: flex-end;">
      
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { registrationService, REGISTRATION_STEPS } from '../services/registrationService.js'

const props = defineProps({
  currentStepKey: {
    type: String,
    required: true
  },
  stepDescription: {
    type: String,
    default: ''
  },
  canProceed: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  nextButtonText: {
    type: String,
    default: '下一步'
  }
})

const emit = defineEmits(['complete-step'])

const router = useRouter()

// 检查当前步骤是否已完成
const isStepCompleted = computed(() => {
  return registrationService.completedSteps.includes(props.currentStepKey)
})

// 获取当前步骤配置
const currentStepConfig = computed(() => {
  return registrationService.getCurrentStepConfig()
})

// 计算进度
const currentStep = computed(() => {
  const stepOrder = Object.values(REGISTRATION_STEPS)
  const currentIndex = stepOrder.indexOf(props.currentStepKey)
  return currentIndex + 1
})

const totalSteps = computed(() => {
  return Object.keys(REGISTRATION_STEPS).length
})

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps.value) * 100
})

// 按钮文本
const buttonText = computed(() => {
  if (isStepCompleted.value) {
    return '已完成'
  }
  return props.nextButtonText
})

// 处理完成步骤
const handleCompleteStep = () => {
  // 如果步骤已完成，不执行任何操作
  if (isStepCompleted.value) {
    return
  }
  
  if (props.canProceed && !props.loading) {
    emit('complete-step')
  }
}
</script>

<style scoped>
.step-navigation {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.step-description {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
}

.step-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 120px;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background-color: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #409EFF;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #909399;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.btn-back {
  background-color: #f0f2f5;
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease-in-out;
}

.btn-back:hover {
  background-color: #e6e8eb;
  border-color: #d0d3d9;
}

.btn-back:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-next {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
}

.btn-next:hover {
  background-color: #66b1ff;
}

.btn-next:active {
  background-color: #3a8ee6;
}

.btn-next:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #a0cfff;
}

.btn-next.completed {
  background-color: #67c23a;
  cursor: not-allowed;
}

.btn-next.completed:hover {
  background-color: #85ce61;
}

/* Loading spinner */
.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.completed-icon {
  font-size: 18px;
  font-weight: bold;
  margin-right: 5px;
}
</style> 