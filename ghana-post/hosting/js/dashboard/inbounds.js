$(document).ready(function() {
  //   Set page title
  setPageName("Inbounds");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "inbounds.html");

  // Hide table until content has been loaded completely
  toggleTableState(false);

  // load data onto page after a delay.
  // This is done to resolve the issue of having to load the page before loading the content
  setTimeout(() => {
    loadUserInfo();
    loadTable();
  }, 1200);
});

const toggleTableState = state => {
  if (state) {
    $("#main_table").show();
    $("#empty_container").hide();
  } else {
    $("#main_table").hide();
    $("#empty_container").show();
  }
};

const loadTable = () => {
  // Load table information here
  var tableBody = $("data_table_body");

  // TODO: retrieve details for the current office only
  db.collection("items")
    // .where("receiving_office", "==", "")
    .get()
    .then(snapshots => {
      $("#dataTable").DataTable();
      if (snapshots.empty) {
        toggleTableState(true);
        showNotification("No mail items found. Please try again later");
      } else {
        tableBody.empty();

        snapshots.docs.forEach(doc => {
          var mailItem = doc.data();
          console.log(mailItem);
          
          tableBody.append(`
          <tr data-href="${doc.id}" style="cursor: pointer;">
            <td>${mailItem.key}</td>
            <td>${mailItem.type.toUpperCase()}</td>
            <td>${mailItem.sending_office}</td>
            <td>${mailItem.sending_region}</td>
            <td>${mailItem.date}</td>
            <td></td>
          </tr>
        `);
        });

        // Handle click events
        $(document).on("click", "tr[data-href]", function() {
          console.log("Showing details for: ", this.dataset.href);
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      showNotification(err.message);
    });
};
