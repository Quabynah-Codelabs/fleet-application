const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.sendNotification = functions.firestore.document('fleet-orders/{key}').onCreate((snapshot,ctx) => {
    // Get the key of the item
    const key = ctx.params.key

    return admin.firestore().collection('fleet-users').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                return admin.messaging().sendToDevice(doc.data().token, {
                    data: {
                        itemKey: key,
                        type: 'Order Item'
                    }
                }).then(() => {
                    return console.log('Notification sent to all users');
                }).catch((reason) => {
                    if (reason) {
                        return console.log(reason.message)
                    }
                })
            })
        }).catch((reason) => {
            if (reason) {
                return console.log(reason.message)
            }
        })

})
