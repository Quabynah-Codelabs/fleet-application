package io.codelabs.fleetmanagementclient.view

import android.os.Bundle
import androidx.databinding.DataBindingUtil
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.databinding.ActivityDetailsBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.getOrderById
import io.codelabs.fleetmanagementclient.model.Order
import io.codelabs.sdk.util.debugLog
import io.codelabs.sdk.util.toast

class OrderDetailsActivity : RootActivity() {
    private lateinit var binding: ActivityDetailsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_details)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        if (intent.hasExtra(EXTRA_ORDER)) {
            binding.order = intent.getParcelableExtra(EXTRA_ORDER)
            bindUI()
        } else if (intent.hasExtra(EXTRA_ORDER_ID)) {
            val orderId = intent.getStringExtra(EXTRA_ORDER_ID)
            getOrderById(orderId, object : FleetCallback<Order> {

                override fun onStart() {
                    toast("Fetching your order...")
                }

                override fun onError(e: String?) {
                    toast(e)
                }

                override fun onSuccess(response: Order?) {
                    debugLog("$response")
                    binding.order = response
                    bindUI()
                }
            })
        }
    }

    private fun bindUI() {
        debugLog(binding.order)
    }

    companion object {
        const val EXTRA_ORDER_ID = "EXTRA_ORDER_ID"
        const val EXTRA_ORDER = "EXTRA_ORDER"
    }
}