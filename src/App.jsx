import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [completeModal, setCompleteModal] = useState({ show: false, taskId: null })
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null, taskName: '' })

  // Generate unique ID for tasks
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

  // Add a new task
  const handleAddTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        id: generateId(),
        name: taskInput.trim(),
        status: 'Pending',
        createdAt: new Date()
      }
      setTasks([...tasks, newTask])
      setTaskInput('')
    }
  }

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingId(task.id)
    setEditValue(task.name)
  }

  // Save edited task
  const handleSaveEdit = (taskId) => {
    if (editValue.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, name: editValue.trim() } : task
      ))
      setEditingId(null)
      setEditValue('')
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  // Show complete confirmation modal
  const handleCompleteClick = (task) => {
    setCompleteModal({ show: true, taskId: task.id })
  }

  // Confirm task completion
  const handleConfirmComplete = () => {
    setTasks(tasks.map(task =>
      task.id === completeModal.taskId ? { ...task, status: 'Completed' } : task
    ))
    setCompleteModal({ show: false, taskId: null })
  }

  // Cancel completion
  const handleCancelComplete = () => {
    setCompleteModal({ show: false, taskId: null })
  }

  // Show delete confirmation modal
  const handleDeleteClick = (task) => {
    setDeleteModal({ show: true, taskId: task.id, taskName: task.name })
  }

  // Confirm task deletion
  const handleConfirmDelete = () => {
    setTasks(tasks.filter(task => task.id !== deleteModal.taskId))
    setDeleteModal({ show: false, taskId: null, taskName: '' })
  }

  // Cancel deletion
  const handleCancelDelete = () => {
    setDeleteModal({ show: false, taskId: null, taskName: '' })
  }

  // Handle Enter key in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  // Handle Enter key in edit input
  const handleEditKeyPress = (e, taskId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(taskId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Task Tracker</h1>
        
        {/* Add Task Section */}
        <div className="add-task-section">
          <div className="input-wrapper">
            <input
              type="text"
              id="taskInput"
              className="task-input"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=" "
            />
            <label htmlFor="taskInput" className="floating-label">
              Add a new task
            </label>
          </div>
          <button 
            className="add-button"
            onClick={handleAddTask}
            disabled={!taskInput.trim()}
          >
            Add Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add a task to get started!</p>
            </div>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.status.toLowerCase()}`}>
                  <div className="task-content">
                    {editingId === task.id ? (
                      <div className="edit-mode">
                        <input
                          type="text"
                          className="edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button
                            className="save-button"
                            onClick={() => handleSaveEdit(task.id)}
                            disabled={!editValue.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-button"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-info">
                          <span className="task-name">{task.name}</span>
                          <span className={`task-status ${task.status.toLowerCase()}`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="task-actions">
                          {task.status === 'Pending' && (
                            <button
                              className="complete-button"
                              onClick={() => handleCompleteClick(task)}
                              title="Mark as completed"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            className="edit-button"
                            onClick={() => handleStartEdit(task)}
                            title="Edit task"
                          >
                            ✎
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteClick(task)}
                            title="Delete task"
                          >
                            🗑
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Complete Task Modal */}
        {completeModal.show && (
          <div className="modal-overlay" onClick={handleCancelComplete}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Complete Task</h3>
              <p>Do you want to mark this task as completed?</p>
              <div className="modal-actions">
                <button className="confirm-button" onClick={handleConfirmComplete}>
                  Complete
                </button>
                <button className="cancel-button" onClick={handleCancelComplete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Task Modal */}
        {deleteModal.show && (
          <div className="modal-overlay" onClick={handleCancelDelete}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Task</h3>
              <p>Do you want to delete task <strong>"{deleteModal.taskName}"</strong>?</p>
              <div className="modal-actions">
                <button className="delete-confirm-button" onClick={handleConfirmDelete}>
                  Delete
                </button>
                <button className="cancel-button" onClick={handleCancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
