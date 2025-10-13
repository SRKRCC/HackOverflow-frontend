import { useState, useEffect } from 'react';
import { useAdminStore } from '../../lib/stores/admin';
import { useAuth } from '../../lib/hooks';

const TasksPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    tasks, 
    loading, 
    error,
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useAdminStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    round_num: 1,
    points: 10
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchTasks();
    }
  }, [isAuthenticated, user, fetchTasks]);

  const handleCreateTask = async () => {
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '', round_num: 1, points: 10 });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      await updateTask(taskId, updates);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                value={newTask.points}
                onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Round Number</label>
              <input
                type="number"
                value={newTask.round_num}
                onChange={(e) => setNewTask({ ...newTask, round_num: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Task description"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCreateTask}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={!newTask.title || !newTask.description}
            >
              Create Task
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed ? 'bg-green-100 text-green-800' :
                    task.in_review ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id.toString())}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>Round {task.round_num} • {task.points} points</span>
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
              </div>
              {!task.completed && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleTaskUpdate(task.id.toString(), { in_review: !task.in_review })}
                    className={`px-3 py-1 rounded text-sm ${
                      task.in_review 
                        ? 'bg-gray-500 text-white hover:bg-gray-600' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {task.in_review ? 'Remove from Review' : 'Mark for Review'}
                  </button>
                  <button 
                    onClick={() => handleTaskUpdate(task.id.toString(), { completed: true })}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tasks available. Create your first task!
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;