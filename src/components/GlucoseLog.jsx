import React from 'react'
import * as XLSX from 'xlsx'

const GlucoseLog = ({ entries, onDelete }) => {
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

  const exportToExcel = () => {
    if (entries.length === 0) {
      alert('No data to export')
      return
    }

    // Prepare data for Excel
    const excelData = entries.map(entry => ({
      'Name': entry.name,
      'Glucose Level (mg/dL)': entry.measurement,
      'Time Period': formatTimePeriod(entry.timePeriod),
      'Date & Time': formatDate(entry.timestamp)
    }))

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
        <button onClick={exportToExcel} className="btn-export">
          Export to Excel
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="no-entries">No measurements recorded yet.</p>
      ) : (
        <div className="log-entries">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Glucose Level (mg/dL)</th>
                <th>Time Period</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>{entry.measurement}</td>
                  <td>{formatTimePeriod(entry.timePeriod)}</td>
                  <td>{formatDate(entry.timestamp)}</td>
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
