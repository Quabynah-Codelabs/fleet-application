// Global variables for region & office
var region = "",
  office = "",
  zone = 0;

$(document).ready(function() {
  //   Set page title
  setPageName("Mail Items");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "dispatch.html");
  setTimeout(() => {
    loadUserInfo();
    loadForm();
  }, 1200);

  // Listen for changes in the receiving region
  $(document).on("change", "select[data-href]#receiving_region", function(ev) {
    ev.preventDefault();
    computeStandardDays();
    computeItemCode();
  });
  $(document).on("change", "select[data-href]#receiving_office", function(ev) {
    ev.preventDefault();
    computeItemCode();
  });
});

const computeItemCode = () => {
  var rOffice = $("#receiving_office").val();
  var sOffice = $("#sending_office").val();
  var rRegion = $("#receiving_region").val();
  var code =
    sOffice.substr(0, 3).toUpperCase() +
    "-" +
    rRegion.substr(0, 1).toUpperCase() +
    rRegion
      .substr(rRegion.indexOf(" ") + 1)
      .substr(0, 1)
      .toUpperCase() +
    "-" +
    rOffice.substr(0, 3).toUpperCase();
  console.log(code);
  $("#item_code_actual").val(code);
};

// Submit item
const submitItem = () => {
  var sendingRegion = $("#sending_region");
  var sendingOffice = $("#sending_office");
  var receivingRegion = $("#receiving_region");
  var receivingOffice = $("#receiving_office");
  var standardDays = $("#standard_days");
  var itemType = $("#item_type");
  var itemCode = $("#item_code_actual");
  var comment = $("#comment");
  var zone = $("#sender_zone");

  if (isInValid(sendingRegion.val())) {
    alert("Please enter the right sending region...");
  } else if (isInValid(sendingOffice.val())) {
    alert("Please enter the right sending office...");
  } else if (isInValid(receivingRegion.val())) {
    alert("Please enter the right receiving region...");
  } else if (isInValid(receivingOffice.val())) {
    alert("Please enter the right receiving office...");
  } else if (isInValid(itemCode.val())) {
    alert("Please enter the code for the item...");
  } else {
    if (confirm("Do you wish to disptach this item now?")) {
      togglePageLoader(true);
      var code =
        $("#item_code_start").val() +
        itemCode.val() +
        $("#item_code_end").val();

      // Get date variable
      var date = new Date();

      // Create document
      var doc = db.collection("items").doc();

      // Create item
      var item = {
        code,
        sending_office: sendingOffice.val(),
        sending_region: sendingRegion.val(),
        receiving_region: receivingRegion.val(),
        receiving_office: receivingOffice.val(),
        time_sent: date.getTime(),
        received: false,
        time_received: null,
        standard_days: parseInt(standardDays.val()),
        sender_uid: uid,
        sender_name: username,
        zone: parseInt(zone.val()),
        type: itemType.val(),
        comment: comment.val().trim(),
        date,
        key: doc.id
      };

      console.log(item);

      // Set data fields
      doc
        .set(item)
        .then(() => {
          togglePageLoader(false);
          showNotification("Item sent successfully");
          $("#comment").val("");
          $("#item_code_actual").val("");
        })
        .catch(err => {
          togglePageLoader(false);
          showNotification(err.message);
          return console.log(err.message);
        });
    }
  }
};

// Valid input
const isInValid = value => {
  return validator.isEmpty(value);
};

// Load form
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
        computeItemCode();
        // Disable loading
        togglePageLoader(false);
      } else {
        showNotification("You are not registered properly on this system");
        window.location.href = "dashboard.html";
      }
    });
};

// COnpute the standard days
const computeStandardDays = () => {
  var data = $(`#receiving_region`).val();
  var standardDays = $("#standard_days");
  var zone = $("#sender_zone");

  if (region == data) {
    // Intra-Transactions
    standardDays.val(1);
    zone.val(1);
  } else {
    // Inter-Transactions
    switch (data) {
      case "Central Region":
        standardDays.val(3);
        break;
      case "Eastern Region":
        standardDays.val(2);
        break;
      case "Brong-Ahafo Region":
        standardDays.val(5);
        break;
      case "Western Region":
        standardDays.val(6);
        break;
      case "Volta Region":
        standardDays.val(7);
        break;
      case "Northern Region":
        standardDays.val(14);
        break;
      case "Ashanti Region":
        standardDays.val(9);
        break;
      case "Upper-East Region":
        standardDays.val(15);
        break;
      case "Upper-West Region":
        standardDays.val(16);
        break;
      default:
        standardDays.va(1);
        break;
    }
  }
};
