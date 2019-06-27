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
      showLoading(true);
      // Create user account
      auth
        .createUserWithEmailAndPassword(email.val(), password.val())
        .then(result => {
          var user = result.user;
          storeUser(user, fName.val(), lName.val());
        })
        .catch(err => {
          console.log(err.message);
          showLoading(false);
          showNotification(err.message);
        });
    }
  }
};

// Store user information in the database
const storeUser = (user, fName, lName) => {
  db.collection("users")
    .doc(user.uid)
    .set({
      username: user.displayName,
      email: user.email,
      avatar: user.photoURL,
      first_name: fName,
      last_name: lName,
      created_at: new Date().getTime(),
      roles: defaultRoles,
      token: "",
      uid: user.uid
    })
    .then(() => {
      showLoading(false);
      showNotification("User created successfully");
      // Navigate to dashboard
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      console.log(err.message);
      showLoading(false);
      showNotification(err.message);
    });
};
