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
                    console.log(doc.data())

                    var data = doc.data()
                    table.append(`
                        <tr>
                        <td class="text-dark">
                            1
                        </td>
                        <td class="text-dark">
                            ${data.city}
                        </td>
                        <td class="text-dark">
                            ${data.item}
                        </td>
                        <td class="text-dark">
                            ${data.recipient}
                        </td>
                        <td class="text-dark">
                            ${data.region}
                        </td>
                        <td class="text-dark">
                            ${data.sender}
                        </td>
                        <td class="text-dark">
                            <b>${data.key}</b>
                        </td>
                    </tr>
                `);
                });
            })
    },
})