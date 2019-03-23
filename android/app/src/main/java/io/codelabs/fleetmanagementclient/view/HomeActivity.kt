package io.codelabs.fleetmanagementclient.view

import android.os.Bundle
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity

/**
 * Home screen
 */
class HomeActivity : RootActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
    }
}