import Vue from "vue";
import Router from "vue-router";
import Header from "./layout/starter/StarterHeader";
import Footer from "./layout/starter/StarterFooter";
import Starter from "./views/Starter.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "starter",
      components: {
        header: Header,
        default: Starter,
        footer: Footer
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: Header,
        default: Login,
        footer: Footer
      }
    },
    {
      path: "/create",
      name: "register",
      components: {
        header: Header,
        default: Register,
        footer: Footer
      }
    },
    {
      path: "/home",
      name: "home",
      components: {
        header: Header,
        default: Home,
        footer: Footer
      }
    }
  ]
});
