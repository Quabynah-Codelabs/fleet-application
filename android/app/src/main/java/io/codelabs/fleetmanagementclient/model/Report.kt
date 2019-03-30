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
    var timestamp: Long = System.currentTimeMillis()
) : Parcelable {

    @Ignore
    constructor() : this(0, "", "","")
}