import React, { useState } from 'react'
import * as XLSX from 'xlsx'

const GlucoseLog = ({ entries, users, onDelete }) => {
  const [filterUserId, setFilterUserId] = useState('all')

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimePeriod = (period) => {
    return period.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Unknown'
  }

  const filteredEntries = filterUserId === 'all'
    ? entries
    : entries.filter(entry => entry.userId === parseInt(filterUserId))

  const exportToExcel = () => {
    if (filteredEntries.length === 0) {
      alert('No data to export')
      return
    }

    // Prepare data for Excel
    const excelData = filteredEntries.map(entry => {
      const row = {
        'User': getUserName(entry.userId),
        'Date and Time': formatDate(entry.timestamp),
        'Time of the Day': formatTimePeriod(entry.timePeriod),
        'Blood Sugar Value': entry.measurement,
        'Measurement Unit': 'mg/dL'
      }

      // Add medications if present
      if (entry.medications && entry.medications.length > 0) {
        entry.medications.forEach((med, idx) => {
          row[`Medication ${idx + 1}`] = med.name
          row[`Medication ${idx + 1} Units`] = med.units
        })
      }

      return row
    })

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Glucose Measurements')

    // Generate filename with current date
    const filename = `glucose-log-${new Date().toISOString().split('T')[0]}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(id)
    }
  }

  return (
    <div className="glucose-log">
      <div className="log-header">
        <h2>Glucose Log</h2>
        <div className="log-controls">
          <select
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="user-filter"
          >
            <option value="all">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button onClick={exportToExcel} className="btn-export">
            Export to Excel
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="no-entries">No measurements recorded yet.</p>
      ) : (
        <div className="log-entries">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Glucose Level (mg/dL)</th>
                <th>Time Period</th>
                <th>Date & Time</th>
                <th>Medications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{getUserName(entry.userId)}</td>
                  <td>{entry.measurement}</td>
                  <td>{formatTimePeriod(entry.timePeriod)}</td>
                  <td>{formatDate(entry.timestamp)}</td>
                  <td>
                    {entry.medications && entry.medications.length > 0 ? (
                      <div className="medications-cell">
                        {entry.medications.map((med, idx) => (
                          <div key={idx} className="medication-item">
                            {med.name}: {med.units}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="no-meds">—</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default GlucoseLog
