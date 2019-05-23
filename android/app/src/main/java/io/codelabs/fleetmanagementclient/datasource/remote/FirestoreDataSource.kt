package io.codelabs.fleetmanagementclient.datasource.remote

import android.content.Intent
import androidx.lifecycle.LiveData
import com.google.firebase.firestore.Query
import com.google.firebase.iid.FirebaseInstanceId
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.model.MailItem
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.fleetmanagementclient.model.User
import io.codelabs.fleetmanagementclient.view.MainActivity
import kotlinx.coroutines.launch

object DatabaseReference {
    const val ORDERS_REF = "fleet-orders"
    const val USERS_REF = "fleet-users"
    const val REPORT_DOC = "$USERS_REF/%s/reports"
    const val ADMIN_REF = "fleet-admin"
}

/**
 * Get all [MailItem]s from the database
 */
fun RootActivity.getOrders(callback: FleetCallback<MutableList<MailItem>>) {
    callback.onStarted()
    firestore.collection(DatabaseReference.ORDERS_REF)
        .orderBy("timestamp", Query.Direction.DESCENDING)
        .whereEqualTo("received", false)
        .addSnapshotListener { snapshot, exception ->
            if (exception != null) {
                callback.onError(exception.localizedMessage)
                callback.onComplete()
                return@addSnapshotListener
            }

            val orders = snapshot?.toObjects(MailItem::class.java)
            if (orders == null) {
                callback.onError("Orders cannot be found")
                callback.onComplete()
                return@addSnapshotListener
            } else {
                callback.onSuccess(orders)
                callback.onComplete()
            }
        }
}

/**
 * Get [MailItem] by [key]
 */
fun RootActivity.getOrderById(key: String, callback: FleetCallback<MailItem>) {
    callback.onStarted()
    firestore.collection(DatabaseReference.ORDERS_REF).document(key).addSnapshotListener(this) { snapshot, exception ->
        if (exception != null) {
            callback.onError(exception.localizedMessage)
            callback.onComplete()
            return@addSnapshotListener
        }

        val order = snapshot?.toObject(MailItem::class.java)
        if (order == null) {
            callback.onError("MailItem with key: $key cannot be found")
            callback.onComplete()
            return@addSnapshotListener
        } else {
            callback.onSuccess(order)
            callback.onComplete()
        }
    }
}

fun RootActivity.clearOrder(key: String, callback: FleetCallback<Void>) {
    callback.onStarted()
    firestore.document(String.format("%s/%s", DatabaseReference.ORDERS_REF, key))
        .update(
            mapOf<String, Any?>(
                "received" to true
            )
        )
        .addOnCompleteListener {
            if (it.isSuccessful) {
                callback.onSuccess(null)
            } else {
                callback.onError(it.exception?.localizedMessage)
            }
            callback.onComplete()
        }.addOnFailureListener {
            callback.onError(it.localizedMessage)
            callback.onComplete()
        }
}

fun RootActivity.getCurrentUser(callback: FleetCallback<User>) {
    callback.onStarted()
    firestore.collection(DatabaseReference.ORDERS_REF).document(auth.uid ?: database.key!!)
        .addSnapshotListener(this) { snapshot, exception ->
            if (exception != null) {
                callback.onError(exception.localizedMessage)
                callback.onComplete()
                return@addSnapshotListener
            }

            val user = snapshot?.toObject(User::class.java)
            if (user == null) {
                callback.onError("User with id: ${database.key} cannot be found")
                callback.onComplete()
                return@addSnapshotListener
            } else {
                ioScope.launch {
                    val currentUser: LiveData<User>? = dao.getCurrentUser(database.key!!)
                    if (currentUser == null) dao.createUser(user) else dao.updateUser(user)

                    uiScope.launch {
                        callback.onSuccess(user)
                        callback.onComplete()
                    }
                }
            }
        }
}

fun RootActivity.getAdminById(key: String, callback: FleetCallback<User>) {
    callback.onStarted()
    firestore.collection(DatabaseReference.ADMIN_REF).document(key)
        .addSnapshotListener(this) { snapshot, exception ->
            if (exception != null) {
                callback.onError(exception.localizedMessage)
                callback.onComplete()
                return@addSnapshotListener
            }

            val user = snapshot?.toObject(User::class.java)
            if (user == null) {
                callback.onError("Admin not found")
                callback.onComplete()
                return@addSnapshotListener
            } else {
                callback.onSuccess(user)
                callback.onComplete()
            }
        }
}

fun RootActivity.updateUser(callback: FleetCallback<Void>?) {
    callback?.onStarted()
    val instanceId = FirebaseInstanceId.getInstance()
    firestore.collection(DatabaseReference.USERS_REF).document(auth.uid ?: database.key!!)
        .update(
            mapOf<String, Any?>(
                "token" to instanceId.token,
                "createdAt" to instanceId.creationTime,
                "instanceId" to instanceId.id
            )
        ).addOnFailureListener {
            callback?.onError(it.localizedMessage)
            callback?.onComplete()
        }.addOnCompleteListener {
            if (it.isSuccessful) {

            } else {
                callback?.onError(it.exception?.localizedMessage)
                callback?.onComplete()
            }
        }
}

fun RootActivity.storeUser(user: User, callback: FleetCallback<Void>) {
    callback.onStarted()
    firestore.collection(DatabaseReference.USERS_REF).document(auth.currentUser?.uid ?: database.key!!).set(user)
        .addOnCompleteListener {
            if (it.isSuccessful) {
                ioScope.launch {
                    dao.createUser(user)
                    database.key = user.key

                    uiScope.launch {
                        callback.onSuccess(null)
                        callback.onComplete()
                    }
                }
            } else {
                callback.onError(it.exception?.localizedMessage)
                callback.onComplete()
            }
        }.addOnFailureListener {
            callback.onError(it.localizedMessage)
            callback.onComplete()
        }
}

fun RootActivity.createReport(report: Report, callback: FleetCallback<Void>?) {
    callback?.onStarted()
    firestore.collection(String.format(DatabaseReference.REPORT_DOC, auth.currentUser?.uid ?: database.key!!))
        .document()
        .set(report).addOnCompleteListener {
            if (it.isSuccessful) {
                ioScope.launch {
                    dao.createReport(report)

                    uiScope.launch {
                        callback?.onSuccess(null)
                        callback?.onComplete()
                    }
                }
            } else {
                callback?.onError(it.exception?.localizedMessage)
                callback?.onComplete()
            }
        }.addOnFailureListener {
            callback?.onError(it.localizedMessage)
            callback?.onComplete()
        }
}

fun RootActivity.getReports(callback: FleetCallback<MutableList<Report>>) {
    callback.onStarted()
    firestore.collection(String.format(DatabaseReference.REPORT_DOC, auth.uid ?: database.key!!))
        .orderBy("timestamp", Query.Direction.DESCENDING)
        .addSnapshotListener(this) { snapshot, exception ->
            if (exception != null) {
                callback.onError(exception.localizedMessage)
                callback.onComplete()
                return@addSnapshotListener
            }

            val reports = snapshot?.toObjects(Report::class.java)
            if (reports == null) {
                callback.onError("Unable to load reports...")
            } else callback.onSuccess(reports)
            callback.onComplete()
        }
}

fun RootActivity.signOut() {
    auth.signOut()
    ioScope.launch {
        val user = dao.getCurrentUser(database.key!!).value
        if (user != null) dao.removeUser(user)
        database.key = null

        uiScope.launch {
            startActivity(Intent(applicationContext, MainActivity::class.java))
            finishAfterTransition()
        }
    }
}