$(document).ready(function() {
  //   Set page title
  setPageName("Inbounds");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "inbounds.html");
  setTimeout(() => {
    loadUserInfo();
    loadTable();
  }, 1200);
});

const loadTable = () => {

};
