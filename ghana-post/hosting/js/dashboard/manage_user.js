$(document).ready(function() {
  //   Set page title
  setPageName("Manage Users");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "manage_user.html");

  // load data onto page after a delay.
  // This is done to resolve the issue of having to load the page before loading the content
  setTimeout(() => {
    loadUserInfo();
  }, 1200);
});

const addNewUser = () => {
  // TODO: VALIDATE ALL FIELDS
  // TODO: GET USER OBJECT AND CREATE NEW USER WITH DEFAULT PASSWORD
};
