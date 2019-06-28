$(document).ready(function() {
  togglePageLoader(false);

  setTimeout(() => {
    var modal = $("#login_modal");
    if (auth.currentUser) {
      $("#auth_email_address").text(auth.currentUser.email);
      modal.modal("show");
    }
  }, 2000);
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

    showLoading(true);
    // Create user account
    auth
      .signInWithEmailAndPassword(email.val(), password.val())
      .then(result => {
        var user = result.user;
        // getUser(user);
        showLoading(false);
        showNotification("User signed in successfully");
        // Navigate to dashboard
        window.location.href = "dashboard.html";
      })
      .catch(err => {
        console.log(err.message);
        showLoading(false);
        showNotification(err.message);
      });
  }
};

const requestAuth = () => {};
