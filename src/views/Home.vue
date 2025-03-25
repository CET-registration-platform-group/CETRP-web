<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <app-header :is-logged-in="isLoggedIn" @logout="logout" />

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 通行证信息部分 -->
      <user-certificate />

      <!-- 报名信息部分 -->
      <registration-info 
        :is-logged-in="isLoggedIn" 
        :registration-data="registrationData" 
      />

      <!-- 报名流程部分 -->
      <registration-process :steps="registrationSteps" />

      <!-- 快捷功能区 -->
      <quick-functions :functions="quickFunctions" />
    </main>

    <!-- 底部信息区 -->
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import UserCertificate from '../components/home/UserCertificate.vue'
import RegistrationInfo from '../components/home/RegistrationInfo.vue'
import RegistrationProcess from '../components/home/RegistrationProcess.vue'
import QuickFunctions from '../components/home/QuickFunctions.vue'

export default {
  name: 'Home',
  components: {
    AppHeader,
    AppFooter,
    UserCertificate,
    RegistrationInfo,
    RegistrationProcess,
    QuickFunctions
  },
  data() {
    return {
      isLoggedIn: true,
      registrationData: {
        examName: '2025年上半年CET考试',
        province: '河南省',
        academicStatus: '已确认',
        writtenExamStatus: '已报考',
        paymentStatus: '已支付1科',
        oralExamStatus: '未报考',
        registrationTime: '2025-03-20 12:00 至 2025-03-25 17:00',
        disabilityDeadline: '2025-04-07 12:00'
      },
      registrationSteps: [
        {
          name: '预备报名',
          status: '已完成',
          link: '/registration/prepare',
          elIcon: 'Document',
          iconClass: 'step-completed'
        },
        {
          name: '信息填写',
          status: '已完成',
          link: '/registration/info',
          elIcon: 'Edit',
          iconClass: 'step-completed'
        },
        {
          name: '信息确认',
          status: '已完成',
          link: '/registration/confirm',
          elIcon: 'Check',
          iconClass: 'step-completed'
        },
        {
          name: '考试报名',
          status: '已完成',
          link: '/registration/exam',
          elIcon: 'List',
          iconClass: 'step-completed'
        },
        {
          name: '缴费确认',
          status: '已完成',
          link: '/registration/payment',
          elIcon: 'CreditCard',
          iconClass: 'step-completed'
        },
        {
          name: '准考证打印',
          status: '未开始',
          link: '/registration/admission',
          elIcon: 'Printer',
          iconClass: 'step-pending'
        },
        {
          name: '参加考试',
          status: '未开始',
          link: '/registration/take-exam',
          elIcon: 'Reading',
          iconClass: 'step-pending'
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
      ]
    }
  },
  methods: {
    logout() {
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 30px 0;
}

/* 确保组件之间有足够的间距 */
.main-content > * {
  margin-bottom: 40px;
}

.main-content > *:last-child {
  margin-bottom: 0;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .main-content {
    padding: 20px 0;
  }
}
</style>