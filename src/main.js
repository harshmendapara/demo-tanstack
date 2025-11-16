import { createApp } from 'vue'
import App from './App.vue'

// Vue Query imports
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Create Vue app
const app = createApp(App)

// Create QueryClient instance
const queryClient = new QueryClient()

// Install VueQueryPlugin
app.use(VueQueryPlugin, {
  queryClient,
})
// Mount app
app.mount('#app')
