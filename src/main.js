import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
const persist = createPersistedState();
const pinia = createPinia();
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale })
app.use(ArcoVue);
app.use(ArcoVueIcon);

app.mount('#app')
