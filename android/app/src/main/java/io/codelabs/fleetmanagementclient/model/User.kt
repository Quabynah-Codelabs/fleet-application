package io.codelabs.fleetmanagementclient.model

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey
import com.google.firebase.iid.FirebaseInstanceId
import kotlinx.android.parcel.Parcelize

@Entity(tableName = "users")
@Parcelize
data class User(
    @PrimaryKey
    val key: String,
    val name: String?,
    val email: String,
    val photoUrl: String? = null,
    val token: String? = FirebaseInstanceId.getInstance().token,
    val timestamp: Long = System.currentTimeMillis()
) : Parcelable {

    @Ignore
    constructor() : this("", "", "")
}