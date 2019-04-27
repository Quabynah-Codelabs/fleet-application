// Firebase
let auth = firebase.auth()
let db = firebase.firestore()
let users = []
let email = ''
let sender = ''
let sending_region = ''
let sending_office = ''

$(document).ready(() => {
    toggleLoading(false)

    // Get admin's login id
    let uid = window.localStorage.getItem('user-key')

    // Load all users
    loadData().then((response) => {
        if (response && response.length != 0) {
            console.log(response);
            response.forEach(user => {
                $('#input-recipient').append(`
                    <option>${user.name}</option>
                `)
            });
        } else {
            alert('There are no registered users on this platform. Please add some users first before proceeding to sending them some items...')
        }
    }).catch((err) => {
        notify(err.message, true);
    })

    // Get admin's information from the database
    if (uid && uid != 'null') {
        // Set logout text
        $('#logout').show()
        $('#logout-text').text('Sign out')

        // Get admin info
        db.collection('fleet-admin')
            .doc(uid).get().then((response) => {
                if (response.exists) {
                    // Get data, if any
                    var data = response.data()

                    email = data.email
                    sender = data.name
                    sending_region = data.sending_region
                    sending_office = data.sending_office

                    // Populate fields with results
                    $('#input-s-region').val(sending_region)
                    $('#input-s-city').val(sending_office)
                    $('#input-sender').val(sender)
                    $('#input-email').val(email)

                    $('#current-user-email').text(email)

                    // notify(data.email, false)

                    var adminTab = $('#super-admin-tab')
                    if (data.role === 'super-admin') {
                        adminTab.show()
                    } else {
                        adminTab.hide()
                    }
                }
            }).catch((reason) => {
                notify(reason.message, true)
            })
    } else {
        // $('#logout-text').text('Login')
        $('#logout').hide()
    }
});

const navUpload = () => {
    let uid = window.localStorage.getItem('user-key')

    if (uid && uid != 'null') {
        window.location.href = "upload.html"
    } else {
        $('#modal-form').modal('show')
    }
}

const navUsers = () => {
    let uid = window.localStorage.getItem('user-key')

    if (uid && uid != 'null') {
        window.location.href = "users.html"
    } else {
        $('#modal-form').modal('show')
    }
}

// Load all users from the database
const loadData = async () => {
    // Fetch user's data from the database
    await db.collection('fleet-users').get().then((response) => {
        response.forEach(doc => {
            console.log(doc.data().email)
            users.push(doc.data())
        })
        console.log(`Users found: ${users}`)
    }).catch((reason) => {
        notify(reason.message, true)
    })
    return users;
};

// Login with email and password
const login = () => {
    var emailField = $('#email-login')
    var passwordField = $('#password-login')

    var isValid = !validator.isEmpty(emailField.val()) && !validator.isEmpty(passwordField.val())
    if (isValid) {
        if (validator.isEmail(emailField.val())) {
            toggleLoading(true)
            // Sign in with email and password
            auth.signInWithEmailAndPassword(emailField.val(), passwordField.val())
                .then((userInfo) => {
                    // Remove loading toggle
                    // toggleLoading(false)
                    // Navigate to the dashboard
                    // window.location.href = "dashboard.html"

                    db.collection('fleet-admin').doc(userInfo.user.uid)
                        .get().then(snapshot => {
                            if (snapshot.exists) {
                                window.localStorage.setItem('user-key', userInfo.user.uid)
                                // Remove loading toggle
                                toggleLoading(false)
                                // Dismiss Modal
                                $('#modal-form').modal('hide');
                                notify('Login was successful', false);
                                $('#logout').show()
                            } else {
                                toggleLoading(false);
                                notify('Sorry! You are not registered as an administrator', true);
                                $('#modal-form').modal('hide')
                            }
                        }).catch(err => {
                            toggleLoading(false);
                            notify(err.message, true);
                            $('#modal-form').modal('hide')
                        });

                    // Push user's data to the database
                    // db.collection('fleet-admin').doc(auth.currentUser.uid)
                    //     .set({
                    //         key: `${auth.currentUser.uid}`,
                    //         name: "Admin",
                    //         email: auth.currentUser.email,
                    //         sending_office: "Dansoman",
                    //         sending_region: "Greater Accra",
                    //         photoUrl: `${auth.currentUser.photoUrl}`,
                    //         token: null,
                    //         timestamp: `${new Date().getTime()}`,
                    //         role: 'admin'
                    //     }).then(() => {
                    //         // Remove loading toggle
                    //         toggleLoading(false)
                    //         // Dismiss Modal
                    //         $('#modal-form').modal('hide')
                    //     }).catch((err) => {
                    //         // Remove loading toggle
                    //         toggleLoading(false)
                    //         $('#modal-form').modal('hide')
                    //         notify(err.message, true)
                    //     })
                }).catch((err) => {
                    // Remove loading toggle
                    toggleLoading(false)
                    $('#modal-form').modal('hide')
                    notify(err.message, true)
                });

        } else {
            alert("Please enter a valid email address...")
        }
    } else {
        alert("Please enter your email and password...")
    }
};

const showRegister = () => {
    $('#modal-register').modal('show')
}

// Create user with email & password
const register = () => {
    var emailField = $('#email-register')
    var passwordField = $('#password-register')
    var nameField = $('#full-name-register')
    var officeField = $('#sending-office-register')
    var regionField = $('#sending-reg-register')
    var adminField = $('#role-register')

    var isValid = !validator.isEmpty(emailField.val()) && !validator.isEmpty(passwordField.val())
    if (isValid) {
        if (validator.isEmail(emailField.val())) {
            if (validator.isEmpty(nameField.val()) || validator.isEmpty(officeField.val()) || validator.isEmpty(regionField.val())) {
                alert("Please fill all fields in this form before you proceed...")
                return
            } else {
                // Create user with email address and password
                auth.createUserWithEmailAndPassword(emailField.val(), passwordField.val())
                    .then((userInfo) => {
                        console.log("User created... Almost done!");

                        window.localStorage.setItem('user-key', userInfo.user.uid)

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
                                timestamp: new Date().getTime(),
                                role: adminField.val().toLocaleLowerCase()
                            }).then(() => {
                                // Remove loading toggle
                                toggleLoading(false)
                                // Dismiss modal
                                $('#modal-register').modal('hide')
                                notify('Account creation was successful', false);
                                $('#logout').show()
                            }).catch((err) => {
                                // Remove loading toggle
                                toggleLoading(false)
                                $('#modal-register').modal('hide')
                                notify(err.message, true)
                            })

                    }).catch((err) => {
                        // Remove loading toggle
                        toggleLoading(false)
                        $('#modal-register').modal('hide')
                        notify(err.message, true)
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
        notify("Please check your email account for the reset link...", false)
    }).catch((err) => {
        toggleLoading(false)
        notify(err.message, true)
    });

};

// Sign out user
const signOut = () => {
    if (window.localStorage.getItem('user-key') != null) {
        if (confirm("Do you wish to sign out?")) {
            auth.signOut().then(() => {
                window.localStorage.setItem('user-key', null)
                // $('#logout-text').text('Login')
                $('#logout').hide()
                window.location.href = 'index.html'
            }).catch((err) => {
                notify(err.message, true)
            })
        }
    } else {
        $('#modal-form').modal('show')
    }
};

const resetFields = () => {
    document.getElementById('input-s-region').value = ""
    document.getElementById('input-s-city').value = ""
    document.getElementById('input-duration').value = ""
    document.getElementById('input-item').value = ""
    document.getElementById('input-recipient').value = ""
    document.getElementById('input-comment').value = ""
};

const notify = (message, isError) => {
    $('#alert-message').text(message)
    $('#alert-title').text(isError ? 'Heads up. An error occurred' : 'Notification')
    $('#alert-modal').modal('show')
}

// Upload item to the database
const submitItem = () => {
    if (auth.currentUser === null) {
        $('#modal-form').modal('show')
        return
    }

    // get all fields
    var sregion = document.getElementById('input-s-region').value
    var scity = document.getElementById('input-s-city').value
    var rregion = document.getElementById('input-r-region').value
    var rcity = document.getElementById('input-r-city').value
    var sender = document.getElementById('input-sender').value
    var itemType = document.getElementById('input-item').value
    var recipient = document.getElementById('input-recipient').value
    var duration = document.getElementById('input-duration').value
    var comment = document.getElementById('input-comment').value

    // Validate all fields
    if (validator.isEmpty(rregion) && validator.isEmpty(rcity) && validator.isEmpty(sregion) && validator.isEmpty(scity) && validator.isEmpty(sender) && validator.isEmpty(itemType) && validator.isEmpty(recipient)) {
        alert("Please fill in all these details before you proceed")
        return
    }

    var date = new Date()
    var time = date.getTime()
    console.log(`Date: ${date.toLocaleDateString()} & time: ${time}`)
    var code = sregion.substr(0, 1).toUpperCase() + sregion.substr(sregion.indexOf(' ') + 1).substr(0, 1).toUpperCase() + '-' + scity.substr(0, 3).toUpperCase() + '-' + rregion.substr(0, 1).toUpperCase() + rregion.substr(rregion.indexOf(' ') + 1).substr(0, 1).toUpperCase() + '-' + rcity.substr(0, 3).toUpperCase() + '-' + date.toLocaleDateString().substr(5, 8) + time.toString().substr(7, 12) + '-' + sender.substr(0, 3).toUpperCase() + '-' + itemType.substr(0, 3).toUpperCase()
    console.log(code);
    toggleLoading(true)

    db.collection('fleet-orders').doc(code).set({
        key: code,
        receiving_region: rregion,
        office: rcity,
        sender: sender,
        timestamp: time,
        recipient: recipient,
        duration: duration,
        comment: comment,
        item: itemType,
        sending_office: scity,
        sending_region: sregion,
        item: itemType,
        date: date,
        received: false
    }).then(() => {
        // Notify user of transactioon progress
        toggleLoading(false)
        notify("Request sent successfully with code: " + code, false)
        resetFields()
    }).catch((reason) => {
        toggleLoading(false)
        notify(reason.message, true)
    })
};

// Show loading screen
const toggleLoading = (state) => {
    document.getElementById('overlay').style.display = state ? "block" : "none"
}