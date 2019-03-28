package io.codelabs.fleetmanagementclient.core.fcm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.datasource.local.UserDatabase
import io.codelabs.fleetmanagementclient.view.OrderDetailsActivity
import io.codelabs.sdk.util.debugLog
import java.util.*

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
                    Intent(applicationContext, OrderDetailsActivity::class.java).apply {
                        putExtra(OrderDetailsActivity.EXTRA_ORDER_ID, itemKey)
                        putExtra(OrderDetailsActivity.EXTRA_ORDER_TYPE, type)
                    }
                )
            }
        }
    }

    private fun pushNotification(title: String, content: String, intent: Intent) {
        // Create a notification instance
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager

        //Create pending intent for activity
        val pi = PendingIntent.getActivity(
            applicationContext,
            RC_NOTIFICATION,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT
        )

        //Create notification builder
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(NOTIFICATION_ICON)
            .setContentTitle(title)
            .setContentText(content)
            .setContentIntent(pi)
            .setStyle(
                if (content.startsWith("https")) NotificationCompat.BigPictureStyle()
                else NotificationCompat.BigTextStyle()
            )
            .setSound(Settings.System.DEFAULT_NOTIFICATION_URI)
            .setVibrate(longArrayOf(0, 200, 0, 300))
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        //Send notification
        manager?.notify(NOTIFICATION_ID, builder.build())

        //Wake the screen when the device is locked
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = powerManager.newWakeLock(
            PowerManager.ACQUIRE_CAUSES_WAKEUP or PowerManager.PARTIAL_WAKE_LOCK,
            FleetMessagingService::class.java.canonicalName
        )
        wakeLock.acquire(15000)
    }

    private fun createNotificationChannel(channelName: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val descriptionText = getString(R.string.app_channel_description)
            val channel = NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = descriptionText
            }

            // Register the channel with the system
            val notificationManager: NotificationManager =
                getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    companion object {

        private const val RC_NOTIFICATION = 124
        private const val CHANNEL_ID = "FLEET_CHANNEL_ID"
        private val NOTIFICATION_ID = Random(4).nextInt()
        private const val NOTIFICATION_ICON = R.drawable.ic_work
    }

}