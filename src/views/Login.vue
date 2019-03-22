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
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-muted text-center mb-3">
                                <h3>Sign in to get started</h3>
                            </div>
                        </template>
                        <template>
                            <div class="text-center text-muted mb-4">
                                <small>Enter your email and password below</small>
                            </div>
                            <form role="form" @submit="login">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            v-model="form.email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            v-model="form.password"
                                            placeholder="Password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <base-checkbox :checked="form.rememberMe">
                                    Remember me
                                </base-checkbox>
                                <div class="text-center">
                                    <base-button @click="login" type="default" class="my-4">Sign In</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div class="col-6">
                           
                        </div>
                        <div class="col-6 text-right">
                            <a href="/register" class="text-light">
                                <small>Create new account</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </section>
</template>
<script>
import firebaseapp from '../firebase/firebaseinit'

export default {
    name: 'login',
    data() {
        return {
            form : {
                email: '',
                password: '',
                rememberMe: false
            }
        }
    },
    mounted:() => {
        
    },
    methods: {
        login: (ev) => {
            ev.preventDefault()
            firebaseapp.auth.signInWithEmailAndPassword('demo@gmail.com','quabynah4')
            .then((userInfo) => {
                alert(`Logged in as ${userInfo.user.email}!`)
                window.localStorage.setItem('fleet-uid',userInfo.user.uid)
                window.location = '/dashboard'
            }).catch((reason) => {
                alert(reason.message)
            })
        }
    },
    mounted() {
        if (window.localStorage.getItem('fleet-uid') != null) {
            alert(`You are signed in already as ${firebaseapp.auth.currentUser.email}`)
            window.location = '/dashboard'
        }
    }
};
</script>
<style>
</style>
