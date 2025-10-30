import React, { useState } from 'react'

const GlucoseForm = ({ selectedUser, onSubmit }) => {
  const [measurement, setMeasurement] = useState('')
  const [timePeriod, setTimePeriod] = useState('before-breakfast')
  const [showMedications, setShowMedications] = useState(false)
  const [medications, setMedications] = useState([
    { name: '', units: '' }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedUser) {
      alert('Please select a user first')
      return
    }

    if (!measurement) {
      alert('Please enter a glucose measurement')
      return
    }

    const entry = {
      id: Date.now(),
      userId: selectedUser.id,
      measurement: parseFloat(measurement),
      timePeriod,
      timestamp: new Date().toISOString(),
      medications: medications.filter(m => m.name && m.units)
    }

    onSubmit(entry)

    // Reset form
    setMeasurement('')
    setTimePeriod('before-breakfast')
    setMedications([{ name: '', units: '' }])
    setShowMedications(false)
  }

  const addMedication = () => {
    setMedications([...medications, { name: '', units: '' }])
  }

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index, field, value) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  return (
    <div className="glucose-form">
      <h2>Add Glucose Measurement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="measurement">Glucose Level (mg/dL):</label>
          <input
            type="number"
            id="measurement"
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
            placeholder="Enter measurement"
            step="0.1"
            required
            disabled={!selectedUser}
          />
        </div>

        <div className="form-group">
          <label htmlFor="timePeriod">Time Period:</label>
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            disabled={!selectedUser}
          >
            <option value="before-breakfast">Before Breakfast</option>
            <option value="after-breakfast">After Breakfast</option>
            <option value="before-lunch">Before Lunch</option>
            <option value="after-lunch">After Lunch</option>
            <option value="before-dinner">Before Dinner</option>
            <option value="after-dinner">After Dinner</option>
          </select>
        </div>

        <div className="medications-section">
          <button
            type="button"
            className="btn-toggle-medications"
            onClick={() => setShowMedications(!showMedications)}
            disabled={!selectedUser}
          >
            {showMedications ? 'Hide' : 'Add'} Medications (Optional)
          </button>

          {showMedications && (
            <div className="medications-list">
              {medications.map((med, index) => (
                <div key={index} className="medication-row">
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Units"
                    value={med.units}
                    onChange={(e) => updateMedication(index, 'units', e.target.value)}
                    step="0.1"
                  />
                  {medications.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-med"
                      onClick={() => removeMedication(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {medications.length < 3 && (
                <button
                  type="button"
                  className="btn-add-medication"
                  onClick={addMedication}
                >
                  + Add Another Medication
                </button>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={!selectedUser}>
          Submit Measurement
        </button>
        {!selectedUser && (
          <p className="form-hint">Please select a user to add measurements</p>
        )}
      </form>
    </div>
  )
}

export default GlucoseForm
