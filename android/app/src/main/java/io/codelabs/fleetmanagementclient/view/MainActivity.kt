package io.codelabs.fleetmanagementclient.view

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import io.codelabs.fleetmanagementclient.R
import io.codelabs.sdk.util.toast
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        google_sign_in.setOnClickListener {
            val gso = GoogleSignInOptions.Builder()
                .requestEmail()
                .requestIdToken(getString(R.string.default_web_client_id))
                .build()

            val client = GoogleSignIn.getClient(this@MainActivity, gso)
            startActivityForResult(client.signInIntent,
                RC_SIGN_IN
            )
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == RC_SIGN_IN && resultCode == Activity.RESULT_OK) {
            toast("User is signed in successfully")
        } else {
            toast("unable to sign in user. Please check for errors")
        }
    }

    companion object {
        private const val RC_SIGN_IN = 9
    }
}
