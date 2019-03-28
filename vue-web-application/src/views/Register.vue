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
                                            id="username"
                                            addon-left-icon="ni ni-hat-3">
                                </base-input>
                                <base-input alternative
                                            class="mb-3"
                                            v-model="email"
                                            id="email"
                                            placeholder="Email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            v-model="password"
                                            id="password"
                                            placeholder="Password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
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
import firebaseapp from '../components/firebase/firebaseinit'
import validator from 'validator'

export default {
    name: 'register',
    data() {
        return {
            email: '',
            password: '',
            username: ''
        }
    },
    methods: {
        createAccount: (ev) => {
            ev.preventDefault()
            
            var username = document.getElementById('username').value
            var email = document.getElementById('email').value
            var password = document.getElementById('password').value

            if (!validator.isEmail(email)) {
                alert("Please enter a valid email address...")
                return
            } else if (username != '' && password != '') {
                
                document.getElementById('overlay').style.display = "block"

                firebaseapp.auth.createUserWithEmailAndPassword(email,password)
                .then((userInfo) => {
                   firebaseapp.firestore.collection('fleet-admin').doc(firebaseapp.auth.currentUser.uid).set({
                       key: `${firebaseapp.auth.currentUser.uid}`,
                       name: username,
                       email: email,
                       photoUrl: `${firebaseapp.auth.currentUser.photoUrl}`,
                       token: null,
                       timestamp: `${new Date().getTime()}`,
                       role: 'admin'
                   }).then(() => {
                        document.getElementById('overlay').style.display = "none"
                        window.localStorage.setItem('fleet-uid',firebaseapp.auth.currentUser.uid)
                        window.location = '/dashboard'
                   })
                }).catch((reason) => {
                    document.getElementById('overlay').style.display = "none"
                    alert(reason.message)
                })
            } else {
                alert("Please enter a valid username and password")
            }
            

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
