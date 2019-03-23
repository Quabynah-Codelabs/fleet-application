package io.codelabs.fleetmanagementclient.datasource

/**
 * Callback method for background / foreground processes
 */
interface FleetCallback<D> {

    fun onStart() {}

    fun onError(e: String?)

    fun onSuccess(response: D?)

    fun onComplete() {}
}