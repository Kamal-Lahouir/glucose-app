import React, { useState, useEffect } from 'react'
import GlucoseForm from './components/GlucoseForm'
import GlucoseLog from './components/GlucoseLog'

const App = () => {
  const [entries, setEntries] = useState([])

  // Load entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('glucoseEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('glucoseEntries', JSON.stringify(entries))
  }, [entries])

  const handleSubmit = (entry) => {
    setEntries(prevEntries => [entry, ...prevEntries])
  }

  const handleDelete = (id) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Glucose Tracker</h1>
        <p>Track and manage your blood glucose measurements</p>
      </header>

      <main className="app-main">
        <GlucoseForm onSubmit={handleSubmit} />
        <GlucoseLog entries={entries} onDelete={handleDelete} />
      </main>
    </div>
  )
}

export default App
