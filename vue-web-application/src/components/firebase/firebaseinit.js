import firebase from 'firebase'
import config from './config'

// Initialize firebase instance
firebase.initializeApp(config)

// Export components
export default {
  auth: firebase.auth(),
  db: firebase.firestore(),
  storage: firebase.storage(),
  messaging: firebase.messaging()
}
