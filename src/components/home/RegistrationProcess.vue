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
                <div class="step-content">
                  <div class="step-icon"
                    :class="{
                      'step-completed': step.status === 'completed' || step.status === '已完成',
                      'step-pending': step.status !== 'completed' && step.status !== '已完成'
                    }">
                    <el-icon><component :is="step.elIcon" /></el-icon>
                  </div>
                  <div class="step-name">{{ step.name }}</div>
                  <div class="step-status"
                    :class="{ 'status-completed': step.status === '已完成', 'status-pending': step.status === '未开始' }">
                    {{ step.status === 'pending' ? '未开始' : (step.status === 'completed' ? '已完成' : step.status) }}
                  </div>
                  <div v-if="step.optional" class="step-optional">可选</div>
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
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  overflow-x: visible;
  padding: 10px 0;
}

.process-step {
  text-align: center;
  position: relative;
  flex: 0 0 90px;
  min-width: 90px;
  max-width: 100px;
  display: flex;
  align-items: center;
  margin: 0 2px;
}

/* 确保连接器样式一致 */
.step-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  flex-shrink: 0;
}

.step-link {
  text-decoration: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 90px;
  margin: 0 auto;
  padding: 6px;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 145px;
  box-sizing: border-box;
  border: 1.5px solid #e0e6ed;
  background: #fff;
  box-shadow: 0 4px 16px rgba(24, 103, 192, 0.08);
}

.process-steps .process-step .step-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(24, 103, 192, 0.18);
  background-color: rgba(24, 103, 192, 0.07);
  /* 边框颜色不变 */
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.step-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 6px;
  transition: var(--transition-normal);
  color: #b0b0b0;
  font-size: 18px;
  box-shadow: 0 2px 6px rgba(24, 103, 192, 0.08);
  border: 1.5px solid #b3c6e0;
}

.step-icon.step-completed {
  background-color: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

.step-icon.step-pending {
  background-color: var(--bg-light);
  color: #b0b0b0;
  border-color: #e0e6ed;
}

.step-name {
  font-weight: 600;
  margin-bottom: 2px;
  font-size: 13px;
  white-space: nowrap;
}

.step-status {
  font-size: 11px;
  color: var(--text-tertiary);
  background-color: transparent;
  padding: 0;
  margin-top: 2px;
  letter-spacing: 1px;
}

.status-completed {
  color: var(--success-color);
}

.status-pending {
  color: #b0b0b0;
}

.connector-arrow {
  font-size: 22px;
  color: #b3c6e0;
  font-weight: bold;
  filter: drop-shadow(0 1px 2px rgba(24,103,192,0.10));
  transition: var(--transition-fast);
}

.connector-completed {
  color: var(--success-color);
}

/* 为了视觉平衡，可以给最后一个连接器添加特殊样式 */
.process-step:nth-last-child(2) .connector-arrow {
  opacity: 0.8; /* 稍微降低未完成连接器的不透明度 */
}

.step-optional {
  margin-top: 4px;
  font-size: 11px;
  color: var(--warning-color, #faad14);
  letter-spacing: 1px;
}

@media (max-width: 992px) {
  .process-steps {
    flex-wrap: wrap;
    gap: 6px;
    padding-bottom: 8px;
  }
  
  .process-step {
    flex: 0 0 80px;
    min-width: 80px;
    max-width: 90px;
  }
  
  .step-link {
    max-width: 80px;
    height: 130px;
  }
  
  .step-name {
    font-size: 11px;
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