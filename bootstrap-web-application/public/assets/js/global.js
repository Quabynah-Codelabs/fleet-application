// Firebase
let auth = firebase.auth()
let db = firebase.firestore()

$(document).ready(() => {
    toggleLoading(false)
});

// Login with email and password
const login = () => {
    var emailField = $('#email-login')
    var passwordField = $('#password-login')

    var isValid = !validator.isEmpty(emailField.val()) && !validator.isEmpty(passwordField.val())
    if (isValid) {
        if (validator.isEmail(emailField.val())) {
            // Sign in with email and password
            auth.signInWithEmailAndPassword(emailField.val(), passwordField.val())
                .then(() => {
                    // Remove loading toggle
                    toggleLoading(false)
                    // Navigate to the dashboard
                    window.location.href = "dashboard.html"
                }).catch((err) => {
                    // Remove loading toggle
                    toggleLoading(false)
                    alert(err.message)
                });

        } else {
            alert("Please enter a valid email address...")
        }
    } else {
        alert("Please enter your email and password...")
    }
};

// Create user with email & password
const register = () => {
    var emailField = $('#email-register')
    var passwordField = $('#password-register')
    var nameField = $('#full-name-register')
    var officeField = $('#sending-office-register')
    var regionField = $('#sending-reg-register')

    var isValid = !validator.isEmpty(emailField.val()) && !validator.isEmpty(passwordField.val())
    if (isValid) {
        if (validator.isEmail(emailField.val())) {
            if (validator.isEmpty(nameField.val()) || validator.isEmpty(officeField.val()) || validator.isEmpty(regionField.val())) {
                alert("Please fill all fields in this form before you proceed...")
                return
            } else {
                // Create user with email address and password
                auth.createUserWithEmailAndPassword(emailField.val(), passwordField.val())
                    .then(() => {
                        console.log("User created... Almost done!");

                        // Push user's data to the database
                        db.collection('fleet-admin').doc(auth.currentUser.uid)
                            .set({
                                key: `${auth.currentUser.uid}`,
                                name: nameField.val(),
                                email: emailField.val(),
                                sending_office: regionField.val(),
                                sending_region: officeField.val(),
                                photoUrl: `${auth.currentUser.photoUrl}`,
                                token: null,
                                timestamp: `${new Date().getTime()}`,
                                role: 'admin'
                            }).then(() => {
                                // Remove loading toggle
                                toggleLoading(false)
                                // Navigate to the dashboard
                                window.location.href = "dashboard.html"
                            }).catch((err) => {
                                // Remove loading toggle
                                toggleLoading(false)
                                alert(err.message)
                            })

                    }).catch((err) => {
                        // Remove loading toggle
                        toggleLoading(false)
                        alert(err.message)
                    });
            }
        } else {
            alert("Please enter a valid email address...")
        }
    } else {
        alert("Please enter your email and password...")
    }
};

// Create new user account


// Reset password
const resetPassword = () => {
    var emailField = $('#email-reset')

    if (validator.isEmpty(emailField.val()) || !validator.isEmail(emailField.val())) {
        alert("Please enter a valid email address...")
        return
    }

    toggleLoading(true)
    auth.sendPasswordResetEmail(emailField.val()).then(() => {
        toggleLoading(false)
        alert("Please check your email account for the reset link...")
    }).catch((err) => {
        toggleLoading(false)
        alert(err.message)
    });

};

// Show loading screen
const toggleLoading = (state) => {
    document.getElementById('overlay').style.display = state ? "block" : "none"
}