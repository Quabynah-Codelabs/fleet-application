// Empty data set of all the outgoing mail items in the database
let dataset = []

$(document).ready(() => {
    // Load all items
    db.collection('fleet-orders').orderBy('timestamp', 'desc')
        // .where('received','==',false)
        .get()
        .then((docs) => {
            toggleLoading(false)
            var table = $('#items-table');

            return docs.forEach(doc => {
                dataset.push(doc.data())

                // get data
                var data = doc.data()

                // Append data to the table
                table.append(`
                        <tr data-href="${data.key}">
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
                            <a href="#report" class="btn btn-primary">View details</a>
                        </td>
                    </tr>
                `);
            });
        });

    // Add click action to each data row
    $(document).on('click', "tr[data-href]", function () {
        // notify(this.dataset.href, false)
        toggleLoading(true)
        db.collection('fleet-orders')
            .doc(this.dataset.href).get()
            .then((snapshot) => {
                toggleLoading(false)

                // Show details
                showItemDetails(snapshot.data())
            })
    })
})

// Show details for each item
let model = null
const showItemDetails = (dataModel) => {
    model = dataModel
    $('#item-key').text(`${dataModel.key}`)
    $('#item-city').text(`Receiving City: ${dataModel.city}`)
    $('#item-sender').text(`Sender: ${dataModel.sender}`)
    $('#item-duration').text(`Duration (in days): ${dataModel.duration}`)
    $('#item-comment').text(`${dataModel.comment}`)

    $('#modal-item-details').modal('show')
}

// Print Single item
const printItem = () => {
    var someJSONdata = []
    someJSONdata.push(model)
    printJS({
        printable: someJSONdata,
        properties: ['key', 'sender', 'item', 'duration', 'city', 'recipient', 'sending_office', 'sending_region', 'region'],
        type: 'json'
    })
}

// Print all items
const printReport = () => {
    printJS({
        printable: dataset,
        properties: ['key', 'sender', 'item', 'duration', 'city', 'recipient', 'sending_office', 'sending_region', 'region'],
        type: 'json'
    })
}