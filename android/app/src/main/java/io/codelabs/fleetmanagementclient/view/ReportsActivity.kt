package io.codelabs.fleetmanagementclient.view

import android.os.Bundle
import android.text.format.DateUtils
import android.view.View
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.afollestad.recyclical.datasource.dataSourceOf
import com.afollestad.recyclical.setup
import com.afollestad.recyclical.withItem
import com.google.android.material.snackbar.Snackbar
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.databinding.ActivityReportsBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.getReports
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.util.bindView
import io.codelabs.widget.BaselineGridTextView

class ReportsActivity : RootActivity() {
    private lateinit var binding: ActivityReportsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_reports)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        getReports(object : FleetCallback<MutableList<Report>> {
            override fun onError(e: String?) {
                binding.loading.visibility = View.GONE
                Snackbar.make(binding.container, e.toString(), Snackbar.LENGTH_LONG).show()
            }

            override fun onSuccess(response: MutableList<Report>?) {
                binding.loading.visibility = View.GONE
                if (response == null || response.isEmpty()) {
                    Snackbar.make(binding.container, "Unable to load data", Snackbar.LENGTH_LONG).show()
                    return
                }

                binding.reportsGrid.setup {
                    withLayoutManager(LinearLayoutManager(this@ReportsActivity))
                    withDataSource(dataSourceOf(response))
                    withItem<Report>(R.layout.item_report) {
                        onBind(::ReportViewHolder) { _, item ->
                            sender.text = item.user
                            message.text = item.message.trim()
                            timestamp.text = DateUtils.getRelativeTimeSpanString(
                                item.timestamp,
                                System.currentTimeMillis(),
                                DateUtils.SECOND_IN_MILLIS
                            )

                        }
                    }

                    withClickListener { _, item ->
                        if (item is Report) {

                        }
                    }
                }
            }
        })
    }

    inner class ReportViewHolder(val v: View) : RecyclerView.ViewHolder(v) {
        val message: BaselineGridTextView by bindView(R.id.item_message)
        val sender: BaselineGridTextView by bindView(R.id.item_sender)
        val timestamp: BaselineGridTextView by bindView(R.id.item_timestamp)
    }
}