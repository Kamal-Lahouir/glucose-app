import React, { useState, useEffect } from 'react'
import GlucoseForm from './components/GlucoseForm'
import GlucoseLog from './components/GlucoseLog'
import UserManager from './components/UserManager'
import CSVImport from './components/CSVImport'

const App = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [entries, setEntries] = useState([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('glucoseUsers')
    const storedEntries = localStorage.getItem('glucoseEntries')
    const storedSelectedUserId = localStorage.getItem('selectedUserId')

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      setUsers(parsedUsers)

      // Restore selected user
      if (storedSelectedUserId) {
        const user = parsedUsers.find(u => u.id === parseInt(storedSelectedUserId))
        if (user) setSelectedUser(user)
      }
    }

    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('glucoseUsers', JSON.stringify(users))
  }, [users])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('glucoseEntries', JSON.stringify(entries))
  }, [entries])

  // Save selected user to localStorage
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('selectedUserId', selectedUser.id.toString())
    }
  }, [selectedUser])

  const handleAddUser = (user) => {
    setUsers(prevUsers => [...prevUsers, user])
    setSelectedUser(user)
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  const handleSubmit = (entry) => {
    setEntries(prevEntries => [entry, ...prevEntries])
  }

  const handleDelete = (id) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
  }

  const isDuplicate = (newEntry, existingEntry) => {
    // Check if entries are duplicates based on timestamp and measurement
    const timeDiff = Math.abs(
      new Date(newEntry.timestamp).getTime() - new Date(existingEntry.timestamp).getTime()
    )
    // Consider duplicates if within 1 minute and same measurement
    return timeDiff < 60000 &&
           newEntry.measurement === existingEntry.measurement &&
           newEntry.userId === existingEntry.userId
  }

  const handleCSVImport = (importedEntries) => {
    let imported = 0
    let duplicates = 0

    importedEntries.forEach(newEntry => {
      // Add userId to imported entry
      newEntry.userId = selectedUser.id

      // Check for duplicates
      const isDupe = entries.some(existingEntry => isDuplicate(newEntry, existingEntry))

      if (!isDupe) {
        setEntries(prevEntries => [...prevEntries, newEntry])
        imported++
      } else {
        duplicates++
      }
    })

    return { imported, duplicates }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Glucose Tracker</h1>
        <p>Track and manage your blood glucose measurements</p>
      </header>

      <UserManager
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
      />

      <main className="app-main">
        <div className="left-panel">
          <GlucoseForm selectedUser={selectedUser} onSubmit={handleSubmit} />
          <CSVImport selectedUser={selectedUser} onImport={handleCSVImport} />
        </div>
        <GlucoseLog entries={entries} users={users} onDelete={handleDelete} />
      </main>
    </div>
  )
}

export default App
