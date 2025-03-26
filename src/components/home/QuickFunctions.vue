<template>
  <div class="quick-functions-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon><Grid /></el-icon> 快捷功能
        </h2>
      </div>
      <div class="functions-grid">
        <div v-for="(func, index) in functions" :key="index" class="function-card">
          <router-link :to="func.link" class="function-link">
            <div class="function-icon">
              <el-icon><component :is="func.elIcon" /></el-icon>
            </div>
            <div class="function-content">
              <div class="function-title">{{ func.title }}</div>
              <div class="function-desc">{{ func.description }}</div>
            </div>
            <div class="function-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Grid, ArrowRight, Edit, Search, CreditCard, Check } from '@element-plus/icons-vue'

export default {
  name: 'QuickFunctions',
  components: {
    Grid, ArrowRight, Edit, Search, CreditCard, Check
  },
  props: {
    functions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* 快捷功能样式 */
.quick-functions-section {
  margin-bottom: 40px;
}

.functions-grid {
  display: grid;
  /* 修改网格布局，确保在大屏幕上显示4个卡片一行 */
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.function-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
  padding: 0 !important;
  background-color: white;
}

.function-card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-5px);
}

.function-link {
  text-decoration: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.function-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--primary-color);
  margin-right: 15px;
  transition: var(--transition-fast);
  box-shadow: 0 4px 8px rgba(24, 103, 192, 0.1);
  flex-shrink: 0;
}

.function-card:hover .function-icon {
  background-color: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.function-content {
  flex: 1;
  min-width: 0;
}

.function-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.function-desc {
  color: var(--text-secondary);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.function-arrow {
  color: var(--text-tertiary);
  transition: var(--transition-fast);
  margin-left: 10px;
  flex-shrink: 0;
}

.function-card:hover .function-arrow {
  color: var(--primary-color);
  transform: translateX(5px);
}

/* 响应式布局调整 */
@media (max-width: 1200px) {
  .functions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
  .functions-grid {
    grid-template-columns: 1fr;
  }
  
  .function-title {
    font-size: 16px;
  }
  
  .function-desc {
    font-size: 12px;
  }
  
  .function-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style> 