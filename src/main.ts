import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

export const API_URL = 'https://lanis-logger.orion.alessioc42.dev';

app.use(createPinia())
app.use(router)

app.mount('#app')
