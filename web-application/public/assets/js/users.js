let result = [];
let query = '';

$(document).ready(() => {

    // Add action for form submission
    $('#user-search-form').submit((ev) => {
        ev.preventDefault();
        searchFor();
    });

    // Load live data
    // loadLiveData()

    // Get data once until page has been refreshed
    loadStaticData()

    // View action
    $(document).on('click', 'a[data-href]#view-user', function (ev) {
        ev.preventDefault();
        notify("Feature to view user information is not available in this release", true);
    });

    // Delete action
    $(document).on('click', 'a[data-href]#delete-user', function (ev) {
        ev.preventDefault();
        if (confirm('Do you wish to delete this user from the system. (Caution: This process cannot be reversed)?')) {
            toggleLoading(true);

            // Delete user information from database
            let userDoc = {};
            let userKey = this.dataset.href;
            var userRef = db.collection('fleet-users').doc(userKey);
            userRef.get().then(snapshot => {
                if (snapshot.exists) {
                    // Extract user information
                    userDoc = snapshot.data();

                    // Delete user
                    userRef.delete().then(() => {
                        // Save user in backup datasource
                        db.collection('fleet-deleted-users').doc(userKey).set(userDoc).then(() => {
                            // Update UI with callback
                            toggleLoading(false);
                            notify('User deleted successfully', false);
                            clearTable();
                            loadStaticData();
                        }).catch(err => {
                            console.log(err.message)
                        });
                    }).catch(err => {
                        toggleLoading(false);
                        notify('Unable to remove user information from the system. This may be due to a poor internet connection. Please try again later.\n' + err.message, true);
                    })
                } else {
                    toggleLoading(false);
                    notify('User does not exist in your database', true);
                }
            }).catch(err => {
                toggleLoading(false);
                notify(err.message + '\nUnable to delete user from system', true);
            });
        }
    });

    // Edit action
    $(document).on('click', 'a[data-href]#edit-user', function (ev) {
        ev.preventDefault();
        notify("Sorry! Cannot edit user information in this release", true);
    });

    // Block action
    $(document).on('click', 'a[data-href]#block-user', function (ev) {
        ev.preventDefault();
        notify("Sorry! Cannot block user in this release", true);
    });
});

// Load live data snapshots from the server
const loadLiveData = () => {
    db.collection('fleet-users').onSnapshot({
        includeMetadataChanges: true
    }, (snapshots) => {
        if (snapshots.empty) {
            notify('No users found', false);
        } else {
            console.log(snapshots.docs[0].data());

            snapshots.docs.forEach(doc => {
                var key = doc.data().key
                var name = doc.data().name
                var email = doc.data().email
                var createdAt = doc.data().createdAt
                var lastSeen = doc.data().timestamp
                var avatar = doc.data().photoUrl

                $('#users-container').append(`
                <tr>
                    <th scope="row">
                        <div class="media align-items-center">
                            <a href="#" class="avatar rounded-circle mr-3">
                                <img alt="Image placeholder" src="${avatar && avatar != 'null' ? avatar : './assets/img/icons/common/avatar_placeholder_large.png'}">
                            </a>
                            <div class="media-body">
                                <span class="mb-0 text-sm">${name}</span>
                            </div>
                        </div>
                    </th>
                    <td>
                        ${email}
                    </td>
                    <td>
                        ${key}
                    </td>
                    <td>
                        ${new Date(createdAt).toDateString()}
                    </td>
                    <td>
                    ${new Date(lastSeen).toDateString()}
                    </td>
                    <td class="text-right">
                        <div class="dropdown">
                            <a class="btn btn-sm btn-icon-only text-light" href="#" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                <a class="dropdown-item" data-href="${key}" id="view-user" href="#view">View</a>
                                <a class="dropdown-item" data-href="${key}" id="delete-user" href="#delete">Delete</a>
                                <a class="dropdown-item" data-href="${key}" id="edit-user" href="#edit">Edit</a>
                                <a class="dropdown-item" data-href="${key}" id="block-user" href="#block">Block</a>
                            </div>
                        </div>
                    </td>
                </tr>
                `)
            });
        }
    }, (err) => {
        toggleLoading(false);
        notify(err.message);
    });
};

const clearTable = () => {
    $('#users-container').empty();
}

// Load data snapshots from the server
const loadStaticData = () => {
    db.collection('fleet-users').get()
        .then(snapshots => {
            if (snapshots.empty) {
                notify('No users found', false);
            } else {
                console.log(snapshots.docs[0].data());

                snapshots.docs.forEach(doc => {
                    var key = doc.data().key
                    var name = doc.data().name
                    var email = doc.data().email
                    var createdAt = doc.data().createdAt
                    var lastSeen = doc.data().timestamp
                    var avatar = doc.data().photoUrl

                    $('#users-container').append(`
                <tr data-href="${key}" id="view-user">
                    <th scope="row">
                        <div class="media align-items-center">
                            <a href="#" class="avatar rounded-circle mr-3">
                                <img alt="Image placeholder" src="${avatar && avatar != 'null' ? avatar : './assets/img/icons/common/avatar_placeholder_large.png'}">
                            </a>
                            <div class="media-body">
                                <span class="mb-0 text-sm">${name}</span>
                            </div>
                        </div>
                    </th>
                    <td>
                        ${email}
                    </td>
                    <td>
                        ${key}
                    </td>
                    <td>
                        ${new Date(createdAt).toDateString()}
                    </td>
                    <td>
                    ${new Date(lastSeen).toDateString()}
                    </td>
                    <td class="text-right">
                        <div class="dropdown">
                            <a class="btn btn-sm btn-icon-only text-light" href="#" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                <a class="dropdown-item" data-href="${key}" id="view-user" href="#view">View</a>
                                <a class="dropdown-item" data-href="${key}" id="delete-user" href="#delete">Delete</a>
                                <a class="dropdown-item" data-href="${key}" id="edit-user" href="#edit">Edit</a>
                                <a class="dropdown-item" data-href="${key}" id="block-user" href="#block">Block</a>
                            </div>
                        </div>
                    </td>
                </tr>
                `)
                });
            }
        }).catch(err => {
            toggleLoading(false);
            notify(err.message);
        });
}


// Query functions
const searchFor = async () => {
    // Get query
    query = $('#search-input').val();

    if (query === null) {
        // Get query
        query = $('#search-input-collapsed').val();
    }

    // Clear fields
    $('#search-input').val('');
    $('#search-input-collapsed').val('');

    // Perform actual query
    toggleLoading(true);
    let results = [];

    // Fetch all users that have the same name as the query
    await db.collection('fleet-users')
        .where('name', '==', query)
        // .orderBy('timestamp')
        .limit(100)
        .get()
        .then(snapshots => {
            toggleLoading(false);
            notify(`${snapshots.docs.length} items found!`, false);
            snapshots.docs.forEach(doc => {
                if (doc.exists) {
                    results.push(doc.data());
                }
            });
        }).catch(err => {
            toggleLoading(false);
            notify(err.message, true);
            console.log(err.message);
        });

        // return results from query
        return results;
};