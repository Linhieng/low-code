import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import myPlugin from './plugins/myPlugin'
import { createPinia } from 'pinia'

import './assets/scss/id.scss'
import './assets/scss/class.scss'
import './assets/scss/pop_msg.scss'

createApp(App).use(router).use(myPlugin).use(createPinia()).mount('#app')
