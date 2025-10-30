import React, { useState, useEffect } from 'react'
import GlucoseForm from './components/GlucoseForm'
import GlucoseLog from './components/GlucoseLog'
import UserManager from './components/UserManager'
import CSVImport from './components/CSVImport'
import GlucoseVisualization from './components/GlucoseVisualization'
import Auth from './components/Auth'
import {
  onAuthChange,
  logOut,
  getUsers,
  getEntries,
  saveUser,
  saveEntry,
  deleteEntry as deleteEntryFromDb,
  syncLocalToCloud
} from './firebase/firebaseService'

const App = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [entries, setEntries] = useState([])
  const [activeTab, setActiveTab] = useState('data') // 'data' or 'visualization'
  const [syncStatus, setSyncStatus] = useState('') // '', 'syncing', 'synced', 'error'

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user)
      setAuthLoading(false)

      if (user) {
        // User is signed in, load their data from Firebase
        await loadDataFromFirebase(user.uid)
      } else {
        // User is signed out, clear data
        setUsers([])
        setEntries([])
        setSelectedUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadDataFromFirebase = async (accountId) => {
    setDataLoading(true)
    try {
      // Check if there's local data to migrate
      const localUsers = localStorage.getItem('glucoseUsers')
      const localEntries = localStorage.getItem('glucoseEntries')

      if (localUsers || localEntries) {
        // Migrate local data to cloud
        const usersData = localUsers ? JSON.parse(localUsers) : []
        const entriesData = localEntries ? JSON.parse(localEntries) : []

        if (usersData.length > 0 || entriesData.length > 0) {
          setSyncStatus('syncing')
          await syncLocalToCloud(accountId, usersData, entriesData)

          // Clear localStorage after successful migration
          localStorage.removeItem('glucoseUsers')
          localStorage.removeItem('glucoseEntries')
          localStorage.removeItem('selectedUserId')
        }
      }

      // Load data from Firebase
      const { users: loadedUsers } = await getUsers(accountId)
      const { entries: loadedEntries } = await getEntries(accountId)

      setUsers(loadedUsers)
      setEntries(loadedEntries)

      // Restore selected user if any
      const storedSelectedUserId = localStorage.getItem('selectedUserId')
      if (storedSelectedUserId && loadedUsers.length > 0) {
        const user = loadedUsers.find(u => u.id === parseInt(storedSelectedUserId))
        if (user) setSelectedUser(user)
      }

      setSyncStatus('synced')
      setTimeout(() => setSyncStatus(''), 2000)
    } catch (error) {
      console.error('Error loading data from Firebase:', error)
      setSyncStatus('error')
    } finally {
      setDataLoading(false)
    }
  }

  // Save selected user to localStorage
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('selectedUserId', selectedUser.id.toString())
    }
  }, [selectedUser])

  const handleAddUser = async (user) => {
    setUsers(prevUsers => [...prevUsers, user])
    setSelectedUser(user)

    if (currentUser) {
      setSyncStatus('syncing')
      await saveUser(user.id, currentUser.uid, user)
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus(''), 2000)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  const handleSubmit = async (entry) => {
    setEntries(prevEntries => [entry, ...prevEntries])

    if (currentUser) {
      setSyncStatus('syncing')
      await saveEntry(currentUser.uid, entry.id, entry)
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus(''), 2000)
    }
  }

  const handleDelete = async (id) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))

    if (currentUser) {
      setSyncStatus('syncing')
      await deleteEntryFromDb(currentUser.uid, id)
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus(''), 2000)
    }
  }

  const isDuplicate = (newEntry, existingEntry) => {
    const timeDiff = Math.abs(
      new Date(newEntry.timestamp).getTime() - new Date(existingEntry.timestamp).getTime()
    )
    return timeDiff < 60000 &&
           newEntry.measurement === existingEntry.measurement &&
           newEntry.userId === existingEntry.userId
  }

  const handleCSVImport = async (importedEntries) => {
    let imported = 0
    let duplicates = 0

    setSyncStatus('syncing')

    for (const newEntry of importedEntries) {
      newEntry.userId = selectedUser.id

      const isDupe = entries.some(existingEntry => isDuplicate(newEntry, existingEntry))

      if (!isDupe) {
        setEntries(prevEntries => [...prevEntries, newEntry])

        if (currentUser) {
          await saveEntry(currentUser.uid, newEntry.id, newEntry)
        }

        imported++
      } else {
        duplicates++
      }
    }

    setSyncStatus('synced')
    setTimeout(() => setSyncStatus(''), 2000)

    return { imported, duplicates }
  }

  const handleLogout = async () => {
    await logOut()
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Show auth screen if not logged in
  if (!currentUser) {
    return <Auth onAuthSuccess={(user) => setCurrentUser(user)} />
  }

  // Show main app if logged in
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Glucose Tracker</h1>
            <p>Track and manage your blood glucose measurements</p>
          </div>
          <div className="header-actions">
            {syncStatus && (
              <span className={`sync-status ${syncStatus}`}>
                {syncStatus === 'syncing' && '⟳ Syncing...'}
                {syncStatus === 'synced' && '✓ Synced'}
                {syncStatus === 'error' && '✗ Sync Error'}
              </span>
            )}
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {dataLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your data...</p>
        </div>
      ) : (
        <>
          <UserManager
            users={users}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            onAddUser={handleAddUser}
          />

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data Entry & Logs
            </button>
            <button
              className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
              onClick={() => setActiveTab('visualization')}
            >
              Visualizations & Insights
            </button>
          </div>

          <main className="app-main">
            {activeTab === 'data' ? (
              <>
                <div className="left-panel">
                  <GlucoseForm selectedUser={selectedUser} onSubmit={handleSubmit} />
                  <CSVImport selectedUser={selectedUser} onImport={handleCSVImport} />
                </div>
                <GlucoseLog entries={entries} users={users} onDelete={handleDelete} />
              </>
            ) : (
              <GlucoseVisualization
                entries={entries}
                users={users}
                selectedUser={selectedUser}
              />
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App
