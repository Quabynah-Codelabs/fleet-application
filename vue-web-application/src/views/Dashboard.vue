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
                <div class="col-lg-12 mb-lg-auto pb-lg">
                    <div>
                        <card class="border-0" type="secondary" shadow
                              body-classes="px-lg-5 py-lg-5"
                              header-classes="bg-white">
                            <template slot="header">
                                <div class="text-muted text-center mb-3">
                                    <h4>All registered users</h4>
                                </div>
                            </template>
                            <template>
                                <b-table striped responsive head-variant="dark" hover :fields="userFields" :items="users"></b-table>
                            </template>
                        </card>
                    </div>
                </div>

                <div class="col-lg-12 mb-lg-auto">
                    <div>
                        <card class="border-0" type="secondary" shadow
                              body-classes="px-lg-5 py-lg-5"
                              header-classes="bg-white">
                            <template slot="header">
                                <div class="text-muted text-center mb-3">
                                    <h4>Items Repository</h4>
                                </div>
                            </template>
                            <template>
                               <b-table striped responsive hover head-variant="dark" :fields="itemFields" :items="items" @row-clicked="viewDetails"></b-table>
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
import BTable from "bootstrap-vue/es/components/table/table";

export default {
    name: 'dashboard',
    components: {
        BTable
    },
    data(){
        return {
            email: firebaseapp.auth.currentUser.email,
            itemFields: [
                {
                key: 'city',
                sortable: true
                }, 
                {
                    key: 'item',
                    sortable: false
                },
                {
                    key: 'recipient',
                    sortable: true
                },
                {
                    key: 'region',
                    sortable: true
                },
                {
                    key: 'sender',
                    sortable: true
                },
                {
                    key: 'key',
                    sortable: true
                }  
            ],
            userFields: [
                 {
                    key: 'name',
                    sortable: true
                },
                {
                    key: 'email',
                    sortable: false
                },
                {
                    key: 'key',
                    sortable: false
                }
            ],
            items: [],
            users: []
        }
    },
    methods: {
        viewDetails: (record, index) => {
            window.localStorage.setItem('row-item-code',record.key)
            window.open('/details','_blank')
        }
    },
    mounted() {

        firebaseapp.firestore.collection('fleet-orders').orderBy('timestamp','desc').get()
        .then((docs) => {
            document.getElementById('overlay').style.display = "none"
            return docs.forEach(doc => {
                this.items.push(doc.data())
            })
        })

        firebaseapp.firestore.collection('fleet-users').get()
        .then((docs) => {
            document.getElementById('overlay').style.display = "none"
            return docs.forEach(doc => {
                console.log(doc.data())
                this.users.push(doc.data())
            })
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