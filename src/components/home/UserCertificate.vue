<template>
  <div class="user-certificate-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon><UserFilled /></el-icon> 通行证信息
        </h2>
      </div>
      <div class="certificate-card theme-card">
        <table class="info-table">
          <tbody>
            <tr>
              <td class="label-cell">证件类型：</td>
              <td class="value-cell">中华人民共和国居民身份证</td>
            </tr>
            <tr>
              <td class="label-cell">证件号码：</td>
              <td class="value-cell">411726200512307993</td>
            </tr>
            <tr>
              <td class="label-cell">姓　　名：</td>
              <td class="value-cell">孙昊</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { UserFilled } from '@element-plus/icons-vue'

export default {
  name: 'UserCertificate',
  components: {
    UserFilled
  }
}
</script>

<style scoped>
/* 通行证信息样式 */
.user-certificate-section {
  margin-bottom: 40px;
}

.certificate-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
}

.certificate-card:hover {
  box-shadow: var(--card-shadow-hover);
}
</style> 