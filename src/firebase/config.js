import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
// These values are safe to expose in client-side code
const firebaseConfig = {
  apiKey: "AIzaSyB9igPWcWb6U_2B1xZ5nahRwTu8nV7tPbc",
  authDomain: "glucose-app-8989d.firebaseapp.com",
  projectId: "glucose-app-8989d",
  storageBucket: "glucose-app-8989d.firebasestorage.app",
  messagingSenderId: "719341883576",
  appId: "1:719341883576:web:5de64826939d4a4bd7244d"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
