package io.codelabs.fleetmanagementclient.model

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey
import kotlinx.android.parcel.Parcelize

@Entity(tableName = "reports")
@Parcelize
data class Report(
    @PrimaryKey(autoGenerate = true)
    val id: Int,
    var message: String,
    var user: String,
    var item: String,
    var region: String = "N/A",
    var destination: String = "N/A",
    var timestamp: Long = System.currentTimeMillis()
) : Parcelable {

    @Ignore
    constructor() : this(0, "", "", "", "")

    @Ignore
    constructor(message: String, user: String, item: String, region: String, destination: String,timestamp: Long) : this(0, message, user, item, region)
}