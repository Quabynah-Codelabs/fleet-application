$(document).ready(function() {
  // Load Firebase SDK
});

const loginUser = () => {
  var email = $("#auth_email");
  var password = $("#auth_password");
  var checkBox = $("#auth_checkbox");

  if (!validator.isEmail(email.val())) {
    alert("Please enter a valid email address");
  } else if (validator.isEmpty(password.val())) {
    alert("Please enter a valid password");
  } else {
    // Save user's login credentials
    var saveState = checkBox.checked;

    if (saveState) {
      window.localStorage.setItem("gp_user_email", email.val());
      window.localStorage.setItem("gp_user_pwd", password.val());
    }

    window.location.href = "dashboard.html";
  }
};