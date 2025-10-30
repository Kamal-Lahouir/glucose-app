import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

const GlucoseVisualization = ({ entries, users, selectedUser }) => {
  const [dateRange, setDateRange] = useState('7') // days
  const [showAllUsers, setShowAllUsers] = useState(false)

  // Filter entries based on selected user and date range
  const filteredEntries = useMemo(() => {
    let filtered = entries

    // Filter by user
    if (!showAllUsers && selectedUser) {
      filtered = filtered.filter(entry => entry.userId === selectedUser.id)
    }

    // Filter by date range
    const now = new Date()
    const rangeDate = new Date(now.getTime() - dateRange * 24 * 60 * 60 * 1000)
    filtered = filtered.filter(entry => new Date(entry.timestamp) >= rangeDate)

    // Sort by timestamp
    return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [entries, selectedUser, dateRange, showAllUsers])

  // Calculate statistics
  const statistics = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 }
    }

    const measurements = filteredEntries.map(e => e.measurement)
    const sum = measurements.reduce((acc, val) => acc + val, 0)
    const avg = sum / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)

    return {
      avg: avg.toFixed(1),
      min: min.toFixed(1),
      max: max.toFixed(1),
      count: filteredEntries.length
    }
  }, [filteredEntries])

  // Prepare data for trend chart
  const trendData = useMemo(() => {
    return filteredEntries.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      glucose: entry.measurement,
      timePeriod: entry.timePeriod
    }))
  }, [filteredEntries])

  // Prepare data for time period averages
  const timePeriodData = useMemo(() => {
    const periods = {
      'before-breakfast': { name: 'Before Breakfast', total: 0, count: 0 },
      'after-breakfast': { name: 'After Breakfast', total: 0, count: 0 },
      'before-lunch': { name: 'Before Lunch', total: 0, count: 0 },
      'after-lunch': { name: 'After Lunch', total: 0, count: 0 },
      'before-dinner': { name: 'Before Dinner', total: 0, count: 0 },
      'after-dinner': { name: 'After Dinner', total: 0, count: 0 }
    }

    filteredEntries.forEach(entry => {
      if (periods[entry.timePeriod]) {
        periods[entry.timePeriod].total += entry.measurement
        periods[entry.timePeriod].count += 1
      }
    })

    return Object.values(periods)
      .filter(p => p.count > 0)
      .map(p => ({
        name: p.name,
        average: parseFloat((p.total / p.count).toFixed(1)),
        count: p.count
      }))
  }, [filteredEntries])

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Unknown'
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.date}</p>
          <p className="tooltip-value">Glucose: {payload[0].value} mg/dL</p>
          <p className="tooltip-period">{payload[0].payload.timePeriod?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
        </div>
      )
    }
    return null
  }

  if (!selectedUser && !showAllUsers) {
    return (
      <div className="visualization-container">
        <div className="no-data">
          <p>Select a user to view visualizations</p>
        </div>
      </div>
    )
  }

  if (filteredEntries.length === 0) {
    return (
      <div className="visualization-container">
        <div className="no-data">
          <p>No data available for the selected time range</p>
        </div>
      </div>
    )
  }

  return (
    <div className="visualization-container">
      <div className="visualization-header">
        <h2>Glucose Insights</h2>
        <div className="visualization-controls">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showAllUsers}
              onChange={(e) => setShowAllUsers(e.target.checked)}
            />
            Show all users
          </label>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{statistics.avg}</div>
          <div className="stat-label">Average (mg/dL)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statistics.min}</div>
          <div className="stat-label">Minimum (mg/dL)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statistics.max}</div>
          <div className="stat-label">Maximum (mg/dL)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{statistics.count}</div>
          <div className="stat-label">Total Readings</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="chart-container">
        <h3>Glucose Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Glucose (mg/dL)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#10b981" strokeDasharray="3 3" label="Low" />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label="Target" />
            <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label="High" />
            <Line
              type="monotone"
              dataKey="glucose"
              stroke="#667eea"
              strokeWidth={2}
              dot={{ fill: '#667eea', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Period Averages */}
      {timePeriodData.length > 0 && (
        <div className="chart-container">
          <h3>Average by Time of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timePeriodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ value: 'Average Glucose (mg/dL)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Bar dataKey="average" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Target Ranges Info */}
      <div className="target-info">
        <h3>Target Ranges</h3>
        <div className="target-ranges">
          <div className="range-item low">
            <span className="range-dot"></span>
            <span>Low: Below 70 mg/dL</span>
          </div>
          <div className="range-item normal">
            <span className="range-dot"></span>
            <span>Normal: 70-140 mg/dL</span>
          </div>
          <div className="range-item high">
            <span className="range-dot"></span>
            <span>High: Above 140 mg/dL</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlucoseVisualization
