$(document).ready(function() {
  // Disable loading
  togglePageLoader(false);

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
const resetFields = () => {};

// Submit item
const submitItem = () => {
  showNotification("Hello world");
};

// Load form
const loadForm = () => {};
