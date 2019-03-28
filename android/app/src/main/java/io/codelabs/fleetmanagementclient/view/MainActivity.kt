package io.codelabs.fleetmanagementclient.view

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.GoogleAuthProvider
import io.codelabs.fleetmanagementclient.R
import io.codelabs.fleetmanagementclient.core.RootActivity
import io.codelabs.fleetmanagementclient.datasource.FleetCallback
import io.codelabs.fleetmanagementclient.datasource.remote.storeUser
import io.codelabs.fleetmanagementclient.model.User
import io.codelabs.sdk.util.debugLog
import io.codelabs.sdk.util.showConfirmationToast
import io.codelabs.sdk.util.toast

class MainActivity : RootActivity() {
    private lateinit var binding: io.codelabs.fleetmanagementclient.databinding.ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_main)
        if (database.isLoggedIn) dao.getCurrentUser(database.key!!).observe(this@MainActivity, Observer {
            binding.user = it
            binding.homeButton.text = String.format(getString(R.string.signed_in_as), it.name ?: it.email)
            debugLog("Current user: $it")
        })
    }


    fun googleLogin(v: View?) {
        if (database.isLoggedIn) {
            startApp(v)
            return
        }

        val gso = GoogleSignInOptions.Builder()
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        val client = GoogleSignIn.getClient(this@MainActivity, gso)
        startActivityForResult(
            client.signInIntent,
            RC_SIGN_IN
        )
    }

    fun startApp(v: View?) {
        startActivity(Intent(this@MainActivity, HomeActivity::class.java))
        finishAfterTransition()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == RC_SIGN_IN && resultCode == Activity.RESULT_OK) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                // Google Sign In was successful, authenticate with Firebase
                val account = task.getResult(ApiException::class.java)
                toast("User is signed in successfully. Fetching data...")
                auth.signInWithCredential(GoogleAuthProvider.getCredential(account?.idToken, null))
                    .addOnCompleteListener(this) {
                        if (it.isSuccessful) {
                            val firebaseUser = it.result?.user
                            val user = User(
                                firebaseUser?.uid!!,
                                firebaseUser.displayName,
                                firebaseUser.email,
                                firebaseUser.photoUrl.toString()
                            )

                            storeUser(
                                user, object : FleetCallback<Void> {
                                    override fun onError(e: String?) {
                                        toast(e)
                                    }

                                    override fun onSuccess(response: Void?) {
                                        binding.user = user
                                        debugLog("Logged in user: ${binding.user}")
                                        binding.homeButton.text = String.format(getString(R.string.signed_in_as), user.name ?: user.email)
                                        database.key = binding.user?.key
                                        showConfirmationToast(user.photoUrl, user.name ?: user.email!!)
                                    }
                                })
                        }
                    }

            } catch (e: ApiException) {
                // Google Sign In failed, update UI appropriately
                toast("Google sign in failed. ${e.localizedMessage}")
            }
        } else {
            toast("unable to sign in user. Please check for errors")
        }
    }

    companion object {
        private const val RC_SIGN_IN = 9
    }
}
