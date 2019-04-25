$(document).ready(() => {

    // Load all items
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
                            <a href="#report" class="btn btn-primary">Print Report</a>
                        </td>
                    </tr>
                `);
            });
        });

        $(document).on('click', "tr[data-href]", function () {
            notify($(this).text(), false)
        })
})