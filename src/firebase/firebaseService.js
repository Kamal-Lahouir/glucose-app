import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { auth, db } from './config'

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Database functions for Users
export const saveUser = async (userId, accountId, userData) => {
  try {
    await setDoc(doc(db, 'accounts', accountId, 'users', userId.toString()), userData)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getUsers = async (accountId) => {
  try {
    const usersRef = collection(db, 'accounts', accountId, 'users')
    const snapshot = await getDocs(usersRef)
    const users = []
    snapshot.forEach(doc => {
      users.push({ ...doc.data(), id: parseInt(doc.id) })
    })
    return { users, error: null }
  } catch (error) {
    return { users: [], error: error.message }
  }
}

// Database functions for Entries
export const saveEntry = async (accountId, entryId, entryData) => {
  try {
    await setDoc(doc(db, 'accounts', accountId, 'entries', entryId.toString()), entryData)
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getEntries = async (accountId) => {
  try {
    const entriesRef = collection(db, 'accounts', accountId, 'entries')
    const snapshot = await getDocs(entriesRef)
    const entries = []
    snapshot.forEach(doc => {
      entries.push({ ...doc.data(), id: parseInt(doc.id) })
    })
    return { entries, error: null }
  } catch (error) {
    return { entries: [], error: error.message }
  }
}

export const deleteEntry = async (accountId, entryId) => {
  try {
    await deleteDoc(doc(db, 'accounts', accountId, 'entries', entryId.toString()))
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Sync functions
export const syncLocalToCloud = async (accountId, users, entries) => {
  try {
    // Sync users
    for (const user of users) {
      await saveUser(user.id, accountId, user)
    }

    // Sync entries
    for (const entry of entries) {
      await saveEntry(accountId, entry.id, entry)
    }

    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}
