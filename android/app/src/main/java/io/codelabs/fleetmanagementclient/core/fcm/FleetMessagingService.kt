package io.codelabs.fleetmanagementclient.core.fcm

import android.content.Intent
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.createNotificationChannel
import io.codelabs.fleetmanagementclient.core.pushNotification
import io.codelabs.fleetmanagementclient.datasource.local.UserDatabase
import io.codelabs.fleetmanagementclient.view.ItemDetailsActivity
import io.codelabs.sdk.util.debugLog

class FleetMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(rm: RemoteMessage?) {
        debugLog("remote message: ${rm?.data}")

        if (rm != null) {
            val data = rm.data
            val itemKey = data["itemKey"]
            val type = data["type"]
            val message = data["message"]

            createNotificationChannel(data["type"] ?: getString(R.string.app_name))

            val database = UserDatabase.getInstance(applicationContext)
            if (database.isLoggedIn) {
                pushNotification(
                    "Request code received",
                    message ?: "",
                    Intent(applicationContext, ItemDetailsActivity::class.java).apply {
                        putExtra(ItemDetailsActivity.EXTRA_ORDER_ID, itemKey)
                        putExtra(ItemDetailsActivity.EXTRA_ORDER_TYPE, type)
                    }
                )
            }
        }
    }
}