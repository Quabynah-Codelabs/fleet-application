package io.codelabs.fleetmanagementclient.model

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey
import kotlinx.android.parcel.Parcelize

@Entity(tableName = "orders")
@Parcelize
data class Order(
    @PrimaryKey
    val key: String,
    val city: String,
    val region: String,
    val item: String,
    val sender: String,
    val timestamp: Long = System.currentTimeMillis()
) : Parcelable {

    @Ignore
    constructor() : this("", "", "", "", "")
}