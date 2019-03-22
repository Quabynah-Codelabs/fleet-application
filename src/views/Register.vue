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
                                <h3>Sign up to get started</h3>
                            </div>
                        </template>
                        <template>
                            <div class="text-center text-muted mb-4">
                                <small>Enter your credentials below</small>
                            </div>
                            <form role="form">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Name"
                                            v-model="username"
                                            addon-left-icon="ni ni-hat-3">
                                </base-input>
                                <base-input alternative
                                            class="mb-3"
                                            v-model="email"
                                            placeholder="Email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            v-model="password"
                                            placeholder="Password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <base-checkbox :checked="isPrivacyChecked">
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </base-checkbox>
                                <div class="text-center">
                                    <base-button type="default" @click="createAccount" class="my-4">Create account</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div class="col-6">
                           
                        </div>
                        <div class="col-6 text-right">
                            <a href="/login" class="text-light">
                                <small>Already a user? Sign in instead</small>
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
    name: 'register',
    data() {
        return {
            email: '',
            password: '',
            username: '',
            isPrivacyChecked: false
        }
    },
    methods: {
        createAccount: (ev) => {
            ev.preventDefault()
            console.log(`Email: ${self.username}`)
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
