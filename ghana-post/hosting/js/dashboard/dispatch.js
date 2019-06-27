$(document).ready(function() {
  togglePageLoader(false);
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles,"dispatch.html");
  
});
