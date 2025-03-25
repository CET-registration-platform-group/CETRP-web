<template>
  <footer class="footer-section">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3>
            <el-icon><Phone /></el-icon> 联系我们
          </h3>
          <p><el-icon><Phone /></el-icon> 电话：400-888-8888</p>
          <p><el-icon><Message /></el-icon> 邮箱：support@cet.edu.cn</p>
          <p><el-icon><Clock /></el-icon> 工作时间：周一至周五 9:00-18:00</p>
        </div>
        <div class="footer-column">
          <h3>
            <el-icon><QuestionFilled /></el-icon> 常见问题
          </h3>
          <ul>
            <li><a href="#" class="theme-link">如何修改报名信息？</a></li>
            <li><a href="#" class="theme-link">忘记密码怎么办？</a></li>
            <li><a href="#" class="theme-link">准考证丢失怎么办？</a></li>
            <li><a href="#" class="theme-link">如何查看入口位置？</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>
            <el-icon><OfficeBuilding /></el-icon> 考试中心
          </h3>
          <ul>
            <li><a href="#" class="theme-link">全国考试中心</a></li>
            <li><a href="#" class="theme-link">各地考试机构</a></li>
            <li><a href="#" class="theme-link">考试政策</a></li>
            <li><a href="#" class="theme-link">考试大纲</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>
            <el-icon><Star /></el-icon> 关注我们
          </h3>
        </div>
      </div>
      <div class="copyright">
        © 2025 大学英语四六级考试报名系统 All Rights Reserved
      </div>
    </div>
  </footer>
</template>

<script>
import { Phone, Message, Clock, QuestionFilled, OfficeBuilding, Star } from '@element-plus/icons-vue'

export default {
  name: 'AppFooter',
  components: {
    Phone, Message, Clock, QuestionFilled, OfficeBuilding, Star
  }
}
</script>

<style scoped>
/* 页脚样式 */
.footer-section {
  background-color: var(--primary-dark);
  color: white;
  padding: 50px 0 20px;
  margin-top: 40px;
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

.footer-column h3 .el-icon {
  margin-right: 10px;
}

.footer-column p,
.footer-column li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.footer-column p .el-icon,
.footer-column li .el-icon {
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

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style> 