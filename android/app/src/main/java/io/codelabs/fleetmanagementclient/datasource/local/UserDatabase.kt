package io.codelabs.fleetmanagementclient.datasource.local

import android.content.Context
import android.content.SharedPreferences
import androidx.core.content.edit
import io.codelabs.fleetmanagementclient.BuildConfig

class UserDatabase constructor(ctx: Context) {
    companion object {
        private const val USER_KEY = "user_key"
        @Volatile
        private var instance: UserDatabase? = null

        @JvmStatic
        fun getInstance(context: Context): UserDatabase {
            return instance ?: synchronized(this) {
                return instance ?: UserDatabase(context).also { instance = it }
            }
        }
    }

    private val prefs: SharedPreferences = ctx.getSharedPreferences(BuildConfig.APPLICATION_ID, Context.MODE_PRIVATE)

    var isLoggedIn: Boolean = false
    var key: String? = null
        get() = prefs.getString(USER_KEY, null)
        set(value) {
            field = value
            isLoggedIn = !key.isNullOrEmpty()
            prefs.edit {
                putString(USER_KEY, value)
                commit()
            }
        }

    init {
        key = prefs.getString(USER_KEY, null)
        isLoggedIn = !key.isNullOrEmpty()
        if (isLoggedIn) key = prefs.getString(USER_KEY, null)
    }

}