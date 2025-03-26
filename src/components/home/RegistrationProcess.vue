<template>
  <div class="registration-process-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon><Connection /></el-icon> 报名流程
        </h2>
      </div>
      <div class="process-card">
        <div class="process-steps">
          <template v-for="(step, index) in steps" :key="index">
            <div class="process-step">
              <router-link :to="step.link" class="step-link">
                <div class="step-icon" :class="step.iconClass">
                  <el-icon><component :is="step.elIcon" /></el-icon>
                </div>
                <div class="step-name">{{ step.name }}</div>
                <div class="step-status"
                  :class="{ 'status-completed': step.status === '已完成', 'status-pending': step.status === '未开始' }">
                  {{ step.status }}
                </div>
              </router-link>
            </div>
            <!-- 在每个步骤后添加连接器，除了最后一个 -->
            <div v-if="index < steps.length - 1" class="step-connector">
              <el-icon class="connector-arrow" :class="{ 'connector-completed': step.status === '已完成' }">
                <ArrowRight />
              </el-icon>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Connection, ArrowRight, Document, Edit, Check, List, CreditCard, Printer, Reading } from '@element-plus/icons-vue'

export default {
  name: 'RegistrationProcess',
  components: {
    Connection, ArrowRight, Document, Edit, Check, List, CreditCard, Printer, Reading
  },
  props: {
    steps: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* 报名流程样式 */
.registration-process-section {
  margin-bottom: 40px;
}

.process-card {
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

/* 使用flex布局，确保间距一致 */
.process-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 20px 0;
}

.process-step {
  text-align: center;
  position: relative;
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
}

/* 确保连接器样式一致 */
.step-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px; /* 固定宽度 */
  flex-shrink: 0; /* 防止压缩 */
}

.step-link {
  text-decoration: none;
  color: var(--text-primary);
  display: block;
  width: 100%; /* 控制宽度 */
  max-width: 100px; /* 调整为100px，使阴影效果更紧凑 */
  margin: 0 auto; /* 居中显示 */
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

/* 使用更具体的选择器，增强阴影效果 */
.process-steps .process-step .step-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(24, 103, 192, 0.25); /* 增加阴影不透明度 */
  background-color: rgba(24, 103, 192, 0.05); /* 稍微增加背景色不透明度 */
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  transition: var(--transition-normal);
  color: var(--primary-color);
  font-size: 24px;
  box-shadow: 0 5px 10px rgba(24, 103, 192, 0.1);
}

/* 使用更具体的选择器，增强图标阴影 */
.process-steps .process-step .step-link:hover .step-icon {
  transform: scale(1.1);
  box-shadow: 0 5px 8px rgba(24, 103, 192, 0.2); /* 增加图标阴影不透明度 */
}

.step-icon.step-completed {
  background-color: var(--primary-color);
  color: white;
}

.step-icon.step-pending {
  background-color: var(--bg-light);
  color: var(--text-tertiary);
}

.step-name {
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 14px;
}

.step-status {
  font-size: 12px;
  color: var(--text-tertiary);
  background-color: transparent;
  padding: 0;
}

.status-completed {
  color: var(--success-color);
}

.status-pending {
  color: var(--text-tertiary);
}

.connector-arrow {
  font-size: 20px;
  color: var(--border-color);
  transition: var(--transition-fast);
}

.connector-completed {
  color: var(--success-color);
}

/* 为了视觉平衡，可以给最后一个连接器添加特殊样式 */
.process-step:nth-last-child(2) .connector-arrow {
  opacity: 0.8; /* 稍微降低未完成连接器的不透明度 */
}

@media (max-width: 992px) {
  .process-steps {
    justify-content: flex-start;
    padding-bottom: 15px;
  }
  
  .process-step {
    flex: 0 0 auto;
    min-width: 100px;
  }
  
  .step-link {
    max-width: 90px; /* 移动端调整最大宽度更小 */
  }
  
  .step-name {
    font-size: 12px;
  }
  
  .step-status {
    font-size: 10px;
  }
  
  .step-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  /* 调整移动端悬停效果，增强阴影 */
  .process-steps .process-step .step-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 6px rgba(24, 103, 192, 0.25); /* 增加阴影不透明度 */
  }
}
</style> 