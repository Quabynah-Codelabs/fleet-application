package io.codelabs.fleetmanagementclient.datasource.local

import androidx.lifecycle.LiveData
import androidx.room.*
import io.codelabs.fleetmanagementclient.model.MailItem
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.fleetmanagementclient.model.User

@Dao
interface FleetDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun createUser(user: User)

    @Query("SELECT * FROM users WHERE `key` = :key")
    fun getCurrentUser(key: String): LiveData<User>

    @Update
    fun updateUser(user: User)

    @Delete
    fun removeUser(user: User)


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun createOrder(vararg mailItems: MailItem)

    @Delete
    fun removeOrder(vararg mailItems: MailItem)

    @Query("SELECT * FROM mailItems WHERE `key` = :key")
    fun getOrderById(key: String): LiveData<MailItem>

    @Query("SELECT * FROM mailItems ORDER BY timestamp DESC")
    fun getAllOrders(): LiveData<MutableList<MailItem>>


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun createReport(vararg reports: Report)

    @Delete
    fun removeOrder(vararg orders: Report)

    @Query("SELECT * FROM reports WHERE `id` = :id")
    fun getReportById(id: Int): LiveData<Report>

    @Query("SELECT * FROM reports ORDER BY timestamp DESC")
    fun getAllReports(): LiveData<MutableList<Report>>

}