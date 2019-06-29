const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Test function
exports.helloWorld = functions.https.onRequest(async (request, response) => {
  response.send("Hello from Ghana Post Test transmission!");
});

// Populate statistics
// exports.populateStats = functions.pubsub
//   .schedule("every 2 minutes")
//   .onRun(ctx => {
//     // Firestore
//     var firestore = admin.firestore();

//     // Standard days in milliseconds
//     var standardDaysMillis = 86400000;

//     // Get auth type
//     console.log("Auth Type:", ctx.authType);

//     // Get all items
//     return firestore
//       .collection("items")
//       .get()
//       .then(snapshots => {
//         snapshots.forEach(doc => {
//           var data = doc.data();
//           var standardDays = data.standard_days;
//           var timeReceived = data.time_received;
//           var timeSent = data.time_sent;
//           var sendingOffice = data.sending_office;
//           var receivingOffice = data.receiving_office;
//           var sendingRegion = data.sending_region;
//           var receivingRegion = data.receiving_region;
//           var sender = data.sender_uid;

//           // All tasks
//           var tasks = [];

//           // Create stats collection
//           var statsCollection = firestore.collection("stats");
//           // Show sending office information
//           console.log(sendingOffice.toLowerCase().replace(" ", "_"));

//           firestore
//             .collection("users")
//             .doc(sender)
//             .get()
//             .then(userDoc => {
//               if (!userDoc.exists) {
//                 throw "Document not found exception";
//               }

//               // Get user data
//               var user = userDoc.data();
//               if (user.office == sendingOffice) {
//                 var itemDoc = statsCollection.doc();
//                 var item = {
//                   key: itemDoc.id,
//                   type: "outbounds",
//                   itemKey: doc.id,
//                   standard_days: standardDays,
//                   timestamp: timeReceived,
//                   office: receivingOffice,
//                   region: receivingRegion,
//                   sender
//                 };
//                 tasks.push(itemDoc.set(item));

//                 if (data.received) {
//                   if (timeReceived <= standardDays * standardDaysMillis) {
//                     // On time
//                     var newItemDoc = statsCollection.doc();
//                     var newItem = {
//                       key: newItemDoc.id,
//                       type: "ontime",
//                       itemKey: doc.id,
//                       standard_days: standardDays,
//                       timestamp: timeReceived,
//                       office: receivingOffice,
//                       region: receivingRegion,
//                       sender
//                     };
//                     tasks.push(newItemDoc.set(newItem));
//                   } else {
//                     // Late
//                     var newItemDoc = statsCollection.doc();
//                     var newItem = {
//                       key: newItemDoc.id,
//                       type: "late",
//                       itemKey: doc.id,
//                       standard_days: standardDays,
//                       timestamp: timeReceived,
//                       office: receivingOffice,
//                       region: receivingRegion,
//                       sender
//                     };
//                     tasks.push(newItemDoc.set(newItem));
//                   }
//                 }
//               } else if (receivingOffice == user.office) {
//                 var itemDoc = statsCollection.doc();
//                 var item = {
//                   key: itemDoc.id,
//                   type: "inbounds",
//                   itemKey: doc.id,
//                   standard_days: standardDays,
//                   timestamp: timeSent,
//                   office: sendingOffice,
//                   region: sendingRegion,
//                   sender
//                 };
//                 tasks.push(itemDoc.set(item));
//               }
//             });

//           return Promise.all(tasks)
//             .then(() => {
//               console.log("Transaction successfully committed!");
//             })
//             .catch(error => {
//               return console.log("Transaction failed: ", error);
//             });
//         });
//       })
//       .catch(err => {
//         if (err) {
//           return console.log(err);
//         }
//       });
//   });

exports.updateStats = functions.firestore
  .document("items/{key}")
  .onUpdate((change, ctx) => {
    var data = change.after.data();
    var standardDays = data.standard_days;
    var timeReceived = data.time_received;
    var timeSent = data.time_sent;
    var sendingOffice = data.sending_office;
    var receivingOffice = data.receiving_office;
    var sendingRegion = data.sending_region;
    var receivingRegion = data.receiving_region;
    var sender = data.sender_uid;

    // All tasks
    var tasks = [];

    // Firestore
    var firestore = admin.firestore();

    // Standard days in milliseconds
    var standardDaysMillis = 86400000;

    // Create stats collection
    var statsCollection = firestore.collection("stats");
    // Show sending office information
    console.log(sendingOffice.toLowerCase().replace(" ", "_"));

    firestore
      .collection("users")
      .doc(sender)
      .get()
      .then(userDoc => {
        if (!userDoc.exists) {
          throw "Document not found exception";
        }

        // Get user data
        var user = userDoc.data();
        if (user.office == sendingOffice) {
          var itemDoc = statsCollection.doc();
          var item = {
            key: itemDoc.id,
            type: "outbounds",
            itemKey: ctx.params.key,
            standard_days: standardDays,
            timestamp: timeReceived,
            sending_office: sendingOffice,
            receiving_office: receivingOffice,
            sender
          };
          tasks.push(itemDoc.set(item));

          if (data.received) {
            if (timeReceived <= standardDays * standardDaysMillis) {
              // On time
              var newItemDoc = statsCollection.doc();
              var newItem = {
                key: newItemDoc.id,
                type: "ontime",
                itemKey: ctx.params.key,
                standard_days: standardDays,
                timestamp: timeReceived,
                sending_office: sendingOffice,
                receiving_office: receivingOffice,
                sender
              };
              tasks.push(newItemDoc.set(newItem));
            } else {
              // Late
              var newItemDoc = statsCollection.doc();
              var newItem = {
                key: newItemDoc.id,
                type: "late",
                itemKey: ctx.params.key,
                standard_days: standardDays,
                timestamp: timeReceived,
                sending_office: sendingOffice,
                receiving_office: receivingOffice,
                sender
              };
              tasks.push(newItemDoc.set(newItem));
            }
          }
        } else if (receivingOffice == user.office) {
          var itemDoc = statsCollection.doc();
          var item = {
            key: itemDoc.id,
            type: "inbounds",
            itemKey: ctx.params.key,
            standard_days: standardDays,
            timestamp: timeSent,
            sending_office: sendingOffice,
            receiving_office: receivingOffice,
            sender
          };
          tasks.push(itemDoc.set(item));
        }
      });

    return Promise.all(tasks)
      .then(() => {
        console.log("Transaction successfully committed!");
      })
      .catch(error => {
        return console.log("Transaction failed: ", error);
      });
  });
