import React, { useState } from 'react'

const GlucoseForm = ({ onSubmit }) => {
  const [name, setName] = useState('')
  const [measurement, setMeasurement] = useState('')
  const [timePeriod, setTimePeriod] = useState('before-breakfast')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !measurement) {
      alert('Please fill in all fields')
      return
    }

    const entry = {
      id: Date.now(),
      name,
      measurement: parseFloat(measurement),
      timePeriod,
      timestamp: new Date().toISOString()
    }

    onSubmit(entry)

    // Reset form
    setName('')
    setMeasurement('')
    setTimePeriod('before-breakfast')
  }

  return (
    <div className="glucose-form">
      <h2>Add Glucose Measurement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name/File:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name or identifier"
            required
          />
        </div>

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
          />
        </div>

        <div className="form-group">
          <label htmlFor="timePeriod">Time Period:</label>
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="before-breakfast">Before Breakfast</option>
            <option value="after-breakfast">After Breakfast</option>
            <option value="before-lunch">Before Lunch</option>
            <option value="after-lunch">After Lunch</option>
            <option value="before-dinner">Before Dinner</option>
            <option value="after-dinner">After Dinner</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">Submit Measurement</button>
      </form>
    </div>
  )
}

export default GlucoseForm
