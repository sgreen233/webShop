import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './assets/css/common.css'
import { ElRow, ElCol,ElPageHeader,ElButton,ElInput,ElFormItem,ElTable,ElDialog } from 'element-plus';



const app = createApp(App)
app.use(router)
app.use(ElRow)
app.use(ElCol)
app.use(ElPageHeader)
app.use(ElButton)
app.use(ElInput)
app.use(ElFormItem)
app.use(ElTable)
app.use(ElDialog)
app.mount('#app')