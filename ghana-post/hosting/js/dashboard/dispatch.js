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
});

// Reset all fields
const resetFields = () => {
  $("#sending_region").val("");
  $("#sending_office").val("");
  $("#receiving_region").val("");
  $("#receiving_office").val("");
};

// Submit item
const submitItem = () => {
  var sendingRegion = $("#sending_region");
  var sendingOffice = $("#sending_office");
  var receivingRegion = $("#receiving_region");
  var receivingOffice = $("#receiving_office");
  var standardDays = $("#standard_days");
  var itemType = $("#item_type");
  var comment = $("#comment");

  if (isInValid(sendingRegion.val())) {
    alert("Please enter the right sending region...");
  } else if (isInValid(sendingOffice.val())) {
    alert("Please enter the right sending office...");
  } else if (isInValid(receivingRegion.val())) {
    alert("Please enter the right receiving region...");
  } else if (isInValid(receivingOffice.val())) {
    alert("Please enter the right receiving office...");
  } else {
    togglePageLoader(true);
    var code = "1234";
    var date = new Date();
    var doc = db.collection("items").doc();

    // Set data fields
    doc
      .set({
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
        zone: 1,
        type: itemType.val(),
        comment: comment.val(),
        date
      })
      .then(() => {
        togglePageLoader(false);
        showNotification("Item sent successfully");
      })
      .catch(err => {
        togglePageLoader(false);
        showNotification(err.message);
        return console.log(err.message);
      });
  }
};

// Valid input
const isInValid = value => {
  return validator.isEmpty(value);
};

// Load form
const loadForm = () => {
  // Disable loading
  togglePageLoader(false);
};
