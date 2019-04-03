package io.codelabs.fleetmanagementclient.core

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.text.format.DateUtils
import androidx.core.app.NotificationCompat
import com.itextpdf.text.*
import com.itextpdf.text.pdf.PdfImportedPage
import com.itextpdf.text.pdf.PdfReader
import com.itextpdf.text.pdf.PdfWriter
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.fcm.FleetMessagingService
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.sdk.util.debugLog
import io.codelabs.sdk.util.toast
import java.io.File
import java.io.FileOutputStream

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

fun Context.createPdf(report: Report) {
    try {
        // Create document
        val document = Document(PageSize.PENGUIN_SMALL_PAPERBACK, 10f, 10f, 100f, 0f)
        PdfWriter.getInstance(document, FileOutputStream("${report.timestamp.toString().trim()}.pdf"))
        document.open()

        // Format document
        document.apply {
            addTitle(getString(R.string.app_name))
            addAuthor("Administrator [admin@ghanapost.com]")
        }
        Paragraph("Item details are as follows: ${report.item}").apply {
            alignment = Element.ALIGN_CENTER
            font = Font(Font.FontFamily.TIMES_ROMAN, 18f, Font.BOLD)
        }.also {
            document.add(it)
        }
        Paragraph("Sender: ${report.user}").apply {
            alignment = Element.ALIGN_LEFT
        }.also {
            document.add(it)
        }
        Paragraph(
            "Send date: ${DateUtils.getRelativeTimeSpanString(
                report.timestamp,
                System.currentTimeMillis(),
                DateUtils.SECOND_IN_MILLIS
            )}"
        ).apply {
            alignment = Element.ALIGN_LEFT
        }.also {
            document.add(it)
        }
        Paragraph(
            "Region: ${report.region}"
        ).apply {
            alignment = Element.ALIGN_LEFT
        }.also {
            document.add(it)
        }
        Paragraph(
            "Destination: ${report.destination}"
        ).apply {
            alignment = Element.ALIGN_LEFT
        }.also {
            document.add(it)
        }
        document.close()

        // Display output
        val file = File("/${report.timestamp.toString().trim()}.pdf")
        val intent = Intent(Intent.ACTION_VIEW)
        intent.setDataAndType(Uri.fromFile(file), "application/pdf")
        intent.flags = Intent.FLAG_ACTIVITY_NO_HISTORY
        startActivity(intent)

    } catch (ex: Exception) {
        debugLog(ex.localizedMessage)
        toast(ex.localizedMessage)
    }
}