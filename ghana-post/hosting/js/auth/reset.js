$(document).ready(function() {
  // Load Firebase SDK
});

//   Reset user's password
const resetPassword = () => {
  var email = $("#auth_email");

  if (!validator.isEmail(email.val())) {
    alert("Please enter a valid email address");
  } else {
    // Send password reset link
    loading.css("display", "block");
    // window.location.href = "index.html";
  }
};
