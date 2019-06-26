const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Test function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Ghana Post Test transmission!");
});
