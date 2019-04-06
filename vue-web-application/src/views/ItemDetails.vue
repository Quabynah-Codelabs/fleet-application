<template>
    <div class="">
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-style-1 shape-primary shape-skew alpha-4">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
        <section class="section section-skew">
            <div class="container">
                 <!-- Spinner -->
                <div id="overlay">
                    <div class="spinner"></div>
                </div>
                <!-- Spinner End -->
                
                <card shadow class="card-profile mt--300" no-body>
                    <div class="px-4">
                        <div class="text-center mt-5">
                            <h3>{{ key }}</h3>
                        </div>
                        <div class="mt-5 border-top text-center">
                            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>Item type: <b>{{ item }}</b></div>
                            <div><i class="ni education_hat mr-2"></i>Receiver City: <b>{{ city }}</b></div>
                        </div>
                        <div class="mt-5 border-top text-center">
                            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>Recipient: <b>{{ recipient }}</b></div>
                            <div><i class="ni education_hat mr-2"></i>Sender: <b>{{ sender }}</b></div>
                            <div><i class="ni education_hat mr-2"></i>Duration (in days): <b>{{ duration }}</b></div>
                        </div>
                        <div class="mt-5 mb-5 py-5 border-top text-center">
                            <div class="row justify-content-center">
                                <div class="col-lg-9">
                                    <p>{{ comment }}</p>
                                    <button class="btn btn-default btn-raised" id="clearItem" @click="removeItem">Clear This Item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </card>
            </div>
        </section>
    </div>
</template>

<script>
import firebaseapp from '../components/firebase/firebaseinit'

export default {
    name: 'details',
    data() {
        return {
            city: '',
            duration: '',
            comment: '',
            item: '',
            recipient: '',
            region: '',
            sender: '',
            key: window.localStorage.getItem('row-item-code'),
            timestamp: ''
        }
    },
    methods: {
        removeItem() {
            document.getElementById('overlay').style.display = "block"
            firebaseapp.firestore.doc(`fleet-orders/${window.localStorage.getItem('row-item-code')}`)
            .update({
                received: true
            })
            .then(() => {
                document.getElementById('overlay').style.display = "none"
                window.location = '/dashboard'
            }).catch((reason) => {
                document.getElementById('overlay').style.display = "none"
                alert(reason.message)
            })
        }
    },
    mounted() {

        firebaseapp.firestore.doc(`fleet-orders/${window.localStorage.getItem('row-item-code')}`)
        .get().then((doc) => {
            console.log(doc.data())
            document.getElementById('overlay').style.display = "none"

            this.city = doc.data().city
            this.duration = doc.data().duration
            this.comment = doc.data().comment === "none" ? "" : doc.data().comment
            this.item = doc.data().item
            this.recipient = doc.data().recipient
            this.region = doc.data().region
            this.sender = doc.data().sender
            this.timestamp = doc.data().timestamp
            this.key = doc.data().key

        }).catch((reason) => {
            document.getElementById('overlay').style.display = "none"
            alert(reason.message)
        })
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
