var office, region;

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
    loadRegionalDetails();
  }, 1200);
});

const loadRegionalDetails = () => {
  if (auth.currentUser && auth.currentUser.email == "super@ghanapost.com") {
    office = "all";
    region = "all";
    loadTable();
  } else {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then(userInfo => {
        console.log(userInfo);

        if (userInfo.exists) {
          office = userInfo.data().office;
          region = userInfo.data().region;
          loadTable();
        } else {
          showNotification("Unable to load data");
        }
      })
      .catch(err => {
        console.log(err.message);
        showNotification(err.message);
      });
  }
};

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
  var tableBody = $("#data_table_body");

  // TODO: retrieve details for the current office only
  db.collection("items")
    // .where("sending_office", "==", "")
    .get()
    .then(snapshots => {
      if (snapshots.empty) {
        toggleTableState(true);
        showNotification("No mail items found. Please try again later");
      } else {
        toggleTableState(true);
        tableBody.empty();

        snapshots.forEach(doc => {
          var mailItem = doc.data();
          tableBody.append(`
          <tr data-href="${doc.id}" style="cursor: pointer;">
            <td>${mailItem.key}</td>
            <td>${mailItem.type.toUpperCase()}</td>
            <td>${mailItem.sending_office}</td>
            <td>${mailItem.sending_region}</td>
            <td>${new Date(mailItem.time_sent).toDateString()}</td>
          </tr>
        `);
        });

        $("#dataTable").DataTable();

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
