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
var loading;

// Create Firebase Initialization
$(document).ready(function() {
  console.log(`Firebase SDK initialized as: ${firebase.app().name}`);
  loading = $("#loading");
  if (loading) showLoading(false);
});

// Toggle loading state
const showLoading = state => {
  if (state) {
    loading.css("display", "block");
  } else {
    loading.css("display", "none");
  }
};

// Show notification
const showNotification = message => {
    function onShowNotification() {
        console.log("notification is shown!");
      }
  
      function onCloseNotification() {
        console.log("notification is closed!");
      }
  
      function onClickNotification() {
        console.log("notification was clicked!");
      }
  
      function onErrorNotification() {
        console.error(
          "Error showing notification. You may need to request permission."
        );
      }
  
      function onPermissionGranted() {
        console.log("Permission has been granted by the user");
        doNotification();
      }
  
      function onPermissionDenied() {
        console.warn("Permission has been denied by the user");
      }
  
      function doNotification() {
        var myNotification = new Notify("GhanaPost", {
          body: message,
          tag: new Date().getTime().toString(),
          notifyShow: onShowNotification,
          notifyClose: onCloseNotification,
          notifyClick: onClickNotification,
          notifyError: onErrorNotification,
          timeout: 4
        });
  
        myNotification.show();
      }
  
      if (!Notify.needsPermission) {
        doNotification();
      } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
      }
};
