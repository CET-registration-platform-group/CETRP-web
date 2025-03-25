<template>
  <div class="home-container">
    <!-- 导航栏 -->
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
              <button @click="logout" class="btn-logout-nav">
                <el-icon><SwitchButton /></el-icon> 退出登录
              </button>
            </div>
          </div>
          <router-link v-else to="/login" class="btn-login">登录</router-link>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 通行证信息部分 -->
      <div class="user-certificate-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><UserFilled /></el-icon> 通行证信息
            </h2>
          </div>
          <div class="certificate-card theme-card">
            <table class="info-table">
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
            </table>
          </div>
        </div>
      </div>

      <!-- 报名状态部分 -->
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
              <tr>
                <td class="label-cell">考次名称：</td>
                <td class="value-cell">2025年上半年CET考试</td>
              </tr>
              <tr>
                <td class="label-cell">考点省份：</td>
                <td class="value-cell">河南省</td>
              </tr>
              <tr>
                <td class="label-cell">学籍与资格状态：</td>
                <td class="value-cell status-success">已确认</td>
              </tr>
              <tr>
                <td class="label-cell">笔试报考状态：</td>
                <td class="value-cell status-success">已报考</td>
              </tr>
              <tr>
                <td class="label-cell">笔试支付状态：</td>
                <td class="value-cell status-success">已支付1科</td>
              </tr>
              <tr>
                <td class="label-cell">口试报考状态：</td>
                <td class="value-cell status-warning">未报考</td>
              </tr>
              <tr>
                <td class="label-cell">报名时间：</td>
                <td class="value-cell">2025-03-20 12:00 至 2025-03-25 17:00</td>
              </tr>
              <tr>
                <td class="label-cell">残疾考生合理便利线下申请截止时间：</td>
                <td class="value-cell">2025-04-07 12:00</td>
              </tr>
            </table>
            <div class="status-actions">
              <router-link to="/exam-details" class="btn-primary">
                <el-icon><Document /></el-icon> 查看详情
              </router-link>
              <router-link to="/admission-ticket" class="btn-outline">
                <el-icon><Printer /></el-icon> 打印准考证
              </router-link>
            </div>
          </div>
          <div class="login-prompt theme-card" v-else>
            <div class="prompt-icon"><i class="fas fa-user-lock"></i></div>
            <p>请登录查看您的报名状态</p>
            <router-link to="/login" class="btn-primary">立即登录</router-link>
          </div>
        </div>
      </div>

      <!-- 报名流程部分 -->
      <div class="registration-process-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Connection /></el-icon> 报名流程
            </h2>
          </div>
          <div class="process-card theme-card">
            <div class="process-steps">
              <div v-for="(step, index) in registrationSteps" :key="index" class="process-step">
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
                <div class="step-connector" v-if="index < registrationSteps.length - 1">
                  <el-icon class="connector-arrow" :class="{ 'connector-completed': step.status === '已完成' }">
                    <ArrowRight />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷功能区 -->
      <div class="quick-functions-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Grid /></el-icon> 快捷功能
            </h2>
          </div>
          <div class="functions-grid">
            <div v-for="(func, index) in quickFunctions" :key="index" class="function-card theme-card">
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
    </main>

    <!-- 底部信息区 -->
    <footer class="footer-section">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-column">
            <h3><i class="fas fa-phone-alt"></i> 联系我们</h3>
            <p><i class="fas fa-phone"></i> 电话：400-888-8888</p>
            <p><i class="fas fa-envelope"></i> 邮箱：support@cet.edu.cn</p>
            <p><i class="far fa-clock"></i> 工作时间：周一至周五 9:00-18:00</p>
          </div>
          <div class="footer-column">
            <h3><i class="fas fa-question-circle"></i> 常见问题</h3>
            <ul>
              <li><a href="#" class="theme-link">如何修改报名信息？</a></li>
              <li><a href="#" class="theme-link">忘记密码怎么办？</a></li>
              <li><a href="#" class="theme-link">准考证丢失怎么办？</a></li>
              <li><a href="#" class="theme-link">如何查看入口位置？</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3><i class="fas fa-university"></i> 考试中心</h3>
            <ul>
              <li><a href="#" class="theme-link">全国考试中心</a></li>
              <li><a href="#" class="theme-link">各地考试机构</a></li>
              <li><a href="#" class="theme-link">考试政策</a></li>
              <li><a href="#" class="theme-link">考试大纲</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3><i class="fas fa-heart"></i> 关注我们</h3>
            <div class="social-icons">
              <a href="#" class="social-icon"><i class="fab fa-weixin"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-weibo"></i></a>
            </div>
            <div class="qrcode">
              <img src="https://via.placeholder.com/100" alt="微信公众号" class="qrcode-img">
              <p>扫码关注公众号</p>
            </div>
          </div>
        </div>
        <div class="copyright">
          © 2025 大学英语四六级考试报名系统 All Rights Reserved
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { 
  School, SwitchButton, Tickets, Refresh, Connection, 
  Document, Edit, Check, List, CreditCard, Printer, 
  Reading, Search, Grid, ArrowRight, Phone, Message, 
  Clock, QuestionFilled, OfficeBuilding, Star, UserFilled
} from '@element-plus/icons-vue'

export default {
  name: 'Home',
  components: {
    School, SwitchButton, Tickets, Refresh, Connection, 
    Document, Edit, Check, List, CreditCard, Printer, 
    Reading, Search, Grid, ArrowRight, Phone, Message, 
    Clock, QuestionFilled, OfficeBuilding, Star, UserFilled
  },
  data() {
    return {
      isLoggedIn: true, // 根据实际登录状态修改
      registrationSteps: [
        {
          name: '预备报名',
          status: '已完成',
          elIcon: 'Document',
          iconClass: 'step-completed',
          link: '/registration/prepare'
        },
        {
          name: '信息填写',
          status: '已完成',
          elIcon: 'Edit',
          iconClass: 'step-completed',
          link: '/registration/info'
        },
        {
          name: '信息确认',
          status: '已完成',
          elIcon: 'Check',
          iconClass: 'step-completed',
          link: '/registration/confirm'
        },
        {
          name: '考试报名',
          status: '已完成',
          elIcon: 'List',
          iconClass: 'step-completed',
          link: '/registration/exam'
        },
        {
          name: '缴费确认',
          status: '已完成',
          elIcon: 'CreditCard',
          iconClass: 'step-completed',
          link: '/payment/confirm'
        },
        {
          name: '准考证打印',
          status: '未开始',
          elIcon: 'Printer',
          iconClass: 'step-pending',
          link: '/admission-ticket'
        },
        {
          name: '参加考试',
          status: '未开始',
          elIcon: 'Reading',
          iconClass: 'step-pending',
          link: '/exam-info'
        }
      ],
      quickFunctions: [
        {
          title: '考试报名',
          description: '快速进入考试报名页面',
          elIcon: 'Edit',
          link: '/registration'
        },
        {
          title: '信息查询',
          description: '查询个人报名信息状态',
          elIcon: 'Search',
          link: '/info-query'
        },
        {
          title: '缴费中心',
          description: '办理考试缴费用支付',
          elIcon: 'CreditCard',
          link: '/payment'
        },
        {
          title: '报名确认',
          description: '确认报名信息并打印准考证',
          elIcon: 'Check',
          link: '/confirm'
        }
      ],
      registrationStatus: {
        status: '已报名，已缴费',
        registrationTime: '2025-03-15 14:30',
        examTime: '2025-06-20 09:00',
        examLocation: '北京大学第三教学楼',
        ticketNumber: '2025061012345'
      }
    }
  },
  methods: {
    logout() {
      // 实现退出登录的逻辑
      this.isLoggedIn = false;
      this.$router.push('/login');
    },
    getStatusClass(status) {
      if (status.includes('已报名') && status.includes('已缴费')) {
        return 'status-success';
      } else if (status.includes('已报名') && !status.includes('已缴费')) {
        return 'status-warning';
      } else {
        return 'status-pending';
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.home-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  color: var(--primary-color);
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin: 0;
}

.section-title i {
  margin-right: 10px;
  font-size: 24px;
}

.section-actions {
  display: flex;
  gap: 10px;
}

.btn-refresh {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.btn-refresh:hover {
  background-color: var(--primary-bg);
}

.btn-refresh i {
  margin-right: 5px;
}

.theme-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
}

.theme-card:hover {
  box-shadow: var(--card-shadow-hover);
}

/* 导航栏样式 */
.main-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
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

.logo i {
  font-size: 24px;
  margin-right: 10px;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 10px 20px;
  font-weight: 500;
  transition: var(--transition-fast);
  border-bottom: 2px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
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

.btn-logout-nav i {
  margin-right: 5px;
}

.btn-logout-nav:hover {
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.1);
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: var(--btn-radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-fast);
}

.btn-login:hover {
  background-color: var(--primary-hover);
}

/* 主要内容区样式 */
.main-content {
  flex: 1;
  padding: 30px 0;
}

/* 通行证信息和报名信息共用样式 */
.user-certificate-section,
.registration-status-section {
  margin-bottom: 40px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table tr:nth-child(odd) {
  background-color: var(--bg-light);
}

.info-table tr:nth-child(even) {
  background-color: white;
}

.info-table tr {
  border-bottom: 1px solid var(--border-light);
  transition: var(--transition-fast);
}

.info-table tr:hover {
  background-color: var(--hover-bg);
}

.info-table tr:last-child {
  border-bottom: none;
}

.label-cell {
  width: 30%;
  padding: 15px 10px;
  color: var(--primary-color);
  text-align: right;
  font-weight: 500;
}

.value-cell {
  padding: 15px 10px;
  color: var(--text-primary);
}

/* 修改状态文本样式，移除背景色 */
.status-completed, .status-pending {
  background-color: transparent;
  padding: 0;
}

.value-cell.status-success {
  color: var(--success-color);
  font-weight: 500;
  background-color: transparent;
}

.value-cell.status-warning {
  color: var(--warning-color);
  font-weight: 500;
  background-color: transparent;
}

.value-cell.status-danger {
  color: var(--danger-color);
  font-weight: 500;
  background-color: transparent;
}

/* 卡片样式优化 */
.certificate-card,
.status-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
}

.certificate-card:hover,
.status-card:hover {
  box-shadow: var(--card-shadow-hover);
}

/* 报名状态部分样式 */
.registration-status-section {
  margin-bottom: 40px;
}

.status-card,
.login-prompt {
  padding: 25px;
  margin-top: 20px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-light);
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-success {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--success-color);
}

.status-warning {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--warning-color);
}

.status-pending {
  background-color: rgba(90, 200, 250, 0.1);
  color: var(--info-color);
}

.exam-type {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.info-row {
  display: flex;
  margin-bottom: 20px;
}

.info-item {
  flex: 1;
  padding-right: 20px;
}

.info-label {
  color: var(--text-tertiary);
  font-size: 14px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.info-label i {
  margin-right: 5px;
}

.info-value {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 500;
}

.status-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--btn-radius);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: var(--transition-fast);
}

.btn-primary i {
  margin-right: 5px;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 10px 20px;
  border-radius: var(--btn-radius);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: var(--transition-fast);
}

.btn-outline i {
  margin-right: 5px;
}

.btn-outline:hover {
  background-color: var(--primary-bg);
  transform: translateY(-2px);
}

.login-prompt {
  text-align: center;
  padding: 40px;
}

.prompt-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.login-prompt p {
  margin-bottom: 20px;
  font-size: 16px;
  color: var(--text-secondary);
}

/* 报名流程部分样式 */
.registration-process-section {
  margin-bottom: 40px;
}

.process-card {
  padding: 30px;
  margin-top: 20px;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
}

.process-step {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.step-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition-fast);
  padding: 10px;
  border-radius: 8px;
}

.step-link:hover {
  background-color: var(--primary-bg);
}

.step-link:hover .step-icon {
  transform: scale(1.1);
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 24px;
  color: white;
  background-color: var(--text-tertiary);
  transition: var(--transition-fast);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.step-completed {
  background-color: var(--success-color);
}

.step-current {
  background-color: var(--primary-color);
}

.step-pending {
  background-color: var(--text-tertiary);
}

.step-name {
  font-weight: 600;
  margin-bottom: 5px;
  text-align: center;
}

.step-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 5px;
}

.step-connector {
  display: flex;
  align-items: center;
  margin: 0 15px;
  position: relative;
}

.connector-arrow {
  font-size: 28px;
  color: var(--border-color);
  transition: var(--transition-fast);
}

.connector-completed {
  color: var(--success-color);
}

/* 快捷功能区样式 */
.quick-functions-section {
  margin-bottom: 40px;
}

.functions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.function-card {
  transition: var(--transition-normal);
  height: 100%;
}

.function-card:hover {
  transform: translateY(-5px);
}

.function-link {
  text-decoration: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  padding: 20px;
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
}

.function-card:hover .function-icon {
  background-color: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.function-content {
  flex: 1;
}

.function-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.function-desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.function-arrow {
  color: var(--text-tertiary);
  transition: var(--transition-fast);
}

.function-card:hover .function-arrow {
  color: var(--primary-color);
  transform: translateX(5px);
}

/* 底部信息区样式 */
.footer-section {
  background-color: var(--primary-dark);
  color: white;
  padding: 50px 0 20px;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.footer-column h3 {
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.footer-column h3 i {
  margin-right: 10px;
}

.footer-column p,
.footer-column li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.footer-column p i,
.footer-column li i {
  margin-right: 10px;
  width: 16px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column .theme-link {
  color: rgba(255, 255, 255, 0.8);
  transition: var(--transition-fast);
}

.footer-column .theme-link:hover {
  color: white;
  padding-left: 5px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.social-icon {
  font-size: 24px;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.social-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.qrcode {
  text-align: center;
  margin-bottom: 20px;
}

.qrcode-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.qrcode p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  justify-content: center;
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.btn-logout {
  display: none;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .process-steps {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .process-step {
    margin: 10px 0;
    width: 100%;
  }
  
  .step-connector {
    transform: rotate(90deg);
    margin: 15px 0;
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

/* 可以添加以下样式来调整Element图标的大小 */
.el-icon {
  font-size: inherit;
  vertical-align: middle;
}

.step-icon .el-icon {
  font-size: 24px;
}

.function-icon .el-icon {
  font-size: 24px;
}

.connector-arrow.el-icon {
  font-size: 28px;
}
</style>