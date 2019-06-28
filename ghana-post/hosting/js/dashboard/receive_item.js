// Global variables for region & office
var region = "",
  office = "",
  zone = 0;

$(document).ready(function() {
  //   Set page title
  setPageName("Receive Mail Item");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "receive.html");
  setTimeout(() => {
    loadUserInfo();
    loadForm();
  }, 1200);
});

const loadForm = () => {
  db.collection("users")
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        // Get user's data
        var user = doc.data();

        // Set globals
        office = user.office;
        region = user.region;
        zone = user.zone;

        // Set fields
        $("#sending_region").val(user.region);
        $("#sending_office").val(user.office);
        $("#sender_zone").val(user.zone);
        $("#item_code_start").val(
          user.region.substr(0, 1).toUpperCase() +
            user.region
              .substr(user.region.indexOf(" ") + 1)
              .substr(0, 1)
              .toUpperCase() +
            "-"
        );
        $("#item_code_end").val("-" + new Date().getFullYear());
        // computeStandardDays(id);
        // Disable loading
        togglePageLoader(false);
      } else {
        showNotification("You are not registered properly on this system");
        window.location.href = "dashboard.html";
      }
    });
};

// Receive items
const receiveItem = () => {
  var actualCode = $("#item_code_actual");

  if (validator.isEmpty(actualCode.val())) {
    alert("Please enter the code of the item you wish to receive");
  } else {
    var code =
      $("#item_code_start").val() +
      actualCode.val() +
      $("#item_code_end").val();

    togglePageLoader(true);

    // Get items collection reference
    var itemsRef = db.collection("items");

    //   Trigger query
    itemsRef
      .where("code", "==", code)
      .get()
      .then(snapshots => {
        // Get date
        var date = new Date();
        if (snapshots && snapshots.docs.length > 0) {
          snapshots.forEach(doc => {
            togglePageLoader(false);

            //   Update item
            itemsRef
              .doc(doc.id)
              .update({
                time_received: date.getTime(),
                received: true
              })
              .then(() => {
                togglePageLoader(false);
                showNotification("Item received successfully");
                window.location.href = "dashboard.html";
              })
              .catch(err => {
                togglePageLoader(false);
                showNotification(err.message);
              });
            return console.log(doc.data().key);
          });
        } else {
          togglePageLoader(false);
          showNotification("Could not find item");
          return console.log("Item was not found");
        }
      })
      .catch(err => {
        togglePageLoader(false);
        showNotification(err.message);
      });
  }
};
