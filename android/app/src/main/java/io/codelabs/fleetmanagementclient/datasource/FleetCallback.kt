package io.codelabs.fleetmanagementclient.datasource

/**
 * Callback method for background / foreground processes
 */
interface FleetCallback<D> {

    fun onStarted() {}

    fun onError(e: String?)

    fun onSuccess(response: D?)

    fun onComplete() {}
}