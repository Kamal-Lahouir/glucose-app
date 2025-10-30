import React, { useState } from 'react'

const CSVImport = ({ selectedUser, onImport }) => {
  const [importing, setImporting] = useState(false)

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid')
    }

    const headers = lines[0].split(',')
    const entries = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')

      if (values.length < 3) continue // Skip invalid lines

      const dateTime = values[0]?.trim()
      const timePeriod = values[1]?.trim()
      const bloodSugar = values[2]?.trim()
      const unit = values[3]?.trim()

      // Parse medications if present
      const medication1 = values[4]?.trim()
      const medication1Units = values[5]?.trim()
      const medication2 = values[6]?.trim()
      const medication2Units = values[7]?.trim()
      const medication3 = values[8]?.trim()
      const medication3Units = values[9]?.trim()

      if (!dateTime || !bloodSugar) continue

      // Convert time period to our format
      const timePeriodMap = {
        'Before Breakfast': 'before-breakfast',
        'After Breakfast': 'after-breakfast',
        'Before Lunch': 'before-lunch',
        'After Lunch': 'after-lunch',
        'Before Dinner': 'before-dinner',
        'After Dinner': 'after-dinner'
      }

      const entry = {
        id: Date.now() + i, // Temporary ID, will be updated to avoid duplicates
        measurement: parseFloat(bloodSugar),
        timePeriod: timePeriodMap[timePeriod] || 'before-breakfast',
        timestamp: new Date(dateTime).toISOString(),
        medications: []
      }

      // Add medications if they exist
      if (medication1 && parseFloat(medication1Units) > 0) {
        entry.medications.push({
          name: medication1,
          units: parseFloat(medication1Units)
        })
      }
      if (medication2 && parseFloat(medication2Units) > 0) {
        entry.medications.push({
          name: medication2,
          units: parseFloat(medication2Units)
        })
      }
      if (medication3 && parseFloat(medication3Units) > 0) {
        entry.medications.push({
          name: medication3,
          units: parseFloat(medication3Units)
        })
      }

      entries.push(entry)
    }

    return entries
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!selectedUser) {
      alert('Please select a user first')
      event.target.value = ''
      return
    }

    setImporting(true)

    try {
      const text = await file.text()
      const entries = parseCSV(text)

      if (entries.length === 0) {
        alert('No valid entries found in CSV file')
        return
      }

      const result = onImport(entries)
      alert(`Successfully imported ${result.imported} entries. ${result.duplicates} duplicates were skipped.`)
    } catch (error) {
      alert(`Error importing CSV: ${error.message}`)
      console.error('CSV Import Error:', error)
    } finally {
      setImporting(false)
      event.target.value = '' // Reset file input
    }
  }

  return (
    <div className="csv-import">
      <label htmlFor="csv-upload" className="btn-import">
        {importing ? 'Importing...' : 'Import CSV'}
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={!selectedUser || importing}
        style={{ display: 'none' }}
      />
      {!selectedUser && (
        <p className="import-hint">Select a user to enable CSV import</p>
      )}
    </div>
  )
}

export default CSVImport
