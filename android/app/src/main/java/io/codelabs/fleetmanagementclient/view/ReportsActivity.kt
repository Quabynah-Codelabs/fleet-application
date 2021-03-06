package io.codelabs.fleetmanagementclient.view

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.text.format.DateUtils
import android.view.View
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.afollestad.recyclical.datasource.dataSourceOf
import com.afollestad.recyclical.setup
import com.afollestad.recyclical.withItem
import com.google.android.material.snackbar.Snackbar
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.core.createPdf
import io.codelabs.fleetmanagementclient.databinding.ActivityReportsBinding
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.getReports
import io.codelabs.fleetmanagementclient.model.Report
import io.codelabs.sdk.util.toast
import io.codelabs.util.bindView
import io.codelabs.widget.BaselineGridTextView

class ReportsActivity : RootActivity() {
    private lateinit var binding: ActivityReportsBinding
    private var hasPermissions: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_reports)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        hasPermissions = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED

        getReports(object : FleetCallback<MutableList<Report>> {
            override fun onError(e: String?) {
                binding.loading.visibility = View.GONE
                Snackbar.make(binding.container, e.toString(), Snackbar.LENGTH_LONG).show()
            }

            @SuppressLint("NewApi")
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
                            val snackbar = Snackbar.make(binding.container, "Save report as PDF?", Snackbar.LENGTH_LONG)
                            snackbar.apply {
                                setAction("Create Pdf") {
                                    snackbar.dismiss()
                                    if (hasPermissions || Build.VERSION.SDK_INT < Build.VERSION_CODES.M) createPdf(item)
                                    else requestPermissions(
                                        arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                                        RC_PERM
                                    )
                                }
                            }
                            snackbar.show()
                        }
                    }

                }
            }
        })
    }

    @SuppressLint("NewApi")
    override fun onEnterAnimationComplete() {
        if (!hasPermissions) requestPermissions(arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), RC_PERM)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        if (requestCode == RC_PERM && grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED){
            toast("Storage permission granted. Now you can tap on each report to create a printable version of it",true)
            hasPermissions = true
        }
    }

    inner class ReportViewHolder(val v: View) : RecyclerView.ViewHolder(v) {
        val message: BaselineGridTextView by bindView(R.id.item_message)
        val sender: BaselineGridTextView by bindView(R.id.item_sender)
        val timestamp: BaselineGridTextView by bindView(R.id.item_timestamp)
    }

    companion object {
        private const val RC_PERM = 9
    }
}