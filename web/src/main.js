import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import './registerServiceWorker'
import firebaseapp from './firebase/firebaseinit'

Vue.config.productionTip = false;
Vue.use(Argon);
new Vue({
  router,
  firebaseapp,
  render: h => h(App)
}).$mount("#app");
