import { useState } from 'react'
import Task from './components/Task'
import './App.css'

function App() {
  // Mock tasks with initial data
  const initialTasks = [
    {
      id: '1',
      name: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the new feature including API endpoints and user guides',
      status: 'Pending',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Review Code Pull Requests',
      description: 'Review and provide feedback on 3 pending pull requests from the team members',
      status: 'Pending',
      createdAt: new Date('2024-01-16')
    },
    {
      id: '3',
      name: 'Update Database Schema',
      description: 'Add new columns to user table and migrate existing data',
      status: 'Completed',
      createdAt: new Date('2024-01-14')
    },
    {
      id: '4',
      name: 'Prepare Presentation Slides',
      description: 'Create slides for the quarterly review meeting with stakeholders',
      status: 'Pending',
      createdAt: new Date('2024-01-17')
    },
    {
      id: '5',
      name: 'Fix Bug in Login System',
      description: 'Resolve authentication issue where users cannot login with special characters in password',
      status: 'Pending',
      createdAt: new Date('2024-01-18')
    }
  ]

  const [tasks, setTasks] = useState(initialTasks)
  const [taskInput, setTaskInput] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [addTaskModal, setAddTaskModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [completeModal, setCompleteModal] = useState({ show: false, taskId: null })
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null, taskName: '' })
  const [historyModal, setHistoryModal] = useState(false)
  const [taskHistory, setTaskHistory] = useState([])

  // Generate unique ID for tasks
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

  // Open add task modal
  const handleOpenAddModal = () => {
    setAddTaskModal(true)
  }

  // Close add task modal
  const handleCloseAddModal = () => {
    setAddTaskModal(false)
    setTaskInput('')
    setTaskDescription('')
  }

  // Add a new task
  const handleAddTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        id: generateId(),
        name: taskInput.trim(),
        description: taskDescription.trim(),
        status: 'Pending',
        createdAt: new Date()
      }
      setTasks([...tasks, newTask])
      setTaskInput('')
      setTaskDescription('')
      setAddTaskModal(false)
    }
  }

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingId(task.id)
    setEditName(task.name)
    setEditDescription(task.description || '')
  }

  // Handle edit input changes
  const handleEditNameChange = (e) => {
    setEditName(e.target.value)
  }

  const handleEditDescriptionChange = (e) => {
    setEditDescription(e.target.value)
  }

  // Save edited task
  const handleSaveEdit = (taskId) => {
    if (editName.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, name: editName.trim(), description: editDescription.trim() } : task
      ))
      setEditingId(null)
      setEditName('')
      setEditDescription('')
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditDescription('')
  }

  // Show complete confirmation modal
  const handleCompleteClick = (task) => {
    setCompleteModal({ show: true, taskId: task.id })
  }

  // Confirm task completion
  const handleConfirmComplete = () => {
    const updatedTask = tasks.find(task => task.id === completeModal.taskId)
    setTasks(tasks.map(task =>
      task.id === completeModal.taskId ? { ...task, status: 'Completed' } : task
    ))
    // Add to history when task is completed
    if (updatedTask) {
      setTaskHistory([...taskHistory, { ...updatedTask, status: 'Completed', completedAt: new Date() }])
    }
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

  // Clear all completed tasks
  const handleClearCompleted = () => {
    const completedTasks = tasks.filter(task => task.status === 'Completed')
    // Add completed tasks to history before removing
    setTaskHistory([...taskHistory, ...completedTasks])
    setTasks(tasks.filter(task => task.status !== 'Completed'))
  }

  // Show history modal
  const handleShowHistory = () => {
    setHistoryModal(true)
  }

  // Close history modal
  const handleCloseHistory = () => {
    setHistoryModal(false)
  }

  // Handle Enter key in add task modal
  const handleAddModalKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddTask()
    } else if (e.key === 'Escape') {
      handleCloseAddModal()
    }
  }

  // Handle Enter key in edit input
  const handleEditKeyPress = (e, taskId) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveEdit(taskId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header-section">
          <h1 className="title">Task Tracker</h1>
          <div className="header-buttons">
            <button 
              className="add-task-button"
              onClick={handleOpenAddModal}
            >
              + Add New Task
            </button>
            <button 
              className="clear-completed-button"
              onClick={handleClearCompleted}
              disabled={!tasks.some(task => task.status === 'Completed')}
            >
              Clear Completed Tasks
            </button>
            <button 
              className="history-button"
              onClick={handleShowHistory}
              disabled={taskHistory.length === 0 && !tasks.some(task => task.status === 'Completed')}
            >
              History of Completed Tasks
            </button>
          </div>
        </div>

        {/* Tagline */}
        <div className="tagline-section">
          <p className="tagline-text">
            Task tracker - an advanced way to track your Works and Schedule events
          </p>
        </div>

        {/* Tasks Table */}
        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add a task to get started!</p>
            </div>
          ) : (
            <table className="tasks-table">
              <thead>
                <tr className="tasks-header">
                  <th className="header-task">Task</th>
                  <th className="header-description">Description</th>
                  <th className="header-status">Status</th>
                  <th className="header-edit">Edit</th>
                  <th className="header-action">Action</th>
                  <th className="header-delete">Delete</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    editingId={editingId}
                    editName={editName}
                    editDescription={editDescription}
                    onStartEdit={handleStartEdit}
                    onEditNameChange={handleEditNameChange}
                    onEditDescriptionChange={handleEditDescriptionChange}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onEditKeyPress={handleEditKeyPress}
                    onCompleteClick={handleCompleteClick}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </tbody>
            </table>
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

        {/* Add Task Modal */}
        {addTaskModal && (
          <div className="modal-overlay" onClick={handleCloseAddModal}>
            <div className="modal-content add-task-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Add New Task</h3>
              <div className="modal-input-group">
                <div className="modal-input-wrapper">
                  <label htmlFor="modalTaskName" className="modal-label">
                    Task Name
                  </label>
                  <input
                    type="text"
                    id="modalTaskName"
                    className="modal-input"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={handleAddModalKeyPress}
                    placeholder="Enter task name"
                    autoFocus
                  />
                </div>
                <div className="modal-input-wrapper">
                  <label htmlFor="modalTaskDescription" className="modal-label">
                    Task Description
                  </label>
                  <input
                    type="text"
                    id="modalTaskDescription"
                    className="modal-input"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    onKeyDown={handleAddModalKeyPress}
                    placeholder="Enter task description"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  className="add-button-modal" 
                  onClick={handleAddTask}
                  disabled={!taskInput.trim()}
                >
                  Add Task
                </button>
                <button className="cancel-button" onClick={handleCloseAddModal}>
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

        {/* History Modal */}
        {historyModal && (
          <div className="modal-overlay" onClick={handleCloseHistory}>
            <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
              <h3>History of Completed Tasks</h3>
              <div className="history-content">
                {(() => {
                  const currentCompleted = tasks.filter(task => task.status === 'Completed')
                  const allHistory = [...currentCompleted, ...taskHistory]
                  // Remove duplicates based on task id
                  const uniqueHistory = allHistory.filter((task, index, self) =>
                    index === self.findIndex(t => t.id === task.id)
                  )
                  
                  if (uniqueHistory.length === 0) {
                    return <p className="no-history">No completed tasks in history yet.</p>
                  }
                  
                  return (
                    <div className="history-list">
                      {uniqueHistory.map((task) => (
                        <div key={`history-${task.id}`} className="history-item">
                          <div className="history-item-info">
                            <span className="history-task-name">{task.name}</span>
                            {task.description && (
                              <span className="history-task-description">{task.description}</span>
                            )}
                          </div>
                          <span className="history-status completed">Completed</span>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={handleCloseHistory}>
                  Close
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
