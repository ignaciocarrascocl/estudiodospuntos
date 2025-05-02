import { createApp } from 'vue'
import App from './App.vue'
import './assets/base.css'
import './assets/main.css'
import 'bulma/css/bulma.min.css' // Bulma CSS
import './assets/override-bulma.css' // Import overrides AFTER Bulma
import 'bootstrap-icons/font/bootstrap-icons.css' // Bootstrap Icons

createApp(App).mount('#app')
