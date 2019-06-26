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
let messaging = firebase.messaging();

// Global
var loading;

// Create Firebase Initialization
$(document).ready(function() {
  // Firebase initialization test
  console.log(`Firebase SDK initialized as: ${firebase.app().name}`);

  //   Messaging initialization
  initMessaging();

  //   Init globals
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
  function onPermissionGranted() {
    console.log("Permission has been granted by the user");
    doNotification(message);
  }

  if (!Notify.needsPermission) {
    doNotification(message);
  } else if (Notify.isSupported()) {
    Notify.requestPermission(onPermissionGranted, onPermissionDenied);
  }
};

// Init Firebase Messaging Service
const initMessaging = () => {
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(
    "BE0bwbvsrKuUvxE8gUmLLs_7ZMzQCaqsyfBC94piZ84QBOUnXS2PfcoOUF7tF5BfrZjJNPG66OLp4ub5f-ynNwg"
  );
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Firebase notification permission granted.");
      getUserToken();
      monitorUserToken();
    } else {
      onPermissionDenied();
    }
  });
};

// Monitor token refresh
const monitorUserToken = () => {
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        console.log("Token refreshed.");
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
      })
      .catch(err => {
        console.log("Unable to retrieve refreshed token ", err);
      });
  });
};

// Get Firebase User's device token
const getUserToken = () => {
  if (!window.location.href.includes("127.0.0.1")) {
    messaging
      .getToken()
      .then(currentToken => {
        if (currentToken) {
          sendTokenToServer(currentToken);
        } else {
          // Show permission request.
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
        console.log("Error retrieving Instance ID token. ", err);
        //   setTokenSentToServer(false);
      });
  } else {
    console.log("Cannot run firebase notification on localhost");
  }
};

// Send device token to server
const sendTokenToServer = token => {
  //   showNotification(token);
  try {
    if (auth.currentUser && auth.currentUser.email != "super@ghanapost.com") {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          token
        })
        .then(() => {
          console.log(`token updated successfully @ : ${new Date()}`);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("Cannot upload token because user is not yet signed in");
    }
  } catch (error) {
    console.log(error);
  }
};

// Callbacks
function doNotification(message) {
  var myNotification = new Notify("GhanaPost", {
    body: message,
    tag: new Date().getTime().toString(),
    closeOnClick: true,
    notifyShow: onShowNotification,
    notifyClose: onCloseNotification,
    notifyClick: onClickNotification,
    notifyError: onErrorNotification,
    timeout: 4
  });

  myNotification.show();
}
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
function onPermissionDenied() {
  console.warn("Permission has been denied by the user");
}
