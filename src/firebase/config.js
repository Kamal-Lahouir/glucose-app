import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// These values are safe to expose in client-side code
const firebaseConfig = {
  apiKey: "AIzaSyBGlucoseTrackerAppDemo123456789",
  authDomain: "glucose-tracker-demo.firebaseapp.com",
  projectId: "glucose-tracker-demo",
  storageBucket: "glucose-tracker-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
