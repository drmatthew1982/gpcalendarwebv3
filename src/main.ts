import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import "./permission"
import api from './axios';
//import './assets/mainback.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
app.config.globalProperties.$api = api;
app.config.globalProperties.$serviceurl = "localhost:8080";
app.config.globalProperties.$defaultheaders = {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded'
};
