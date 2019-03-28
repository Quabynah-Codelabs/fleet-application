const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Initialize firebase application
admin.initializeApp()

exports.sendNotification = functions.firestore.document('fleet-orders/{key}').onCreate((snapshot,ctx) => {
    // Get the key of the item
    const key = ctx.params.key

    return admin.firestore().collection('fleet-users').doc(snapshot.data().recipient).get()
        .then((querySnapshot) => {
            return admin.messaging().sendToDevice(querySnapshot.data().token, {
                data: {
                    itemKey: key,
                    recipient: `${snapshot.data().recipient}`,
                    type: 'Order Item',
                    message: `Your item code is\n ${querySnapshot.id}.\nYou need it in order to verify your request when it arrives. Thank you`
                }
            }).then(() => {
                return console.log('Notification sent to all users');
            }).catch((reason) => {
                if (reason) {
                    return console.log(reason.message)
                }
            })
        }).catch((reason) => {
            if (reason) {
                return console.log(reason.message)
            }
        })

})
