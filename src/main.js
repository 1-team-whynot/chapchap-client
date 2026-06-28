<<<<<<< HEAD
import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/router.js'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
=======
import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js'

import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app');
>>>>>>> dev
