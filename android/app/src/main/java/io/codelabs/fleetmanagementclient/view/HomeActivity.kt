package io.codelabs.fleetmanagementclient.view

import android.content.Intent
import android.os.Bundle
import android.text.InputType
import android.text.format.DateUtils
import android.view.View
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.afollestad.materialdialogs.MaterialDialog
import com.afollestad.materialdialogs.input.getInputField
import com.afollestad.materialdialogs.input.input
import com.afollestad.recyclical.datasource.dataSourceOf
import com.afollestad.recyclical.setup
import com.afollestad.recyclical.withItem
import com.google.android.material.snackbar.Snackbar
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.databinding.ActivityHomeBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.getOrders
import io.codelabs.fleetmanagementclient.datasource.remote.updateUser
import io.codelabs.fleetmanagementclient.model.Order
import io.codelabs.fleetmanagementclient.view.recyclerview.OrderViewHolder
import io.codelabs.recyclerview.GridItemDividerDecoration
import io.codelabs.recyclerview.SlideInItemAnimator
import io.codelabs.sdk.util.debugLog
import kotlinx.android.synthetic.main.activity_home.*

/**
 * Home screen
 */
class HomeActivity : RootActivity(), FleetCallback<MutableList<Order>> {


    private lateinit var binding: ActivityHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_home)

        binding.itemEmptyContainer.setOnClickListener {
            try {
                binding.loading.visibility = View.VISIBLE
                binding.itemEmptyContainer.visibility = View.GONE
                getOrders(this@HomeActivity)
            } catch (e: Exception) {
                debugLog(e.localizedMessage)
            }
        }

        getOrders(this)
    }

    fun showOrderDialog(v: View?) {
        debugLog("Copied text: ${clipboardManager.primaryClip?.getItemAt(0)?.text}")
        MaterialDialog(this@HomeActivity).show {
            input(
                hint = "Order ID",
                prefill = clipboardManager.primaryClip?.getItemAt(0)?.text.toString(),
                inputType = InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
            ) { dialog, sequence ->
                dialog.dismiss()
                debugLog(sequence)
            }
            cancelOnTouchOutside(false)
            title(text = "Receive Postal Order")
            positiveButton(text = "Verify") { materialDialog ->
                materialDialog.dismiss()
                val orderId = getInputField().text.toString()
                startActivity(Intent(this@HomeActivity, ItemDetailsActivity::class.java).apply {
                    putExtra(ItemDetailsActivity.EXTRA_ORDER_ID, orderId)
                })
            }
        }
    }

    override fun onStop() {
        super.onStop()
        if (database.isLoggedIn) updateUser(object : FleetCallback<Void> {
            override fun onError(e: String?) {
                debugLog(e)
            }

            override fun onSuccess(response: Void?) {
                debugLog("User updated successfully...")
            }
        })
    }

    override fun onError(e: String?) {
        binding.loading.visibility = View.GONE
        Snackbar.make(binding.container, e.toString(), Snackbar.LENGTH_LONG).show()
    }

    override fun onSuccess(response: MutableList<Order>?) {
        if (response != null) {
            binding.loading.visibility = View.GONE
            if (response.isEmpty()) binding.itemEmptyContainer.visibility = View.VISIBLE

            // Setup recycler view
            grid.addItemDecoration(
                GridItemDividerDecoration(
                    this@HomeActivity,
                    R.dimen.divider_height,
                    R.color.divider
                )
            )
            grid.itemAnimator = SlideInItemAnimator() as RecyclerView.ItemAnimator
            grid.setHasFixedSize(true)
            grid.setup {
                withLayoutManager(LinearLayoutManager(this@HomeActivity))
                withDataSource(dataSourceOf(response))
                withEmptyView(View.inflate(this@HomeActivity, R.layout.item_empty, null))
                withItem<Order>(R.layout.item_order) {
                    onBind(::OrderViewHolder) { _, item ->
                        key.text = item.key
                        type.text = item.item
                        timestamp.text = DateUtils.getRelativeTimeSpanString(
                            item.timestamp,
                            System.currentTimeMillis(),
                            DateUtils.SECOND_IN_MILLIS
                        )
                    }
                }

                withClickListener { _, item ->
                    if (item is Order) {
                        this@HomeActivity.startActivity(
                            Intent(
                                this@HomeActivity,
                                ItemDetailsActivity::class.java
                            ).apply {
                                putExtra(ItemDetailsActivity.EXTRA_ORDER_ID, item.key)
                                putExtra(ItemDetailsActivity.EXTRA_ORDER, item)
                            })
                    }
                }
            }
        } else {
            binding.loading.visibility = View.GONE
            Snackbar.make(binding.container, "Items data could not be found", Snackbar.LENGTH_LONG).show()
        }
    }
}