<template>
    <header class="header-global">
        <base-nav class="navbar-main" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/white.png" alt="logo">
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
                        <img src="img/brand/blue.png">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>

            <!-- <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
                <base-dropdown tag="li" class="nav-item">
                    <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
                        <i class="ni ni-collection d-lg-none"></i>
                        <span class="nav-link-inner--text">More options</span>
                    </a>
                    <router-link to="/dashboard" class="dropdown-item">Dashboard</router-link>
                    <router-link to="/upload" class="dropdown-item">Upload new item</router-link>
                </base-dropdown>
            </ul> -->
            <ul class="navbar-nav align-items-lg-center ml-lg-auto">
                <li class="nav-item d-none d-lg-block ml-lg-4">
                    <a href="/dashboard" rel="noopener"
                       class="btn btn-neutral btn-icon">
                <span class="btn-inner--icon">
                  <i class="fa fa-dashboard mr-2"></i>
                </span>
                        <span class="nav-link-inner--text">Dashboard</span>
                    </a>
                </li>
                 <li class="nav-item d-none d-lg-block ml-lg-4">
                    <a href="/upload" rel="noopener"
                       class="btn btn-neutral btn-icon">
                <span class="btn-inner--icon">
                  <i class="fa fa-cloud-download mr-2"></i>
                </span>
                        <span class="nav-link-inner--text">Upload Item</span>
                    </a>
                </li>
            </ul>
        </base-nav>
    </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  }
};
</script>
<style>
</style>
