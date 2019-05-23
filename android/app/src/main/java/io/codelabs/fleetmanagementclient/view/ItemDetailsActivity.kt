package io.codelabs.fleetmanagementclient.view

import android.content.ClipData
import android.os.Bundle
import android.text.format.DateUtils
import android.view.View
import androidx.databinding.DataBindingUtil
import com.google.android.material.snackbar.Snackbar
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.databinding.ActivityDetailsBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.clearOrder
import io.codelabs.fleetmanagementclient.datasource.remote.createReport
import io.codelabs.fleetmanagementclient.datasource.remote.getOrderById
import io.codelabs.fleetmanagementclient.model.MailItem
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.sdk.util.debugLog
import io.codelabs.sdk.util.toast

class ItemDetailsActivity : RootActivity() {
    private lateinit var binding: ActivityDetailsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_details)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        if (intent.hasExtra(EXTRA_ORDER)) {
            binding.mailItem = intent.getParcelableExtra(EXTRA_ORDER)
            bindUI()
        } else if (intent.hasExtra(EXTRA_ORDER_ID)) {
            val orderId = intent.getStringExtra(EXTRA_ORDER_ID)
            val snackbar = Snackbar.make(binding.container, "Fetching item details...", Snackbar.LENGTH_INDEFINITE)

            getOrderById(orderId, object : FleetCallback<MailItem> {

                override fun onStarted() {
                    snackbar.show()
                }

                override fun onError(e: String?) {
                    /*snackbar.setDuration(BaseTransientBottomBar.LENGTH_LONG)
                        .setText(e.toString())
                        .show()*/
                    toast(e.toString(), true)
                    finishAfterTransition()
                }

                override fun onSuccess(response: MailItem?) {
                    snackbar.dismiss()
                    debugLog("$response")
                    binding.mailItem = response
                    bindUI()
                }
            })
        }
    }

    private fun bindUI() {
        debugLog(binding.mailItem)
    }

    fun copyCode(v: View?) {
        val clipData = ClipData.newPlainText("Copy item code...", binding.mailItem?.key)
        clipboardManager.primaryClip = clipData
        toast("Code copied")
    }

    fun receiveOrder(v: View?) {
        // Clear the user's order
        clearOrder(binding.mailItem!!.key, object : FleetCallback<Void> {
            override fun onStarted() {
                toast("Clearing your item...")
            }

            override fun onError(e: String?) {
                toast(e)
            }

            override fun onSuccess(response: Void?) {
                val message =
                    "Item of type: ${binding.mailItem?.item}. Item was received ${DateUtils.getRelativeTimeSpanString(
                        binding.mailItem?.timestamp!!,
                        System.currentTimeMillis(),
                        DateUtils.SECOND_IN_MILLIS
                    )}. The code for this item is: ${binding.mailItem?.key}."
                createReport(
                    Report(
                        message,
                        binding.mailItem?.sender!!,
                        binding.mailItem?.key!!,
                        binding.mailItem?.region!!,
                        binding.mailItem?.city!!,
                        binding.mailItem?.timestamp ?: System.currentTimeMillis()
                    ), null
                )
            }
        })
        finishAfterTransition()
    }

    companion object {
        const val EXTRA_ORDER_ID = "EXTRA_ORDER_ID"
        const val EXTRA_ORDER_TYPE = "EXTRA_ORDER_TYPE"
        const val EXTRA_ORDER = "EXTRA_ORDER"
    }
}