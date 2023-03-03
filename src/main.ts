import { createApp } from 'vue'
import { registerActualWindowSizeCss } from './utils/screen';
import App from './App.vue'

import 'uno.css'
// import { router } from './router';

registerActualWindowSizeCss()
createApp(App).mount('#app')
