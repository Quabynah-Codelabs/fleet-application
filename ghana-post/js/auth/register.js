$(document).ready(function() {
  // Load Firebase SDK
});

const registerAccount = () => {
  var email = $("#auth_email");
  var fName = $("#auth_first_name");
  var lName = $("#auth_last_name");
  var password = $("#auth_password");
  var confirmPassword = $("#auth_confirm_password");

  //   Validate Form
  if (!validator.isEmail(email.val())) {
    alert("Please enter a valid email address");
  } else if (validator.isEmpty(password.val())) {
    alert("Please enter a valid password");
  } else if (validator.isEmpty(confirmPassword.val())) {
    alert("Please enter a valid password");
  } else if (validator.isEmpty(fName.val())) {
    alert("Please enter your first name");
  } else if (validator.isEmpty(lName.val())) {
    alert("Please enter your first name");
  } else {
    // Compare passwords
    var hasValidPassword = password.val() == confirmPassword.val();

    // Check passwords
    if (!hasValidPassword) {
      alert("Your passwords do not match");
    } else {
      // Create user account
      window.location.href = "dashboard.html";
    }
  }
};
