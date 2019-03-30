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
                                <h3>Recover password</h3>
                            </div>
                        </template>
                        <template>
                            <div class="text-center text-muted mb-4">
                                <small>Please enter your email address to continue</small>
                            </div>
                            <form role="form" @submit="login">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            v-model="form.email"
                                            id="email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <div class="text-center">
                                    <base-button @click="recoverPassword" type="default" class="my-4">Send Email</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                    <div class="row mt-3">
                        <div class="col-6">
                           <a href="/login" class="text-light">
                                <small>Back to login</small>
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
    name: 'password-reset',
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
        recoverPassword: (ev) => {
            ev.preventDefault()

            var emailAddress = document.getElementById('email').value

            if (!validator.isEmail(emailAddress)) {
                alert("Please enter a valid email address...")
                return
            }

            document.getElementById('overlay').style.display = "block"
            firebaseapp.auth.sendPasswordResetEmail(emailAddress)
            .then((userInfo) => {
                document.getElementById('overlay').style.display = "none"
                alert(`Password link sent to ${emailAddress}`)
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
