$(document).ready(function() {
  // Remove this function once application is connected to the right data source
  setTimeout(() => {
    updateUserRoles();
  }, 2000);
});

const addFilterListener = () => {
  var filters = $("#filters");
  $(document).on("click", "a[data-href].dropdown-item", function() {
    $("#monthly").removeClass("active");
    $("#quarterly").removeClass("active");
    $("#weekly").removeClass("active");

    $(`${this.dataset.href}`).addClass("active");
    loadData(this.id);
  });
};

// Load data by duration
const loadData = duration => {
  console.log(duration);

  switch (duration) {
    case "monthly":
      break;
    case "weekly":
      break;
    case "quarterly":
      break;
    default:
      break;
  }
};

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
      buildSidebarWithRoles(superAdminRoles, "");
      $("#username").text("Super Admin");
      $("#user_avatar").attr("src", "./img/default.svg");
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
            buildSidebarWithRoles(data.roles, "");
            addListenersForStats(data.office);
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

const addListenersForStats = office => {
  // Get stats collection
  var stats = db.collection("stats");

  // Late
  stats
    .where("sending_office", "==", office)
    .where("type", "==", "late")
    .onSnapshot(function(querySnapshot) {
      var records = [];
      querySnapshot.forEach(function(doc) {
        records.push(doc.data().key);
      });

      // Add to page
      var percentage = records.length;
      $("#late_count").text(records.length);
      $("#late_progress").css("width", percentage);
    });

  // Inbounds
  stats
    .where("receiving_office", "==", office)
    .where("type", "==", "inbounds")
    .onSnapshot(function(querySnapshot) {
      var records = [];
      querySnapshot.forEach(function(doc) {
        records.push(doc.data().key);
      });

      // Add to page
      var percentage = records.length;
      $("#inbounds_count").text(records.length);
      $("#inbounds_progress").css("width", percentage);
    });

  // Outbounds
  stats
    .where("sending_office", "==", office)
    .where("type", "==", "outbounds")
    .onSnapshot(function(querySnapshot) {
      var records = [];
      querySnapshot.forEach(function(doc) {
        records.push(doc.data().key);
      });

      // Add to page
      var percentage = records.length;
      $("#outbounds_count").text(records.length);
      $("#outbounds_progress").css("width", percentage);
    });

  // OnTime
  stats
    .where("sending_office", "==", office)
    .where("type", "==", "ontime")
    .onSnapshot(function(querySnapshot) {
      var records = [];
      querySnapshot.forEach(function(doc) {
        records.push(doc.data().key);
      });

      // Add to page
      var percentage = records.length;
      $("#ontime_count").text(records.length);
      $("#ontime_progress").css("width", percentage);
    });
};
