const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Test function
exports.helloWorld = functions.https.onRequest(async (request, response) => {
  response.send("Hello from Ghana Post Test transmission!");
});

// Populate statistics
exports.populateStats = functions.pubsub
  .schedule("every 2 minutes")
  .onRun(ctx => {
    // Fields
    var count = 0,
      total = 0,
      percentage = 0.0,
      updated_at = ctx.timestamp;

    // Firestore
    var firestore = admin.firestore();

    // Tasks
    var tasks = [];
    tasks.push(firestore.collection("items").get());

    // Run through for inbounds
    // Run through for outbounds
    // Run through for on-time
    // Run through for late

    return Promise.all(tasks)
      .then(results => {
        if (results) {
          var inbounds = [],
            outbounds = [],
            ontime = [],
            late = [];

          // results.forEach(doc => {
          //   console.log(doc.data());
          //   // Get data for each field
          //   var data = doc.data();
          // });
          return console.log(results);
        } else {
          console.log("No items found");
        }
      })
      .catch(err => {
        if (err) {
          return console.log(err.message);
        }
      });

    // Return stats
    // return firestore.collection("stats").doc("inbounds")
    //   .set({
    //     count,
    //     total,
    //     percentage,
    //     updated_at
    //   })
    //   .then(() => {})
    //   .catch(err => {});
  });
