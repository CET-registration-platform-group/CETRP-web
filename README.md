# 大学生四六级考试报名系统

## 项目概述

这是一个基于Vue 3的大学生四六级考试报名系统，实现了完整的报名流程管理，包括步骤控制、状态管理和页面导航。

## 功能特性

### 报名步骤管理
- **AGREEMENT**: 报名协议确认
- **QUAL_QUERY**: 资格信息查询
- **QUAL_CONFIRM**: 资格信息确认
- **WRITTEN_APPLY**: 笔试报考
- **WRITTEN_PAY**: 笔试缴费
- **ORAL_APPLY**: 口试报考
- **ORAL_PAY**: 口试缴费
- **COMPLETE**: 完成报名
- **PRINT_ADMIT**: 打印准考证

### 核心功能
- ✅ 步骤状态管理
- ✅ 动态页面导航
- ✅ 权限控制
- ✅ 进度显示
- ✅ 响应式设计

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **路由管理**: Vue Router 4
- **UI组件**: Element Plus
- **HTTP客户端**: Axios
- **状态管理**: 自定义服务层

## 项目结构

```
src/
├── api/                    # API接口
│   ├── student.js         # 学生认证接口
│   └── registration.js    # 报名相关接口
├── components/            # 组件
│   ├── auth/             # 认证相关组件
│   └── StepNavigation.vue # 步骤导航组件
├── services/             # 服务层
│   └── registrationService.js # 报名服务
├── views/                # 页面
│   ├── Auth.vue         # 认证页面
│   ├── Home.vue         # 主页面
│   └── home/            # 报名步骤页面
├── router/              # 路由配置
│   └── index.js
└── main.js              # 入口文件
```

## 核心组件说明

### 1. RegistrationService (报名服务)

负责管理整个报名流程的状态和步骤控制。

```javascript
import { registrationService } from '../services/registrationService.js'

// 获取报名信息
await registrationService.getRegistrationInfo(studentId)

// 完成当前步骤
await registrationService.completeStep(studentId, stepKey)

// 获取当前步骤配置
const currentStep = registrationService.getCurrentStepConfig()

// 检查步骤是否可访问
const isAccessible = registrationService.isStepAccessible(stepKey)
```

### 2. StepNavigation (步骤导航组件)

提供统一的步骤导航界面，包括标题、描述和操作按钮。

```vue
<StepNavigation 
  current-step-key="AGREEMENT"
  step-description="请仔细阅读报名协议"
  :can-proceed="isAgreed"
  :loading="loading"
  next-button-text="同意并继续"
  @complete-step="handleCompleteStep"
/>
```

### 3. 路由守卫

自动检查用户权限和步骤状态，确保用户只能访问当前可用的步骤。

```javascript
// 路由守卫会自动检查步骤权限
router.beforeEach(async (to, from, next) => {
  // 检查认证状态
  // 检查步骤权限
  // 自动跳转到正确的步骤
})
```

## 使用指南

### 1. 创建新的报名步骤页面

```vue
<template>
  <div class="step-container">
    <StepNavigation 
      current-step-key="YOUR_STEP_KEY"
      step-description="步骤描述"
      :can-proceed="canProceed"
      :loading="loading"
      @complete-step="handleCompleteStep"
    />
    
    <!-- 页面内容 -->
    <div class="step-content">
      <!-- 你的页面内容 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import StepNavigation from '../../components/StepNavigation.vue'
import { registrationService, REGISTRATION_STEPS } from '../../services/registrationService.js'

const router = useRouter()
const loading = ref(false)
const canProceed = ref(false)

// 完成当前步骤
const handleCompleteStep = async () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  
  try {
    loading.value = true
    await registrationService.completeStep(userInfo.studentId, REGISTRATION_STEPS.YOUR_STEP_KEY)
    
    // 跳转到下一步
    const nextStep = registrationService.getNextStep()
    if (nextStep) {
      router.push(nextStep.path)
    }
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时检查状态
onMounted(async () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  await registrationService.getRegistrationInfo(userInfo.studentId)
})
</script>
```

### 2. 添加新的步骤

1. 在 `registrationService.js` 中添加步骤枚举：

```javascript
export const REGISTRATION_STEPS = {
  // ... 现有步骤
  YOUR_NEW_STEP: 'YOUR_NEW_STEP'
}
```

2. 添加步骤配置：

```javascript
export const STEP_CONFIG = {
  // ... 现有配置
  [REGISTRATION_STEPS.YOUR_NEW_STEP]: {
    title: '新步骤标题',
    path: '/home/your-new-step',
    step: 10,
    icon: 'YourIcon'
  }
}
```

3. 更新步骤顺序：

```javascript
export const STEP_ORDER = [
  // ... 现有步骤
  REGISTRATION_STEPS.YOUR_NEW_STEP
]
```

4. 添加路由配置：

```javascript
{
  path: 'your-new-step',
  name: 'YourNewStep',
  component: () => import('../views/home/YourNewStep.vue'),
  meta: { title: '新步骤标题', step: 10, stepKey: 'YOUR_NEW_STEP' }
}
```

### 3. 后端接口对接

系统期望的后端接口格式：

```javascript
// 获取报名信息
GET /api/student/registration/{studentId}
Response: {
  code: 200,
  data: {
    currentStep: 'AGREEMENT',
    completedSteps: ['AGREEMENT', 'QUAL_QUERY'],
    // 其他报名信息
  }
}

// 完成步骤
POST /api/student/registration/complete-step
Body: {
  studentId: 1,
  completedStep: 'AGREEMENT'
}
Response: {
  code: 200,
  message: '步骤完成'
}
```

## 状态管理

### 步骤状态
- **PENDING**: 待处理
- **IN_PROGRESS**: 进行中
- **COMPLETED**: 已完成
- **FAILED**: 失败

### 报名状态
- **NOT_STARTED**: 未开始
- **IN_PROGRESS**: 进行中
- **COMPLETED**: 已完成
- **CANCELLED**: 已取消

## 样式指南

系统使用统一的颜色和样式规范：

```css
/* 主色调 */
--primary-color: #409EFF;
--success-color: #67c23a;
--warning-color: #e6a23c;
--danger-color: #f56c6c;

/* 文字颜色 */
--text-primary: #303133;
--text-secondary: #606266;
--text-placeholder: #c0c4cc;

/* 边框颜色 */
--border-color: #e4e7ed;
```

## 开发指南

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

## 注意事项

1. **步骤顺序**: 确保步骤按照正确的顺序进行，不能跳过前面的步骤
2. **状态同步**: 每次操作后要及时同步本地状态和服务器状态
3. **错误处理**: 所有API调用都要有适当的错误处理
4. **用户体验**: 提供清晰的加载状态和错误提示

## 扩展功能

- 支持步骤回退
- 支持步骤跳过（管理员功能）
- 支持批量操作
- 支持数据导出
- 支持多语言

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
