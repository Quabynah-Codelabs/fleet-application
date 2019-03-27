import firebase from 'firebase'
import config from './config'

// Initialize firebase
firebase.initializeApp(config)

export default {
    auth: firebase.app(),
    firestore: firebase.firestore(),
    storage: firebase.storage()
}