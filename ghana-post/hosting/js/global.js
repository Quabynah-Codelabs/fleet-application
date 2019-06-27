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
var auth = firebase.auth();
var db = firebase.firestore();
var bucket = firebase.storage().reference;
var messaging = firebase.messaging();

// Roles
var defaultRoles = [
  "can_manage_records",
  "can_create_items",
  "can_update_profile",
  "can_view_profile",
  "can_view_stats",
  "receive_item",
  "has_regional_office"
];
var allRoles = defaultRoles.concat(["can_create_user", "can_delete_user"]);
var superAdminRoles = [
  "can_manage_records",
  "can_update_profile",
  "can_view_profile",
  "can_view_stats",
  "can_create_user",
  "can_delete_user"
];

// Page loader
var loader = `<div id="overlay" class="spinner-container">
                  <div class="spinner"></div>
                  <div class="spinner-desc container text-center">
                    <h4 class="spinner-content text-dark">Making a request...</h4>
                    <p class="lead text-muted">This will only take a moment</p>
                  </div>
                </div>`;
var togglePageLoader = state => {
  if (state) {
    var body = $(document.body);
    body.append(loader);
  } else {
    console.log("Removing loader");
    $("#overlay").remove();
  }
};

// Global
var loading;

// User details
var username, email, photoUrl, uid, emailVerified;

// Create Firebase Initialization
$(document).ready(function() {
  // Page loader
  togglePageLoader(true);

  // Firebase initialization test
  console.log(`Firebase SDK initialized as: ${firebase.app().name}`);

  //   Messaging initialization
  initMessaging();

  // Auth listener
  initAuth();

  //   Init globals
  loading = $("#loading");
  if (loading) showLoading(false);
});

// Toggle loading state
var showLoading = state => {
  if (state) {
    loading.css("display", "block");
  } else {
    loading.css("display", "none");
  }
};

// Show notification
var showNotification = message => {
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

// Authentication
var initAuth = () => {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(`Signed in as ${user.email}`);
      username = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;

      // Get provider details
      user.providerData.forEach(function(profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    } else {
      // No user is signed in.
      console.log(window.location.pathname);
      // if (window.location.pathname != "/hosting/index.html") {
      //   // Navigate to login screen
      //   window.location.href = "index.html";
      // } else if (window.location.pathname != "/") {
      //   // Navigate to login screen
      //   // window.location.href = "index.html";
      //   console.log('runnin');

      // }
    }
  });
};

// Update user
var updateUser = (newName, newAvatar) => {
  var user = auth.currentUser;
  showLoading(true);
  user
    .updateProfile({
      displayName: newName,
      photoURL: newAvatar != null ? newAvatar : user.photoURL.toString()
    })
    .then(function() {
      // Update successful.
      console.log("Update was successful");
      showLoading(false);
      showNotification("User profile updated successfully");
    })
    .catch(function(error) {
      // An error happened.
      console.log("Error updating user", error);
      showLoading(false);
      showNotification(error.message);
    });
};

// Logout
var logout = () => {
  if (auth.currentUser) {
    auth
      .signOut()
      .then(() => {
        window.location.href = "index.html";
      })
      .catch(err => {
        console.log(err.message);
        showNotification(err.message);
      });
  } else {
    showNotification("You are not logged in");
    window.location.href = "index.html";
  }
};

// Verify email address
var verifyEmail = () => {
  var user = auth.currentUser;
  showLoading(true);
  user
    .sendEmailVerification()
    .then(function() {
      // Email sent.
      showNotification("Verification sent");
      showLoading(false);
    })
    .catch(function(error) {
      // An error happened.
      console.log(error);
      showNotification(error.message);
      showLoading(false);
    });
};

// Delete a user
var deleteUser = () => {
  var user = auth.currentUser;
  showLoading(true);
  user
    .delete()
    .then(function() {
      // User deleted.
      showNotification("User deleted successfully");
      showLoading(false);
    })
    .catch(function(error) {
      // An error happened.
      console.log(error);
      showNotification(error.message);
      showLoading(false);
    });
};

// Init Firebase Messaging Service
var initMessaging = () => {
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
var monitorUserToken = () => {
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
var getUserToken = () => {
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
var sendTokenToServer = token => {
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
  window.onload = function() {
    try {
      var context = new AudioContext();
      context.resume().then(() => {
        console.log("Playback resumed successfully");
        var buzz = $buzz("./audio/notification.mp3");
        buzz.play();
        buzz.fade(0, 3);
      });
    } catch (error) {
      console.log(error);
    }
  };
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

// Build sidebar
var buildSidebarWithRoles = (roles, activePath) => {
  togglePageLoader(false);
  // console.log(`Roles for user: ${roles}`);
  roles.forEach(roleItem => {
    switch (roleItem) {
      case "can_view_stats":
        $("#dynamic_content").append(`
        <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
        <i class="material-icons">
        drafts
        </i>
          <span>Items</span>
        </a>
        <div
          id="collapseTwo"
          class="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Select Item Category</h6>
            <a class="collapse-item" href="#inbounds" data-href="inbounds.html">Inbounds</a>
            <a class="collapse-item" href="#outbounds" data-href="outbounds.html">Outbounds</a>
          </div>
        </div>
      </li>
        `);
        break;
      case "can_create_items":
        $("#dynamic_content").append(`
          <li class="nav-item">
          <a class="nav-link collapsed" href="dispatch.html" data-href="dispatch.html">
          <i class="material-icons">
          unarchive
          </i>
            <span>Dispatch Item</span>
          </a>
        </li>
          `);
        break;
      case "receive_item":
        $("#dynamic_content").append(`
          <li class="nav-item">
          <a class="nav-link collapsed" href="#upload" data-href="receive_item.html">
          <i class="material-icons">
          move_to_inbox
          </i>
            <span>Receive Item</span>
          </a>
        </li>
          `);
        break;
      case "can_update_profile" || "can_view_profile":
        $("#dynamic_content").append(`
        <li class="nav-item">
        <a class="nav-link collapsed" href="#upload" data-href="user.html">
        <i class="material-icons">perm_identity</i>
          <span>My Profile</span>
        </a>
      </li>
        `);
        break;
      case "has_regional_office":
        $("#dynamic_content").append(`
        <li class="nav-item">
        <a class="nav-link collapsed" href="#upload" data-href="office.html">
        <i class="material-icons">home</i>
          <span>Regional Office</span>
        </a>
      </li>
        `);
        break;
      case "can_create_user" || "can_delete_user":
        $("#dynamic_content").append(`
        <li class="nav-item">
        <a class="nav-link collapsed" href="#upload" data-href="manage_user.html">
        <i class="material-icons">group</i>
          <span>Manage Users</span>
        </a>
      </li>
        `);
        break;
      default:
        break;
    }
  });

  $(document).on("click", "a[data-href]", function(ev) {
    ev.preventDefault();
    setupRouteWithData(this.dataset.href, roles);
  });
};

// Setup route with data to reduce page load time
var setupRouteWithData = (route, roles) => {
  window.localStorage.setItem("roles", roles);
  window.location.href = route;
};

var currentUser = {};
// Load current user's info
var loadUserInfo = () => {
  if (auth.currentUser) {
    if (email == "super@ghanapost.com") {
      $("#username").text("Super Admin");
      $("#user_avatar").attr("src", "./img/default.svg");
    } else {
      db.collection("users")
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            var data = doc.data();
            currentUser = data;
            // Set username
            $("#username").text(
              data.first_name
                ? `${data.first_name} ${data.last_name}`
                : data.email
            );
            // Set avatar
            $("#user_avatar").attr(
              "src",
              `${data.avatar ? data.avatar : "./img/default.svg"}`
            );
          } else {
            console.log("User data could not be found");
          }
        });
    }
  } else {
    console.log("Cannot find current user");
  }
};

// Set the name of the page
var setPageName = pageName => {
  $("#page_title").text(pageName);
};
