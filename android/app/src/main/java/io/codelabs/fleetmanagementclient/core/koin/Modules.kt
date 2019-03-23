package io.codelabs.fleetmanagementclient.core.koin

import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import io.codelabs.fleetmanagementclient.core.FleetApplication
import io.codelabs.fleetmanagementclient.datasource.local.FleetDatabase
import io.codelabs.fleetmanagementclient.datasource.local.UserDatabase
import org.koin.android.ext.koin.androidContext
import org.koin.dsl.module

val firebaseModule = module {
    single { FirebaseApp.initializeApp(androidContext() as FleetApplication) }
    single { FirebaseAuth.getInstance(get()) }
    single { FirebaseFirestore.getInstance(get()) }
}

val localDatabase = module {
    single { UserDatabase.getInstance(androidContext() as FleetApplication) }
}

val roomDatabase = module {
    single { FleetDatabase.getInstance(androidContext() as FleetApplication).dao() }
}