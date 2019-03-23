package io.codelabs.fleetmanagementclient.view

import android.os.Bundle
import android.text.InputType
import android.view.View
import androidx.databinding.DataBindingUtil
import com.afollestad.materialdialogs.MaterialDialog
import com.afollestad.materialdialogs.input.getInputField
import com.afollestad.materialdialogs.input.input
import com.afollestad.materialdialogs.list.listItems
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.databinding.ActivityHomeBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.getOrderById
import io.codelabs.fleetmanagementclient.model.Order
import io.codelabs.sdk.util.debugLog
import io.codelabs.sdk.util.toast

/**
 * Home screen
 */
class HomeActivity : RootActivity() {
    private lateinit var binding: ActivityHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_home)


    }

    fun showOrderDialog(v: View?) {
        MaterialDialog(this@HomeActivity).show {
            input(hint = "Order ID", inputType = InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS) { dialog, sequence ->
                dialog.dismiss()
                debugLog(sequence)
            }

            title(text = "Receive Postal Order")
            positiveButton(text = "Verify") { materialDialog ->
                materialDialog.dismiss()
                val orderId = getInputField().text.toString()
                getOrderById(orderId, object : FleetCallback<Order> {

                    override fun onStart() {
                        toast("Fetching your order...")
                    }

                    override fun onError(e: String?) {
                        toast(e)
                    }

                    override fun onSuccess(response: Order?) {
                        debugLog("$response")

                        MaterialDialog(this@HomeActivity).show {
                            title(text = "Request found")
                            listItems(
                                items = listOf(
                                    String.format("ID: %s", response?.key),
                                    String.format("Item Type: %s", response?.item),
                                    String.format("City: %s", response?.city),
                                    String.format("Delivery Man: %s", response?.sender),
                                    String.format("Region: %s", response?.region)
                                ), disabledIndices = intArrayOf(0, 1, 2, 3, 4)
                            )
                            negativeButton(text = "Dismiss") { it.dismiss() }
                        }
                    }
                })
            }
        }
    }
}