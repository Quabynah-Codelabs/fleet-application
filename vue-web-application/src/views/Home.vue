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
        <div class="container">
             <!-- Spinner -->
                <div id="overlay">
                    <div class="spinner"></div>
                </div>
            <!-- Spinner End -->

            <!-- Add new data to list -->
             <div class="col-lg-12">
                    <div class="card bg-secondary shadow">
                        <div class="card-header bg-white border-0">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <h3 class="mb-0">Mail Item</h3>
                            </div>
                            <div class="col-4">
                                <small class="mb-0">Logged in as <strong>{{ email }}</strong></small>
                            </div>
                        </div>
                        </div>
                        <div class="card-body">
                        <form>
                            <h6 class="heading-small text-muted mb-4">Location &amp; Address</h6>
                            <div class="pl-lg-4">
                            <div class="row">
                                 <div class="col-lg-6">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-region">Sending Region</label>
                                        <!-- <input type="text" id="input-region" v-model="region" class="form-control form-control-alternative" placeholder="Ashanti Region"> -->
                                        <select name="region" id="input-s-region" v-model="s_region" class="form-control">
                                            <option>Greater Accra</option>
                                            <option>Central Region</option>
                                            <option>Eastern Region</option>
                                            <option>Brong-Ahafo Region</option>
                                            <option>Western Region</option>
                                            <option>Volta Region</option>
                                            <option>Upper-East Region</option>
                                            <option>Upper-West Region</option>
                                            <option>Northern Region</option>
                                            <option>Ashanti Region</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-s-city">Sending Office</label>
                                        <input type="text" id="input-s-city" v-model="city" class="form-control form-control-alternative" placeholder="Destination Name">
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-region">Receiving Region</label>
                                        <!-- <input type="text" id="input-region" v-model="region" class="form-control form-control-alternative" placeholder="Ashanti Region"> -->
                                        <select name="region" id="input-r-region" v-model="r_region" class="form-control">
                                            <option>Greater Accra</option>
                                            <option>Central Region</option>
                                            <option>Eastern Region</option>
                                            <option>Brong-Ahafo Region</option>
                                            <option>Western Region</option>
                                            <option>Volta Region</option>
                                            <option>Upper-East Region</option>
                                            <option>Upper-West Region</option>
                                            <option>Northern Region</option>
                                            <option>Ashanti Region</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-city">Receiving Office</label>
                                        <input type="text" id="input-r-city" v-model="r_city" class="form-control form-control-alternative" placeholder="Destination Name">
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-duration">Duration (in days)</label>
                                        <!-- <input type="number" id="input-duration" v-model="duration" class="form-control form-control-alternative" placeholder="" disabled> -->
                                        <select name="duration" id="input-duration" class="form-control" v-model="duration">
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <hr class="my-4" />
                            <!-- Address -->
                            <h6 class="heading-small text-muted mb-4">Mail Item information</h6>
                            <div class="pl-lg-4">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-sender">Sender</label>
                                        <input id="input-sender" v-model="sender" class="form-control form-control-alternative" placeholder="Your name" type="text" disabled>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-sender">Recipient</label>
                                        <select id="input-recipient" v-model="recipient" class="form-control form-control-alternative" placeholder="Full Name" type="text">
                                            <option v-for="(user, index) in users" :key="index">{{ user.name }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="form-group">
                                        <label class="form-control-label" for="input-item">Item Type</label>
                                        <!-- <input type="text" id="input-item" v-model="itemType" class="form-control form-control-alternative" placeholder="Letter"> -->
                                        <select name="region" id="input-item" class="form-control" v-model="itemType">
                                            <option selected="selected">Letter</option>
                                            <option>Parcel</option>
                                            <option>EMS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <label class="form-control-label" for="input-comment"></label>
                                             <div class="form-group">
                                        <label class="form-control-label" for="input-comment">Comment (if any)</label>
                                        <textarea type="text" rows="6" id="input-comment" v-model="comment" class="form-control form-control-alternative" placeholder="Enter a comment (optional)..."></textarea>
                                        
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="text-center">
                                <base-button @click="submitOrder" type="default" class="my-4">Submit Item</base-button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
        </div>
   </section>
</template>
<script>
import firebaseapp from '../components/firebase/firebaseinit'
import validator from 'validator'
import BFormTextArea from 'bootstrap-vue/es/components/form-textarea/form-textarea'

export default {
    name: 'home',
    components: {
        BFormTextArea
    },
    data() {
        return {
            email: '',
            region: '',
            city: '',
            sender: '',
            recipient: '',
            itemType: '',
            comment: '',
            sending_office: '',
            sending_region: '',
            duration: 2,
            users: []
        }
    },
    methods: {
        submitOrder: (ev) => {
            ev.preventDefault()
            var sregion = document.getElementById('input-s-region').value
            var scity = document.getElementById('input-s-city').value
            var rregion = document.getElementById('input-r-region').value
            var rcity = document.getElementById('input-r-city').value
            var sender = document.getElementById('input-sender').value
            var itemType = document.getElementById('input-item').value
            var recipient = document.getElementById('input-recipient').value
            var duration = document.getElementById('input-duration').value
            var comment = document.getElementById('input-comment').value

            if (validator.isEmpty(rregion) || validator.isEmpty(rcity) || validator.isEmpty(sregion) || validator.isEmpty(scity) || validator.isEmpty(sender) || validator.isEmpty(itemType) || validator.isEmpty(recipient)) {
                alert("Please fill in all these details before you proceed")
                return
            }

            var date = new Date()
            var time = date.getTime()
            console.log(`Date: ${date.toLocaleDateString()} & time: ${time}`)
            var code = sregion.substr(0,1).toUpperCase() + sregion.substr(sregion.indexOf(' ') + 1).substr(0,1).toUpperCase() + '-' + scity.substr(0,3).toUpperCase() + '-' + rregion.substr(0,1).toUpperCase() + rregion.substr(rregion.indexOf(' ') + 1).substr(0,1).toUpperCase() + '-' + rcity.substr(0,3).toUpperCase() + '-' + date.toLocaleDateString().substr(5,8) + time.toString().substr(7,12) + '-' +  sender.substr(0,3).toUpperCase() + '-' + itemType.substr(0,3).toUpperCase()
            console.log(code);
            var spinner = document.getElementById('overlay')
            spinner.style.display = "block"
            
            firebaseapp.firestore.collection('fleet-orders').doc(code).set({
                key: code,
                region: rregion,
                city: rcity,
                sender: sender,
                timestamp: time,
                recipient: recipient,
                duration: duration,
                comment: comment,
                item: itemType,
                sending_office: scity,
                sending_region: sregion,
                item: itemType,
                received: false
            }).then(() => {
                // Notify user of transactioon progress
                spinner.style.display = "none"
                alert("Request sent successfully with code: " + code)
            
                // Reset fields
                document.getElementById('input-region').value = ""
                document.getElementById('input-city').value = ""
                document.getElementById('input-duration').value = ""
                document.getElementById('input-item').value = ""
                document.getElementById('input-recipient').value = ""
                document.getElementById('input-comment').value = ""
            }).catch((reason) => {
                spinner.style.display = "none"
                alert(reason.message)
            })
        }
    },
    mounted() {
        document.getElementById('overlay').style.display = "none"

        if (window.localStorage.getItem('fleet-uid') === null) {
            alert("You need to be logged in first")
            window.location = '/'
            return
        }

        // Get current user's login UID
        if (window.localStorage.getItem('fleet-uid') != null) {
            firebaseapp.firestore.collection('fleet-admin')
            .doc(window.localStorage.getItem('fleet-uid')).get().then((response) => {
                if (response.exists) {
                    // Get data, if any
                    var data = response.data()
                    this.email = data.email
                    this.sender = data.name
                    this.sending_region = data.sending_region
                    this.sending_office = data.sending_office
                }
            }).catch((reason) => {
                alert(reason.message)
            })
        }

        // Get all users and fill in the spaces
        firebaseapp.firestore.collection('fleet-users').get().then((response) => {
            response.forEach(doc => {
                console.log(doc.data().email)
                this.users.push(doc.data())
            })
            console.log(`Users found: ${users}`)
        }).catch((reason) => {
            // alert(reason.message)
        })
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
