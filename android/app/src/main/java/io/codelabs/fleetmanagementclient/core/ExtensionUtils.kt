package io.codelabs.fleetmanagementclient.core

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.app.NotificationCompat
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.fcm.FleetMessagingService

fun Context.pushNotification(title: String, content: String, intent: Intent) {
    // Create a notification instance
    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager

    //Create pending intent for activity
    val pi = PendingIntent.getActivity(
        applicationContext,
        125,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT
    )

    //Create notification builder
    val builder = NotificationCompat.Builder(this, "FLEET_CHANNEL_ID")
        .setSmallIcon(R.drawable.ic_work)
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
    manager?.notify(125, builder.build())

    //Wake the screen when the device is locked
    val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
    val wakeLock = powerManager.newWakeLock(
        PowerManager.ACQUIRE_CAUSES_WAKEUP or PowerManager.PARTIAL_WAKE_LOCK,
        FleetMessagingService::class.java.canonicalName
    )
    wakeLock.acquire(15000)
}

fun Context.createNotificationChannel(channelName: String) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val descriptionText = getString(R.string.app_channel_description)
        val channel =
            NotificationChannel("FLEET_CHANNEL_ID", channelName, NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = descriptionText
            }

        // Register the channel with the system
        val notificationManager: NotificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
}