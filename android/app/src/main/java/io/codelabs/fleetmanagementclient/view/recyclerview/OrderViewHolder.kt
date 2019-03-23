package io.codelabs.fleetmanagementclient.view.recyclerview

import android.view.View
import androidx.recyclerview.widget.RecyclerView
import io.codelabs.fleetmanagementclient.R
import io.codelabs.util.bindView
import io.codelabs.widget.BaselineGridTextView

/**
 * [RecyclerView.ViewHolder] subclass
 */
class OrderViewHolder(val v: View) : RecyclerView.ViewHolder(v) {

    val key: BaselineGridTextView by bindView(R.id.order_key)
    val type: BaselineGridTextView by bindView(R.id.order_type)
    val timestamp: BaselineGridTextView by bindView(R.id.order_timestamp)
}