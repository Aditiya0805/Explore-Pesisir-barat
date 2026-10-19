import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { migrateLegacyStorage } from './lib/storage'
import './assets/styles/main.css'

// Move any pre-rebrand localStorage data to the new "pw_" keys.
migrateLegacyStorage()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
