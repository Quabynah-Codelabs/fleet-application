$(document).ready(function() {
  // Load Firebase SDK

  // Remove this function once application is connected to the right data source
  updateWithDummy();
});

// Generate printable report for transactions
const generateReport = () => {
  alert("Not available");
};

// Variables
// Failed
var failedItemsCount = $("#failed_item_count");
var failedItemsPercentage = $("#failed_item_percentage");
var failedItemsProgress = $("#failed_item_progress");
// Successful
var successfulItemsCount = $("#successful_item_count");
var successfulItemsPercentage = $("#successful_item_percentage");
var successfulItemsProgress = $("#successful_item_progress");
// Inbounds
var inboundsAmt = $("#inbounds_amount");
// Outbounds
var outboundsAmt = $("#outbounds_amount");

// Dummy data for the UI
const updateWithDummy = () => {
  failedItemsCount.text("223");
  failedItemsPercentage.text("24%");
  failedItemsProgress.css("width", "24%");

  successfulItemsCount.text("23423");
  successfulItemsPercentage.text("76%");
  successfulItemsProgress.css("width", "76%");

  outboundsAmt.text("234556");
  inboundsAmt.text("328474")
};
