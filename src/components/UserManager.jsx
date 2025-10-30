import React, { useState } from 'react'

const UserManager = ({ users, selectedUser, onSelectUser, onAddUser }) => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserName, setNewUserName] = useState('')

  const handleAddUser = (e) => {
    e.preventDefault()
    if (!newUserName.trim()) {
      alert('Please enter a user name')
      return
    }

    if (users.some(u => u.name.toLowerCase() === newUserName.toLowerCase())) {
      alert('This user already exists')
      return
    }

    const newUser = {
      id: Date.now(),
      name: newUserName.trim(),
      createdAt: new Date().toISOString()
    }

    onAddUser(newUser)
    setNewUserName('')
    setShowAddUser(false)
  }

  return (
    <div className="user-manager">
      <div className="user-selector">
        <label htmlFor="user-select">Current User:</label>
        <div className="user-controls">
          <select
            id="user-select"
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === parseInt(e.target.value))
              onSelectUser(user)
            }}
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-add-user"
            onClick={() => setShowAddUser(!showAddUser)}
          >
            + Add User
          </button>
        </div>
      </div>

      {showAddUser && (
        <div className="add-user-form">
          <form onSubmit={handleAddUser}>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              autoFocus
            />
            <div className="form-buttons">
              <button type="submit" className="btn-save">Save</button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowAddUser(false)
                  setNewUserName('')
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default UserManager
