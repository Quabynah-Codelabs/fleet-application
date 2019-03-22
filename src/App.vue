<template>
    <div id="app">
        <router-view name="header"></router-view>
        <main>
            <fade-transition origin="center" mode="out-in" :duration="250">
                <router-view/>
            </fade-transition>
        </main>
        <router-view name="footer"></router-view>
    </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import firebaseapp from './firebase/firebaseinit'

export default {
  components: {
    FadeTransition
  }, 
  mounted() {
    if (firebaseapp.auth.currentUser && this.$router.currentRoute.name !== 'dashboard') {
      console.log('We are not on the dashboard page although the user is logged in correctly')
    } else {
      console.log('We are not logged in yet')
    }
  }
};
</script>
