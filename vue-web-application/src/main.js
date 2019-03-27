import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebaseapp from './components/firebase/firebaseinit'

Vue.config.productionTip = false

new Vue({
  router,
  firebaseapp,
  render: h => h(App)
}).$mount('#app')
