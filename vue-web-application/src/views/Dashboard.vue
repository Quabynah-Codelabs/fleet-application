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
                <!-- Charts -->
                <!-- <div class="col-lg-6 mb-lg-auto pb-lg">
                    <div>
                        <card class="border-0" type="secondary" shadow
                              body-classes="px-lg-5 py-lg-5"
                              header-classes="bg-white">
                            <template slot="header">
                                <div class="text-muted text-center mb-3">
                                    <h4>Outgoing Items</h4>
                                </div>
                            </template>
                                <canvas id="outgoing_items_chart" width="400" height="400"></canvas>
                            <template>
                                
                            </template>
                        </card>
                    </div>
                </div>

                <div class="col-lg-6 mb-lg-auto pb-lg">
                    <div>
                        <card class="border-0" type="secondary" shadow
                              body-classes="px-lg-5 py-lg-5"
                              header-classes="bg-white">
                            <template slot="header">
                                <div class="text-muted text-center mb-3">
                                    <h4>Incoming Items</h4>
                                </div>
                            </template>
                                <canvas id="incoming_items_chart" width="400" height="400"></canvas>
                            <template>
                                
                            </template>
                        </card>
                    </div>
                </div> -->

                <!-- Users -->
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

                <!-- Items -->
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
                                <!-- <table class="table table-striped table-responsive">
                                    <thead class="thead-dark">
                                        <tr>
                                        <th scope="col">City</th>
                                        <th scope="col">Item</th>
                                        <th scope="col">Recipient</th>
                                        <th scope="col">Region</th>
                                        <th scope="col">Sender</th>
                                        <th scope="col">Key</th>
                                        <th scope="col">State (received)</th>
                                        </tr>
                                    </thead>
                                    <tbody id="t_body_items">
                                        <tr><th>${data.city}</th><td>${data.item}</td><td>${data.recipient}</td><td>${data.region}</td><td>${data.sender}</td><td>${data.key}</td><td>${data.received}</td></tr>
                                    </tbody>
                                </table> -->
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
import Chart from 'chart.js';

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
                },
                {
                    key: 'received',
                    sortable: true
                },
                {
                    key: 'timestamp'
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
            users: [],
            regions: ['Greater Accra','Central','Eastern','Western','Brong-Ahafo','Volta','Upper-East','Upper-West','Ashanti', 'Northern']
        }
    },
    methods: {
        viewDetails: (record, index) => {
            window.localStorage.setItem('row-item-code',record.key)
            window.open('/details','_blank')
        }
    },
    mounted() {
        // Get all items
        firebaseapp.firestore.collection('fleet-orders').orderBy('timestamp','desc')
        // .where('received','==',false)
        .get()
        .then((docs) => {
            document.getElementById('overlay').style.display = "none"
            var table = document.getElementById('t_body_items');

            return docs.forEach(doc => {
                console.log(doc.data())
                this.items.push(doc.data())
                // var data = docs.data();
                // table.append(`<tr><th>${data.city}</th><td>${data.item}</td><td>${data.recipient}</td><td>${data.region}</td><td>${data.sender}</td><td>${data.key}</td><td>${data.received}</td></tr>`);
            });
        })

        // Get all users
        firebaseapp.firestore.collection('fleet-users').get()
        .then((docs) => {
            document.getElementById('overlay').style.display = "none"
            return docs.forEach(doc => {
                console.log(doc.data())
                this.users.push(doc.data())
            })
        })

        // Get performance scale
        var ctx = document.getElementById('outgoing_items_chart')
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.regions,
                datasets: [{
                    label: '# of Outgoing items',
                    data: [12, 19, 3, 5, 2, 3, 3,6,3,5],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 2)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

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