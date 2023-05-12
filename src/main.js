import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import pinia from './store'

const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
