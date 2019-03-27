import firebase from 'firebase'
import config from './config'

// Initialize firebase instance
firebase.initializeApp(config)

// Export components
export default {
  app: firebase.app(),
  auth: firebase.auth(firebase.app),
  db: firebase.firestore(firebase.app),
  storage: firebase.storage(firebase.app),
  messaging: firebase.messaging(firebase.app)
}