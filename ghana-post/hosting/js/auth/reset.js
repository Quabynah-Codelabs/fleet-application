$(document).ready(function() {
  togglePageLoader(false);
});

//   Reset user's password
const resetPassword = () => {
  var email = $("#auth_email");

  if (!validator.isEmail(email.val())) {
    alert("Please enter a valid email address");
  } else {
    // Send password reset link
    showLoading(true);
    auth
      .sendPasswordResetEmail(email.val())
      .then(() => {
        showLoading(false);
        showNotification(`Email sent to ${email.val()} successfully`);
        email.val("");
      })
      .catch(err => {
        showLoading(false);
        showNotification(err.message);
      });

    // window.location.href = "index.html";
  }
};
