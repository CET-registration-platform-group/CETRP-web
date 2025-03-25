<template>
  <div class="registration-status-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon><Tickets /></el-icon> 报名信息
        </h2>
        <div class="section-actions">
          <button class="btn-refresh">
            <el-icon><Refresh /></el-icon> 刷新
          </button>
        </div>
      </div>
      <div class="status-card theme-card" v-if="isLoggedIn">
        <table class="info-table">
          <tbody>
            <tr>
              <td class="label-cell">考次名称：</td>
              <td class="value-cell">{{ registrationData.examName }}</td>
            </tr>
            <tr>
              <td class="label-cell">考点省份：</td>
              <td class="value-cell">{{ registrationData.province }}</td>
            </tr>
            <tr>
              <td class="label-cell">学籍与资格状态：</td>
              <td class="value-cell status-success">{{ registrationData.academicStatus }}</td>
            </tr>
            <tr>
              <td class="label-cell">笔试报考状态：</td>
              <td class="value-cell status-success">{{ registrationData.writtenExamStatus }}</td>
            </tr>
            <tr>
              <td class="label-cell">笔试支付状态：</td>
              <td class="value-cell status-success">{{ registrationData.paymentStatus }}</td>
            </tr>
            <tr>
              <td class="label-cell">口试报考状态：</td>
              <td class="value-cell status-warning">{{ registrationData.oralExamStatus }}</td>
            </tr>
            <tr>
              <td class="label-cell">报名时间：</td>
              <td class="value-cell">{{ registrationData.registrationTime }}</td>
            </tr>
            <tr>
              <td class="label-cell">残疾考生合理便利线下申请截止时间：</td>
              <td class="value-cell">{{ registrationData.disabilityDeadline }}</td>
            </tr>
          </tbody>
        </table>
        <div class="status-actions">
          <div class="status-actions-spacer"></div>
          <div class="status-actions-buttons">
            <router-link to="/exam-details" class="btn-primary">
              <el-icon><Document /></el-icon> 查看详情
            </router-link>
            <router-link to="/admission-ticket" class="btn-outline">
              <el-icon><Printer /></el-icon> 打印准考证
            </router-link>
          </div>
        </div>
      </div>
      <div class="login-prompt theme-card" v-else>
        <div class="prompt-icon">
          <el-icon><Lock /></el-icon>
        </div>
        <p>请登录查看您的报名状态</p>
        <router-link to="/login" class="btn-primary">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Tickets, Refresh, Document, Printer, Lock } from '@element-plus/icons-vue'

export default {
  name: 'RegistrationInfo',
  components: {
    Tickets, Refresh, Document, Printer, Lock
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    registrationData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* 报名信息样式 */
.registration-status-section {
  margin-bottom: 40px;
}

.status-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
}

.status-card:hover {
  box-shadow: var(--card-shadow-hover);
}

.status-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.status-actions-spacer {
  flex: 1;
}

.status-actions-buttons {
  display: flex;
  gap: 15px;
}

.btn-refresh {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 8px 15px;
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  font-size: 14px;
}

.btn-refresh .el-icon {
  margin-right: 5px;
}

.btn-refresh:hover {
  background-color: var(--primary-bg);
  transform: translateY(-2px);
}

.login-prompt {
  text-align: center;
  padding: 40px 20px;
}

.prompt-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.login-prompt p {
  margin-bottom: 20px;
  color: var(--text-secondary);
}
</style> 