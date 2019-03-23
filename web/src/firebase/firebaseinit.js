import config from './config'
import firebase from 'firebase'

// Initialize Firebase SDK
firebase.initializeApp(config)

// Create firebase application
const app = firebase.app

// Export firebase conponents
export default {
    firestore: firebase.firestore(),
    auth: firebase.auth(),
    storage: firebase.storage()
}