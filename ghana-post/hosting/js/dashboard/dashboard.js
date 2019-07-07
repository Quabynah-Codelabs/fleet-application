$(document).ready(function() {
  // Remove this function once application is connected to the right data source
  setTimeout(() => {
    updateUserRoles();
  }, 2000);
});

const addFilterListener = () => {
  var filters = $("#filters");
  $(document).on("click", "a[data-href].dropdown-item", function() {
    $("#monthly").removeClass("active");
    $("#quarterly").removeClass("active");
    $("#weekly").removeClass("active");

    $(`${this.dataset.href}`).addClass("active");
    loadData(this.id);
  });
};

// Load data by duration
const loadData = duration => {
  console.log(duration);

  switch (duration) {
    case "monthly":
      break;
    case "weekly":
      break;
    case "quarterly":
      break;
    default:
      break;
  }
};

// Generate printable report for transactions
const generateReport = () => {
  showNotification("Not available");
};

// Update sidebar
const updateUserRoles = () => {
  if (auth.currentUser) {
    if (email == "super@ghanapost.com") {
      console.log("Super user account detected");
      loadRolesByLevel("super");
    } else {
      console.log("Admin account detected");
      loadRolesByLevel("admin");
    }
  } else {
    showNotification("You are not logged in yet");
  }
};

// Load user roles by level
const loadRolesByLevel = level => {
  switch (level) {
    case "super":
      console.log("Super admin roles being updated...");
      buildSidebarWithRoles(superAdminRoles, "");
      addListenersForStats(null);
      $("#username").text("Super Admin");
      $("#user_avatar").attr("src", "./img/default.svg");
      break;
    case "admin":
      console.log("Basic admin roles being updated...");
      db.collection("users")
        .doc(uid)
        .onSnapshot(function(doc) {
          var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          console.log(`Data source from: ${source}`);

          // Check data validity
          if (doc.exists) {
            // Get data
            var data = doc.data();
            // Set username
            $("#username").text(
              data.first_name
                ? `${data.first_name} ${data.last_name}`
                : data.email
            );
            // Set avatar
            $("#user_avatar").attr(
              "src",
              `${data.avatar ? data.avatar : "./img/default.svg"}`
            );
            // Build sidebar
            buildSidebarWithRoles(data.roles, "");
            addListenersForStats(data.office);
          } else {
            // Sign out user
            showNotification("Cannot get your records. Please sign in again");
            window.location.href = "index.html";
          }
        });
      break;
    default:
      break;
  }
};

// Get stats
const addListenersForStats = office => {
  // Get stats collection
  var stats = db.collection("stats");

  if (!office) {
    // Late
    stats
      // .where("sending_office", "==", office)
      .where("type", "==", "late")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#late_count").text(records.length);
        $("#late_progress").css("width", percentage);
      });

    // Inbounds
    stats
      // .where("receiving_office", "==", office)
      .where("type", "==", "inbounds")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#inbounds_count").text(records.length);
        $("#inbounds_progress").css("width", percentage);
      });

    // Outbounds
    stats
      // .where("sending_office", "==", office)
      .where("type", "==", "outbounds")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#outbounds_count").text(records.length);
        $("#outbounds_progress").css("width", percentage);
      });

    // OnTime
    stats
      // .where("sending_office", "==", office)
      .where("type", "==", "ontime")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#ontime_count").text(records.length);
        $("#ontime_progress").css("width", percentage);
      });
  } else {
    // Late
    stats
      .where("sending_office", "==", office)
      .where("type", "==", "late")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#late_count").text(records.length);
        $("#late_progress").css("width", percentage);
      });

    // Inbounds
    stats
      .where("receiving_office", "==", office)
      .where("type", "==", "inbounds")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#inbounds_count").text(records.length);
        $("#inbounds_progress").css("width", percentage);
      });

    // Outbounds
    stats
      .where("sending_office", "==", office)
      .where("type", "==", "outbounds")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#outbounds_count").text(records.length);
        $("#outbounds_progress").css("width", percentage);
      });

    // OnTime
    stats
      .where("sending_office", "==", office)
      .where("type", "==", "ontime")
      .onSnapshot(function(querySnapshot) {
        var records = [];
        querySnapshot.forEach(function(doc) {
          records.push(doc.data().key);
        });

        // Add to page
        var percentage = records.length;
        $("#ontime_count").text(records.length);
        $("#ontime_progress").css("width", percentage);
      });
  }

  // Starts showing stats
  initCharts();
};

// Initialize statistics
const initCharts = () => {
  // Set new default font family and font color to mimic Bootstrap's default styling
  (Chart.defaults.global.defaultFontFamily = "Nunito"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = "#858796";

  function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + "").replace(",", "").replace(" ", "");
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
      dec = typeof dec_point === "undefined" ? "." : dec_point,
      s = "",
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return "" + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  }
  var ctx = $("#items_overview_chart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      datasets: [
        {
          label: "Items",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: [0, 100, 500, 1000, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [
          {
            time: {
              unit: "date"
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return number_format(value);
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }
        ]
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ":" + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
};
