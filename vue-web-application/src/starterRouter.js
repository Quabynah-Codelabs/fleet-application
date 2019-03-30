import Vue from "vue";
import Router from "vue-router";
import Header from "./layout/starter/StarterHeader";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Footer from "./layout/starter/StarterFooter";
import Starter from "./views/Starter.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import ItemDetails from "./views/ItemDetails.vue";
import Components from "./views/Components.vue";
import NotFound from "./views/NotFoundPage.vue"
import RememberPassword from "./views/RememberPassword.vue"

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
      path: "/upload",
      name: "home",
      components: {
        header: AppHeader,
        default: Home,
        footer: AppFooter
      }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      components: {
        header: AppHeader,
        default: Dashboard,
        footer: AppFooter
      }
    },
    {
      path: "/details",
      name: "details",
      components: {
        header: AppHeader,
        default: ItemDetails,
        footer: AppFooter
      }
    },
    {
      path: "/demo",
      name: "components",
      components: {
        header: AppHeader,
        default: Components,
        footer: AppFooter
      }
    },
    {
      path: "/recover",
      name: "password-reset",
      components: {
        header: Header,
        default: RememberPassword,
        footer: Footer
      }
    },
    { 
      path: "*", 
      component: NotFound
    }
  ]
});
