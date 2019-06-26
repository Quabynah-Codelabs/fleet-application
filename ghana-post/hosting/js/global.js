var firebaseConfig = {
  apiKey: "AIzaSyCHrw7OA55UVzr3w1WeDb8eWD2Ivj7iWp8",
  authDomain: "ghana-post.firebaseapp.com",
  databaseURL: "https://ghana-post.firebaseio.com",
  projectId: "ghana-post",
  storageBucket: "ghana-post.appspot.com",
  messagingSenderId: "75251627638",
  appId: "1:75251627638:web:0c5c3e08d8123958"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get SDKs
let auth = firebase.auth();
let db = firebase.firestore();
let bucket = firebase.storage().reference;

// Create Firebase Initialization
$(document).ready(function() {
  console.log(`Firebase SDK initialized as: ${firebase.app().name}`);
  $("#loading").css("display", "none");
});
