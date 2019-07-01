$(document).ready(function() {
  //   Set page title
  setPageName("Outbounds");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "outbounds.html");
  setTimeout(() => {
    loadUserInfo();
    loadTable();
  }, 1200);
});

const loadTable = () => {};
