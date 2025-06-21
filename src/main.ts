import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'

import { router } from './router'
import App from './App.vue'
import './styles/index.css'
import './bootstrap'

const app = createApp(App)

app.use(router)
app.use(ui)

app.mount('#app')
