import { createApp } from 'vue'
import App from './App.vue'
// Import Tailwind AFTER any other styling frameworks but BEFORE component styles
import './index.css' // This contains all Tailwind imports
import 'bootstrap-icons/font/bootstrap-icons.css'
// Import PixiJS
import * as PIXI from 'pixi.js'

// Make PixiJS available globally (optional)
window.PIXI = PIXI

// Create and mount the Vue app
createApp(App).mount('#app')
