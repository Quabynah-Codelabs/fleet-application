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
                                            id="email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            v-model="form.password"
                                            placeholder="Password"
                                            id="password"
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
                            <a href="/create" class="text-light">
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
import firebaseapp from '../components/firebase/firebaseinit'
import validator from 'validator'

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
    methods: {
        login: (ev) => {
            ev.preventDefault()

            var emailAddress = document.getElementById('email').value
            var password = document.getElementById('password').value

            if (!validator.isEmail(emailAddress)) {
                alert("Please enter a valid email address...")
                return
            } else if (validator.isEmpty(password)) {
                alert("Please enter a valid password...")
                return
            }


            document.getElementById('overlay').style.display = "block"
            firebaseapp.auth.signInWithEmailAndPassword(emailAddress,password)
            .then((userInfo) => {
                document.getElementById('overlay').style.display = "none"
                // alert(`Logged in as ${userInfo.user.email}!`)
                window.localStorage.setItem('fleet-uid',firebaseapp.auth.currentUser.uid)
                window.location = '/dashboard'
            }).catch((reason) => {
                document.getElementById('overlay').style.display = "none"
                alert(reason.message)
            })
        }
    },
    mounted() {
        document.getElementById('overlay').style.display = "none"
        if (window.localStorage.getItem('fleet-uid') != null) {
            alert(`You are signed in already as ${firebaseapp.auth.currentUser.email}`)
            window.location = '/dashboard'
        }
    }
};
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
