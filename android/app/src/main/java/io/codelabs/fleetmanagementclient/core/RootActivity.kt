package io.codelabs.fleetmanagementclient.core

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import io.codelabs.fleetmanagementclient.datasource.local.FleetDao
import io.codelabs.fleetmanagementclient.datasource.local.UserDatabase
import io.codelabs.sdk.view.BaseActivity
import org.koin.android.ext.android.inject
import org.koin.core.parameter.parametersOf

abstract class RootActivity : BaseActivity() {

    val auth: FirebaseAuth by inject { parametersOf(application as FleetApplication) }
    val firestore: FirebaseFirestore by inject { parametersOf(application as FleetApplication) }
    val database: UserDatabase by inject { parametersOf(application as FleetApplication) }
    val dao: FleetDao by inject { parametersOf(application as FleetApplication) }
}