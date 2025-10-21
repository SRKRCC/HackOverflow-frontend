"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  CheckCircle,
  Clock,
  Edit,
  Save,
  X,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react"
import { ApiService } from '../../lib/api'
import { useAuth } from '../../lib/hooks'
import type { Task, Team, CreateTaskRequest } from '../../lib/types'

export default function TeamTaskManagement() {
  const { isAuthenticated, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeSidebarTeam, setActiveSidebarTeam] = useState<string>("")
  const [darkMode] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit")
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    difficulty: 'medium',
    round_num: 1,
    points: 0,
    teamId: ''
  })

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadTasks()
      loadTeams()
    }
  }, [isAuthenticated, user])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const tasksData = await ApiService.admin.getAllTasks()
      setTasks(tasksData)
    } catch (err) {
      setError('Failed to load tasks')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTeams = async () => {
    try {
      const teamsData = await ApiService.admin.getAllTeams()
      setTeams(teamsData)
    } catch (err) {
      setError('Failed to load teams')
      console.error('Error loading teams:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusInfo = (status: Task["status"]) => {
    switch (status) {
      case "Pending":
        return {
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-900",
          icon: <Clock size={16} />,
          label: "Pending",
        }
      case "InReview":
        return {
          color: "text-purple-600 dark:text-purple-300",
          bg: "bg-purple-100 dark:bg-purple-900",
          icon: <AlertCircle size={16} />,
          label: "In Review",
        }
      case "Completed":
        return {
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900",
          icon: <CheckCircle size={16} />,
          label: "Completed",
        }
      default:
        return {
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-gray-800",
          icon: <Clock size={16} />,
          label: "Pending",
        }
    }
  }

  // Open edit modal with task data
  const openEditModal = (task: Task) => {
    setModalMode("edit")
    setSelectedTask({ ...task })
    setIsModalOpen(true)
    setSuccessMessage(false)
  }

  // Open create modal
  const openCreateModal = () => {
    setModalMode("create")
    setNewTask({
      title: '',
      description: '',
      difficulty: 'medium',
      round_num: 1,
      points: 0,
      teamId: ''
    })
    setSelectedTask(null)
    setIsModalOpen(true)
    setSuccessMessage(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  // Handle form submission for both create & update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (modalMode === "create") {
        await ApiService.admin.createTask(newTask)
        setSuccessMessage(true)
        setTimeout(() => {
          closeModal()
          loadTasks()
        }, 1200)
      } else if (selectedTask && modalMode === "edit") {
        await ApiService.admin.updateTask(selectedTask.id, {
          title: selectedTask.title,
          description: selectedTask.description,
          difficulty: selectedTask.difficulty,
          round_num: selectedTask.round_num,
          points: selectedTask.points
        })
        setSuccessMessage(true)
        setTimeout(() => {
          closeModal()
          loadTasks()
        }, 1200)
      }
    } catch (err) {
      setError('Failed to save task')
      console.error('Error saving task:', err)
    }
  }

  const handleTaskInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
    if (modalMode === "create") {
      setNewTask({
        ...newTask,
        [name]: name === "round_num" || name === "points" ? parseInt(value) || 0 : value,
      })
    } else if (selectedTask) {
      setSelectedTask({
        ...selectedTask,
        [name]: name === "round_num" || name === "points" ? parseInt(value) || 0 : value,
      } as Task)
    }
  }

  // Filtering Logic for tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "pending" && task.status === "Pending") ||
      (filterStatus === "in-review" && task.status === "InReview") ||
      (filterStatus === "completed" && task.status === "Completed")
    
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (task.team?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    
    const matchesSidebar = activeSidebarTeam
      ? task.team?.title?.toLowerCase() === activeSidebarTeam.toLowerCase()
      : true
    
    return matchesStatus && matchesSearch && matchesSidebar
  })

  const approveTask = async (id: number) => {
    try {
      await ApiService.admin.completeTask(id, 'Task approved by admin')
      await loadTasks()
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 2000)
    } catch (err) {
      setError('Failed to approve task')
      console.error('Error approving task:', err)
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#111111] shadow-lg border-r border-gray-200 dark:border-gray-800">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                className="w-full outline-none text-sm bg-transparent dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav>
            <button
              onClick={() => setActiveSidebarTeam("")}
              className={`w-full text-left px-6 py-3 hover:bg-amber-100 dark:hover:bg-amber-900 ${
                activeSidebarTeam === ""
                  ? "bg-amber-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              All Teams
            </button>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setActiveSidebarTeam(team.title)}
                className={`w-full text-left px-6 py-3 hover:bg-amber-100 dark:hover:bg-amber-900 ${
                  activeSidebarTeam === team.title
                    ? "bg-amber-600 text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {team.scc_id} - {team.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-xl">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h1 className="text-3xl font-bold">Team Task Management</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage tasks, descriptions, rounds, and status for all teams
              </p>
            </div>
          </header>

          {/* Create Task button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
            >
              Create Task
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Teams
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  All Teams
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                    filterStatus === "pending"
                      ? "bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus("in-review")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                    filterStatus === "in-review"
                      ? "bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  In Review
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                    filterStatus === "completed"
                      ? "bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-200"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tasks...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No tasks found</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const statusInfo = getStatusInfo(task.status)
                return (
                  <motion.div
                    key={task.id}
                    className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        Task ID: {task.id}
                      </span>
                      <span
                        className={`${statusInfo.bg} ${statusInfo.color} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    {task.team && (
                      <div className="mb-2">
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {task.team.title}
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    </div>

                    {/* Points and Difficulty */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                        <span>Points</span>
                        <span className="font-semibold">{task.points}</span>
                      </div>
                      {task.difficulty && (
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <span>Difficulty</span>
                          <span className="font-semibold capitalize">{task.difficulty}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                        Round {task.round_num}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDate(task.timestamp)}
                      </div>
                    </div>

                    {task.teamNotes && (
                      <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                        <strong>Team Notes:</strong> {task.teamNotes}
                      </div>
                    )}

                    {task.reviewNotes && (
                      <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                        <strong>Admin Review:</strong> {task.reviewNotes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {task.status === "InReview" && (
                        <button
                          onClick={() => approveTask(task.id)}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl flex items-center justify-center gap-2"
                        onClick={() => openEditModal(task)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Task
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Edit/Create Modal */}
          <AnimatePresence>
            {isModalOpen && (modalMode === "create" || selectedTask) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <motion.div
                  className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">
                        {modalMode === "create" ? "Create Task" : "Edit Team Task"}
                      </h3>
                      <button
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        onClick={closeModal}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {successMessage && (
                      <motion.div
                        className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-xl mb-4 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <CheckCircle className="h-5 w-5" />
                        Task saved successfully!
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {modalMode === "create" && (
                        <div className="mb-4">
                          <label className="block font-medium mb-2">Assign to Team</label>
                          <select
                            name="teamId"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                            value={newTask.teamId}
                            onChange={handleTaskInputChange}
                            required
                          >
                            <option value="">Select a team...</option>
                            {teams.map((team) => (
                              <option key={team.id} value={team.scc_id}>
                                {team.scc_id} - {team.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block font-medium mb-2">Task Title</label>
                        <input
                          name="title"
                          type="text"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                          value={modalMode === "create" ? newTask.title : selectedTask?.title || ""}
                          onChange={handleTaskInputChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block font-medium mb-2">Task Description</label>
                        <textarea
                          name="description"
                          rows={3}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                          value={modalMode === "create" ? newTask.description : selectedTask?.description || ""}
                          onChange={handleTaskInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block font-medium mb-2">Round</label>
                          <input
                            name="round_num"
                            type="number"
                            min="1"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                            value={modalMode === "create" ? newTask.round_num : selectedTask?.round_num || 1}
                            onChange={handleTaskInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-2">Points</label>
                          <input
                            name="points"
                            type="number"
                            min="0"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                            value={modalMode === "create" ? newTask.points : selectedTask?.points || 0}
                            onChange={handleTaskInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-2">Difficulty</label>
                          <select
                            name="difficulty"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                            value={modalMode === "create" ? newTask.difficulty : selectedTask?.difficulty || "medium"}
                            onChange={handleTaskInputChange}
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
                        >
                          <Save className="h-4 w-4 inline mr-2" />
                          {modalMode === "create" ? "Create" : "Update"}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}