$(document).ready(function() {
  // Remove this function once application is connected to the right data source
  setTimeout(() => {
    updateWithDummy();
    updateUserRoles();
  }, 2000);
});

// Generate printable report for transactions
const generateReport = () => {
  showNotification("Not available");
};

// Update sidebar
const updateUserRoles = () => {
  if (auth.currentUser) {
    if (email == "super@ghanapost.com") {
      console.log("Super user account detected");
      loadRolesByLevel("super");
    } else {
      console.log("Admin account detected");
      loadRolesByLevel("admin");
    }
  } else {
    showNotification("You are not logged in yet");
  }
};

// Load user roles by level
const loadRolesByLevel = level => {
  switch (level) {
    case "super":
      console.log("Super admin roles being updated...");
      buildSidebarWithRoles(superAdminRoles,"");
      break;
    case "admin":
      console.log("Basic admin roles being updated...");
      db.collection("users")
        .doc(uid)
        .onSnapshot(function(doc) {
          var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          console.log(`Data source from: ${source}`);

          // Check data validity
          if (doc.exists) {
            // Get data
            var data = doc.data();
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
            // Build sidebar
            buildSidebarWithRoles(data.roles,"");
          } else {
            // Sign out user
            showNotification("Cannot get your records. Please sign in again");
            window.location.href = "index.html";
          }
        });
      break;
    default:
      break;
  }
};


// Variables
// Failed
var failedItemsCount = $("#failed_item_count");
var failedItemsPercentage = $("#failed_item_percentage");
var failedItemsProgress = $("#failed_item_progress");
// Successful
var successfulItemsCount = $("#successful_item_count");
var successfulItemsPercentage = $("#successful_item_percentage");
var successfulItemsProgress = $("#successful_item_progress");
// Inbounds
var inboundsAmt = $("#inbounds_amount");
// Outbounds
var outboundsAmt = $("#outbounds_amount");

// Dummy data for the UI
const updateWithDummy = () => {
  failedItemsCount.text("223");
  failedItemsPercentage.text("24%");
  failedItemsProgress.css("width", "24%");

  successfulItemsCount.text("23423");
  successfulItemsPercentage.text("76%");
  successfulItemsProgress.css("width", "76%");

  outboundsAmt.text("234556");
  inboundsAmt.text("328474");
};


