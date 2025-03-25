import { createApp } from 'vue'
import './style.css'
import './assets/styles/main.css'
import './assets/styles/components.css'
import App from './App.vue'
import router from './router'

// 完整引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册所有图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用 Element Plus
app.use(ElementPlus)

// 全局挂载必要的 Element Plus 组件 - 使用直接引入的方式
import { ElMessage, ElMessageBox } from 'element-plus'
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm

app.use(router)
app.mount('#app')
