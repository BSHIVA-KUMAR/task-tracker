import './Task.css'
import { EditIcon, DeleteIcon } from './Icons'

function Task({ 
  task, 
  editingId, 
  editName, 
  editDescription, 
  onStartEdit, 
  onEditNameChange,
  onEditDescriptionChange,
  onSaveEdit, 
  onCancelEdit, 
  onEditKeyPress,
  onCompleteClick,
  onDeleteClick 
}) {
  const isEditing = editingId === task.id

  return (
    <tr className={`task-row ${task.status.toLowerCase()}`}>
      {isEditing ? (
        <>
          <td colSpan="6" className="edit-mode-cell">
            <div className="edit-mode">
              <input
                type="text"
                className="edit-input"
                value={editName}
                onChange={onEditNameChange}
                onKeyDown={(e) => onEditKeyPress(e, task.id)}
                placeholder="Task Name"
                autoFocus
              />
              <input
                type="text"
                className="edit-input"
                value={editDescription}
                onChange={onEditDescriptionChange}
                onKeyDown={(e) => onEditKeyPress(e, task.id)}
                placeholder="Task Description"
              />
              <div className="edit-actions">
                <button
                  className="save-button"
                  onClick={() => onSaveEdit(task.id)}
                  disabled={!editName.trim()}
                >
                  Save
                </button>
                <button
                  className="cancel-button"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="task-name-cell">
            <span className="task-name">{task.name}</span>
          </td>
          <td className="task-description-cell">
            <span className="task-description">{task.description || '-'}</span>
          </td>
          <td className="task-status-cell">
            <span className={`task-status ${task.status.toLowerCase()}`}>
              {task.status}
            </span>
          </td>
          <td className="task-edit-cell">
            <button
              className="edit-button"
              onClick={() => onStartEdit(task)}
              title="Edit task"
            >
              <EditIcon className="icon" />
            </button>
          </td>
          <td className="task-action-cell">
            {task.status === 'Pending' && (
              <button
                className="complete-button"
                onClick={() => onCompleteClick(task)}
                title="Mark as completed"
              >
                Complete task
              </button>
            )}
          </td>
          <td className="task-delete-cell">
            <button
              className="delete-button"
              onClick={() => onDeleteClick(task)}
              title="Delete task"
            >
              <DeleteIcon className="icon" />
            </button>
          </td>
        </>
      )}
    </tr>
  )
}

export default Task

