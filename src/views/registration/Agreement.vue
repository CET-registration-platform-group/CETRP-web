<template>
  <div class="agreement-container">
    <div class="agreement-content">
      <h3 class="agreement-title">全国大学英语四、六级考试(CET)报名协议</h3>
      
      <div class="agreement-text">
        <p>尊敬的考生：</p>
        <p>欢迎参加全国大学英语四、六级考试(CET)。在报名前，请认真阅读以下协议内容：</p>
        
        <h4>一、考试须知</h4>
        <p>1. 全国大学英语四、六级考试(CET)由教育部高等教育司主办，是一项大规模标准化考试。</p>
        <p>2. 考生须严格遵守《全国大学英语四、六级考试考生须知》中的各项规定。</p>
        <p>3. 考生须按要求完成报名、缴费和准考证打印等各个环节。</p>
        
        <h4>二、考生资格</h4>
        <p>1. 全日制普通高等院校在校学生，凭学校学籍信息参加考试。</p>
        <p>2. 专升本、研究生及其他各类在校学生，可凭所在学校出具的在籍证明报名参加考试。</p>
        <p>3. 符合条件的社会人员可按照相关规定报名参加考试。</p>
        
        <h4>三、信息采集</h4>
        <p>1. 考生须如实填写个人信息，包括但不限于姓名、证件号码、联系方式等。</p>
        <p>2. 考生应当对所提供信息的真实性、准确性和完整性负责，如因信息有误导致无法参加考试或影响考试成绩，由考生本人承担责任。</p>
        <p>3. 考生信息将按照国家相关法律法规予以保护，不会用于与考试无关的其他用途。</p>
        
        <h4>四、缴费规定</h4>
        <p>1. 考生须在规定时间内完成报名费用的缴纳，否则报名无效。</p>
        <p>2. 缴费成功后，除符合退费条件外，已缴纳的费用不予退还。</p>
        <p>3. 退费申请须在规定时间内提出，并符合退费条件。</p>
        
        <h4>五、考试违规处理</h4>
        <p>1. 考生在考试过程中须遵守考场纪律，不得有任何违规行为。</p>
        <p>2. 对于违反考试规定的考生，将按照《国家教育考试违规处理办法》进行处理。</p>
        <p>3. 严重违规者将被记入诚信档案，并可能影响今后的相关考试资格。</p>
        
        <h4>六、成绩公布</h4>
        <p>1. 考试成绩将于考后约两个月内公布。</p>
        <p>2. 考生可通过官方指定渠道查询成绩。</p>
        <p>3. 如对成绩有疑问，可按规定程序申请成绩复查。</p>
        
        <h4>七、免责声明</h4>
        <p>1. 因不可抗力因素导致考试延期、取消或其他变更，主办方将及时通知考生并妥善处理。</p>
        <p>2. 考生应遵守考试当地疫情防控等相关规定，因个人原因不符合防疫要求无法参加考试的，责任自负。</p>
        <p>3. 本协议最终解释权归全国大学英语四、六级考试委员会所有。</p>
        
        <p class="agreement-conclusion">本人已阅读并同意上述协议内容，承诺遵守各项规定，并对自己的报名信息和考试行为负责。</p>
      </div>
    </div>
    
    <div class="agreement-actions">
      <label class="agreement-checkbox">
        <input type="checkbox" v-model="isAgreed">
        <span class="checkbox-text">我已阅读并同意《全国大学英语四、六级考试(CET)报名协议》</span>
      </label>
      
      <div class="action-buttons">
        <button class="btn btn-default" @click="handleCancel">取消</button>
        <button class="btn btn-primary" @click="handleNext" :disabled="!isAgreed">下一步</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAgreed = ref(false)

const handleNext = () => {
  if (isAgreed.value) {
    router.push('/registration/qualification')
  }
}

const handleCancel = () => {
  router.push('/home')
}
</script>

<style scoped>
.agreement-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.agreement-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.agreement-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.agreement-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.8;
}

.agreement-text h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: var(--text-primary);
}

.agreement-text p {
  margin-bottom: 10px;
}

.agreement-conclusion {
  margin-top: 20px;
  font-weight: 500;
}

.agreement-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.agreement-checkbox input {
  margin-top: 4px;
}

.checkbox-text {
  font-size: 14px;
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .agreement-content {
    max-height: 400px;
    padding: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 