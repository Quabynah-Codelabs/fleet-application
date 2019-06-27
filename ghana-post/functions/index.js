const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Test function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Ghana Post Test transmission!");
});

exports.populateStats = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(ctx => {
    // Fields
    var count = 0,
      total = 0,
      percentage = 0.0,
      updated_at = ctx.timestamp;

    // Run through for inbounds
    // Run through for outbounds
    // Run through for on-time
    // Run through for late

    // Return stats
    return admin
      .firestore()
      .collection("stats")
      .doc("inbounds")
      .set({
        count,
        total,
        percentage,
        updated_at
      })
      .then(() => {})
      .catch(err => {});
  });
