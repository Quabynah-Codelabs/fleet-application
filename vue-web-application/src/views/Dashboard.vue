<template>
  <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
             <!-- Spinner -->
            <div id="overlay">
                <div class="spinner"></div>
            </div>
            <!-- Spinner End -->

            <div class="row row-grid">
                <div class="col-lg-6 mb-lg-auto">
                    <div>
                        <card class="border-0" type="secondary" shadow
                              body-classes="px-lg-5 py-lg-5"
                              header-classes="pb-5 bg-white">
                            <template slot="header">
                                <div class="text-muted text-center mb-3">
                                    <small>Sign in with</small>
                                </div>
                                <div class="btn-wrapper text-center">
                                    <base-button type="neutral">
                                        <img slot="icon" src="img/icons/common/github.svg">
                                        Github
                                    </base-button>

                                    <base-button type="neutral">
                                        <img slot="icon" src="img/icons/common/google.svg">
                                        Google
                                    </base-button>
                                </div>
                            </template>
                            <template>
                                <div class="text-center text-muted mb-4">
                                    <small>Or sign in with credentials</small>
                                </div>
                                <form role="form">
                                    <base-input alternative
                                                placeholder="Email"
                                                addon-left-icon="ni ni-email-83">
                                    </base-input>
                                    <base-input alternative
                                                type="password"
                                                placeholder="Password"
                                                addon-left-icon="ni ni-lock-circle-open">
                                    </base-input>
                                    <base-checkbox>
                                        Remember me
                                    </base-checkbox>
                                    <div class="text-center">
                                        <base-button type="primary" class="my-4">Sign In</base-button>
                                    </div>
                                </form>
                            </template>
                        </card>
                    </div>
                </div>

                <div class="col-lg-6 mb-lg-auto">
                    <div>
                        <card class="border-0" type="secondary" shadow
                              body-classes="px-lg-5 py-lg-5"
                              header-classes="pb-5 bg-white">
                            <template slot="header">
                                <div class="text-muted text-center mb-3">
                                    <small>Sign in with</small>
                                </div>
                                <div class="btn-wrapper text-center">
                                    <base-button type="neutral">
                                        <img slot="icon" src="img/icons/common/github.svg">
                                        Github
                                    </base-button>

                                    <base-button type="neutral">
                                        <img slot="icon" src="img/icons/common/google.svg">
                                        Google
                                    </base-button>
                                </div>
                            </template>
                            <template>
                                <div class="text-center text-muted mb-4">
                                    <small>Or sign in with credentials</small>
                                </div>
                                <form role="form">
                                    <base-input alternative
                                                placeholder="Email"
                                                addon-left-icon="ni ni-email-83">
                                    </base-input>
                                    <base-input alternative
                                                type="password"
                                                placeholder="Password"
                                                addon-left-icon="ni ni-lock-circle-open">
                                    </base-input>
                                    <base-checkbox>
                                        Remember me
                                    </base-checkbox>
                                    <div class="text-center">
                                        <base-button type="primary" class="my-4">Sign In</base-button>
                                    </div>
                                </form>
                            </template>
                        </card>
                    </div>
                </div>
            </div>

             
        </div>
  </section>
</template>

<script>
import firebaseapp from '../components/firebase/firebaseinit'
import BaseTable from '../components/BaseTable.vue'

export default {
    name: 'dashboard',
    data(){
        return {
            email: firebaseapp.auth.currentUser.email
        }
    },
    methods: {
        
    },
    mounted() {
        document.getElementById('overlay').style.display = "none"
    }
}
</script>
<style scoped>
.spinner {
    width: 80px;
    height: 80px;
    border: 2px solid #f3f3f3;
    border-top: 3px solid #1A385B;
    border-radius: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: spin 1s infinite linear;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

#overlay {
    height: 100%;
    width: 100%;
    background: rgba(245, 237, 237, 0.8);
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
}
</style>