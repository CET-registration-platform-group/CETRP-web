<template>
  <header class="main-header">
    <div class="container header-container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <el-icon><School /></el-icon>
          <span>大学英语四六级考试报名系统</span>
        </router-link>
      </div>
      <nav class="main-nav">
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link active">首页</router-link></li>
          <li><router-link to="/exam-info" class="nav-link">考试报名</router-link></li>
          <li><router-link to="/info-query" class="nav-link">信息查询</router-link></li>
          <li><router-link to="/payment" class="nav-link">缴费中心</router-link></li>
          <li><router-link to="/personal" class="nav-link">个人中心</router-link></li>
        </ul>
      </nav>
      <div class="user-actions">
        <div class="user-info" v-if="isLoggedIn">
          <img src="https://via.placeholder.com/36" alt="用户头像" class="user-avatar">
          <span class="user-name">张雨晨</span>
          <div class="user-dropdown">
            <button @click="handleLogout" class="btn-logout-nav">
              <el-icon><SwitchButton /></el-icon> 退出登录
            </button>
          </div>
        </div>
        <router-link v-else to="/login" class="btn-login">登录</router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { School, SwitchButton } from '@element-plus/icons-vue'

export default {
  name: 'AppHeader',
  components: {
    School, 
    SwitchButton
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleLogout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
/* 导航栏样式 */
.main-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary-color);
  font-size: 18px;
  font-weight: 600;
}

.logo .el-icon {
  font-size: 24px;
  margin-right: 10px;
}

.main-nav {
  flex: 1;
  margin: 0 20px;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 6px;
  transition: var(--transition-fast);
  font-weight: 500;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
  background-color: var(--primary-bg);
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-right: 10px;
}

.user-dropdown {
  display: inline-block;
}

.btn-logout-nav {
  background-color: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 5px 10px;
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  font-size: 14px;
}

.btn-logout-nav i, .btn-logout-nav .el-icon {
  margin-right: 5px;
}

.btn-logout-nav:hover {
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.1);
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 8px 20px;
  border-radius: var(--btn-radius);
  font-weight: 500;
  transition: var(--transition-fast);
}

.btn-login:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow);
}

@media (max-width: 992px) {
  .nav-links {
    display: none;
  }
}
</style> 