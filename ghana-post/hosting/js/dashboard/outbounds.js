$(document).ready(function() {
  //   Set page title
  setPageName("Outbounds");

  //   Get roles & build sidebar
  var roles = window.localStorage
    .getItem("roles")
    .toString()
    .split(",");
  buildSidebarWithRoles(roles, "outbounds.html");

  // Hide table until content has been loaded completely
  toggleTableState(false);

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
  $("#dataTable").DataTable();
  var tableBody = $("data_table_body");

  // TODO: retrieve details for the current office only
  db.collection("items")
    // .where("sending_office", "==", "")
    .get()
    .then(snapshots => {
      if (snapshots.empty) {
        // toggleTableState(false);
        showNotification("No mail items found. Please try again later");
      } else {
        console.log(snapshots);
        tableBody.empty();

        snapshots.forEach(doc => {
          var mailItem = doc.data();
          tableBody.append(`
          <tr data-href="${doc.id}">
            <td>${mailItem.key}</td>
            <td>${mailItem.type.toUpperCase()}</td>
            <td>${mailItem.receiving_office}</td>
            <td>${mailItem.receiving_region}</td>
            <td>${mailItem.date}</td>
            <td></td>
          </tr>
        `);
        });

        // Handle click events
        $(document).on("click", "tr[data-href]", function() {
          console.log("Showing details for: ", this.dataset.href);
          // TODO: show details of the current mail item
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      showNotification(err.message);
    });
};
