package io.codelabs.fleetmanagementclient.core

import android.app.Application
import com.google.firebase.messaging.FirebaseMessaging
import io.codelabs.fleetmanagementclient.core.koin.firebaseModule
import io.codelabs.fleetmanagementclient.core.koin.localDatabase
import io.codelabs.fleetmanagementclient.core.koin.roomDatabase
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

class FleetApplication : Application() {


    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@FleetApplication)
            modules(firebaseModule, localDatabase, roomDatabase)
        }

        FirebaseMessaging.getInstance().isAutoInitEnabled = true

    }
}