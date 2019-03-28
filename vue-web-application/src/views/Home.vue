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

            <div class="card bg-secondary shadow">
                <div class="card-header bg-white border-0">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">Order Details</h3>
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
                            <label class="form-control-label" for="input-region">Region</label>
                            <!-- <input type="text" id="input-region" v-model="region" class="form-control form-control-alternative" placeholder="Ashanti Region"> -->
                            <select name="region" id="input-region" v-model="region" class="form-control">
                                <option>Greater Accra</option>
                                <option>Central Region</option>
                                <option>Eastern Region</option>
                                <option>Western Region</option>
                                <option>Volta Region</option>
                            </select>
                        </div>
                        </div>
                        <div class="col-lg-6">
                        <div class="form-group">
                            <label class="form-control-label" for="input-city">City</label>
                            <input type="text" id="input-city" v-model="city" class="form-control form-control-alternative" placeholder="Bantama">
                        </div>
                        </div>
                    </div>
                    </div>
                    <hr class="my-4" />
                    <!-- Address -->
                    <h6 class="heading-small text-muted mb-4">Order information</h6>
                    <div class="pl-lg-4">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="form-group">
                                <label class="form-control-label" for="input-sender">Sender</label>
                                <input id="input-sender" v-model="sender" class="form-control form-control-alternative" placeholder="Benjamin" type="text">
                            </div>
                        </div>
                        <div class="col-lg-4">
                        <div class="form-group">
                            <label class="form-control-label" for="input-item">Item Type</label>
                            <!-- <input type="text" id="input-item" v-model="itemType" class="form-control form-control-alternative" placeholder="Letter"> -->
                             <select name="region" id="input-item" class="form-control" v-model="itemType">
                                <option>Letter</option>
                                <option>Parcel</option>
                             </select>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="text-center">
                        <base-button @click="submitOrder" type="default" class="my-4">Submit Order</base-button>
                    </div>
                </form>
                </div>
            </div>
        </div>
   </section>
</template>
<script>
import firebaseapp from '../components/firebase/firebaseinit'
import validator from 'validator'

export default {
    name: 'home',
    data() {
        return {
            
        }
    },
    mounted() {
        document.getElementById('overlay').style.display = "none"
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
