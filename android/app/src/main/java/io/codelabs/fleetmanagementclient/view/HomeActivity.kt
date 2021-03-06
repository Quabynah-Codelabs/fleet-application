package io.codelabs.fleetmanagementclient.view

import android.content.Intent
import android.os.Bundle
import android.text.InputType
import android.text.format.DateUtils
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.afollestad.materialdialogs.MaterialDialog
import com.afollestad.materialdialogs.input.getInputField
import com.afollestad.materialdialogs.input.input
import com.afollestad.materialdialogs.list.listItemsSingleChoice
import com.afollestad.recyclical.datasource.dataSourceOf
import com.afollestad.recyclical.setup
import com.afollestad.recyclical.withItem
import com.google.android.material.snackbar.Snackbar
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.databinding.ActivityHomeBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.Region
import io.codelabs.fleetmanagementclient.datasource.remote.getOrders
import io.codelabs.fleetmanagementclient.datasource.remote.getOrdersByRegion
import io.codelabs.fleetmanagementclient.datasource.remote.updateUser
import io.codelabs.fleetmanagementclient.model.MailItem
import io.codelabs.fleetmanagementclient.model.User
import io.codelabs.fleetmanagementclient.view.recyclerview.OrderViewHolder
import io.codelabs.recyclerview.GridItemDividerDecoration
import io.codelabs.recyclerview.SlideInItemAnimator
import io.codelabs.sdk.util.debugLog
import io.codelabs.sdk.util.toast
import kotlinx.android.synthetic.main.activity_home.*
import kotlinx.coroutines.launch

/**
 * Home screen
 */
class HomeActivity : RootActivity(), FleetCallback<MutableList<MailItem>> {


    private lateinit var binding: ActivityHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_home)
        setSupportActionBar(binding.toolbar)

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

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.home_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem?): Boolean {
        when (item?.itemId) {
            R.id.menu_logout -> {
                auth.signOut()
                ioScope.launch {
                    val user: User? = dao.getCurrentUser(database.key!!).value
                    if (user != null) dao.removeUser(user)

                    uiScope.launch {
                        toast("Logged out successfully")
                        startActivity(Intent(this@HomeActivity, MainActivity::class.java))
                        finishAfterTransition()
                    }

                }
            }

            R.id.menu_filter -> {
                val regions = mutableListOf<String>().apply {
                    add(Region.AR)
                    add(Region.BAR)
                    add(Region.CR)
                    add(Region.ER)
                    add(Region.GA)
                    add(Region.NR)
                    add(Region.UER)
                    add(Region.UWR)
                    add(Region.WR)
                    add(Region.VR)
                    add("None")
                }
                MaterialDialog(this).show {
                    title(text = "Select a filter...")
                    listItemsSingleChoice(items = regions, waitForPositiveButton = false) { dialog, _, text ->
                        dialog.dismiss()
                        this@HomeActivity.toast("Fetching data...")
                        if (text == "None") {
                            this@HomeActivity.getOrders(this@HomeActivity)
                            binding.toolbar.title = "Showing all regions"
                        } else {
                            this@HomeActivity.getOrdersByRegion(text, this@HomeActivity)
                            binding.toolbar.title = text
                        }
                    }
                    cancelOnTouchOutside(false)
                    negativeButton(text = "Dismiss") { it.dismiss() }
                }
            }

            R.id.menu_reports -> startActivity(Intent(this@HomeActivity, ReportsActivity::class.java))
        }
        return super.onOptionsItemSelected(item)
    }

    fun showOrderDialog(v: View?) {
        debugLog("Copied text: ${clipboardManager.primaryClip?.getItemAt(0)?.text}")
        MaterialDialog(this@HomeActivity).show {
            input(
                hint = "MailItem ID",
                prefill = clipboardManager.primaryClip?.getItemAt(0)?.text.toString(),
                inputType = InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
            ) { dialog, sequence ->
                dialog.dismiss()
                debugLog(sequence)
            }
            cancelOnTouchOutside(false)
            title(text = "Receive Postal MailItem")
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

    override fun onSuccess(response: MutableList<MailItem>?) {
        if (response != null) {
            debugLog(response)
            binding.loading.visibility = View.GONE
            if (response.isEmpty()) binding.itemEmptyContainer.visibility = View.VISIBLE
            else binding.itemEmptyContainer.visibility = View.GONE

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
                withItem<MailItem>(R.layout.item_order) {
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
                    if (item is MailItem) {
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