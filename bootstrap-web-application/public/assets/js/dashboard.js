var app = new Vue({
    el: '.wrapper',
    data: {
        message: 'Hello Firebase Application!'
    },
    mounted() {
        toggleLoading(true)


        db.collection('fleet-orders').orderBy('timestamp', 'desc')
            // .where('received','==',false)
            .get()
            .then((docs) => {
                toggleLoading(false)
                var table = $('#items-table');

                return docs.forEach(doc => {
                    // console.log(doc.data())

                    // get data
                    var data = doc.data()

                    // Append data to the table
                    table.append(`
                        <tr>
                        <td id="${data.key}" class="rows text-dark">
                            ${data.city}
                        </td>
                        <td id="${data.key}" class="rows text-dark">
                            ${data.item}
                        </td>
                        <td id="${data.key}" class="rows text-dark">
                            ${data.recipient}
                        </td>
                        <td id="${data.key}" class="rows text-dark">
                            ${data.region}
                        </td>
                        <td id="${data.key}" class="rows text-dark">
                            ${data.sender}
                        </td>
                        <td id="${data.key}" class="rows text-dark">
                            <b>${data.key}</b>
                        </td>
                        <td>
                            <a href="#report" class="btn btn-primary">Print Report</a>
                        </td>
                    </tr>
                `);
                });
            });

    },
})