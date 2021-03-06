package io.codelabs.fleetmanagementclient.datasource.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import io.codelabs.fleetmanagementclient.model.MailItem
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.fleetmanagementclient.model.User

@Database(entities = [User::class, MailItem::class, Report::class], version = 6, exportSchema = true)
abstract class FleetDatabase : RoomDatabase() {

    abstract fun dao(): FleetDao

    companion object {
        @Volatile
        private var instance: FleetDatabase? = null

        @JvmStatic
        fun getInstance(context: Context): FleetDatabase {
            return instance ?: synchronized(this) {
                return instance ?: Room.databaseBuilder(
                    context,
                    FleetDatabase::class.java,
                    FleetDatabase::class.java.simpleName
                )
                    .fallbackToDestructiveMigration()
                    .build().also { instance = it }
            }
        }
    }

}