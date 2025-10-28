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
  Search,
  AlertCircle,
  Plus,
  Loader2,
  Menu,
  Filter,
  ChevronDown,
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
  const [submitting, setSubmitting] = useState(false)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [teamSearchTerm, setTeamSearchTerm] = useState<string>("")
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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
      setError(null)
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusConfig = (status: Task["status"]) => {
    const configs = {
      Pending: {
        color: "text-amber-700 dark:text-amber-300",
        bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
        icon: Clock,
        label: "Pending",
      },
      InReview: {
        color: "text-purple-700 dark:text-purple-300",
        bg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800",
        icon: AlertCircle,
        label: "In Review",
      },
      Completed: {
        color: "text-green-700 dark:text-green-300",
        bg: "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800",
        icon: CheckCircle,
        label: "Completed",
      },
    }
    return configs[status] || configs.Pending
  }

  // const openEditModal = (task: Task) => {
  //   setModalMode("edit")
  //   setSelectedTask({ ...task })
  //   setIsModalOpen(true)
  //   setSuccessMessage(false)
  // }

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
    setSuccessMessage(false)
    setSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
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
      setSubmitting(false)
    }
  }

  const handleTaskInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // Client-side filtering
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "pending" && task.status === "Pending") ||
      (filterStatus === "in-review" && task.status === "InReview") ||
      (filterStatus === "completed" && task.status === "Completed")
    
    // Team filter - check multiple possible team identifier formats
    const matchesTeam = 
      selectedTeamId === null || 
      task.team?.id === selectedTeamId ||
      task.teamId === selectedTeamId 
    
    return matchesStatus && matchesTeam
  })

  // Filter teams by search
  const filteredTeams = teams.filter(team => 
    team.title?.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
    team.scc_id?.toLowerCase().includes(teamSearchTerm.toLowerCase())
  )

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

  const getTeamTaskCount = (teamId: number) => {
    return tasks.filter(task => 
      task.team?.id === teamId || 
      task.teamId === teamId 
    ).length
  }

 

  const statusFilters = [
    { id: "all", label: "All", color: "bg-orange-600 hover:bg-orange-700", count: tasks.length },
    { id: "pending", label: "Pending", color: "bg-amber-600 hover:bg-amber-700", count: tasks.filter(t => t.status === "Pending").length },
    { id: "in-review", label: "In Review", color: "bg-purple-600 hover:bg-purple-700", count: tasks.filter(t => t.status === "InReview").length },
    { id: "completed", label: "Completed", color: "bg-green-600 hover:bg-green-700", count: tasks.filter(t => t.status === "Completed").length }
  ]

  const selectedTeam = teams.find(t => t.teamId === selectedTeamId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100 dark:from-gray-950 dark:via-orange-950/10 dark:to-black">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold">Task Manager</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="p-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Team Selector Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={teamSearchTerm}
                  onChange={(e) => setTeamSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  setSelectedTeamId(null)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                  selectedTeamId === null
                    ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-semibold"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span>All Teams</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedTeamId === null 
                    ? "bg-orange-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700"
                }`}>
                  {tasks.length}
                </span>
              </button>

              {filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamId(team?.teamId)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedTeamId === team.teamId
                      ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-semibold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{team.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{team.scc_id}</div>
                    </div>
                    <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                      selectedTeamId === team.teamId
                        ? "bg-orange-600 text-white" 
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      {getTeamTaskCount(team.teamId)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-72 xl:w-88 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold">Teams</h2>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                value={teamSearchTerm}
                onChange={(e) => setTeamSearchTerm(e.target.value)}
              />  
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto">
            <button
              key={''}
              onClick={() => setSelectedTeamId(null)}
              className={`w-full text-left px-6 py-3.5 transition-all border-l-4 flex items-center justify-between group ${
                selectedTeamId === null
                  ? "bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/30 border-orange-600 text-orange-700 dark:text-orange-400 font-semibold"
                  : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>All Teams</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                selectedTeamId === null 
                  ? "bg-orange-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
              }`}>
                {tasks.length}
              </span>
            </button>

            {loading ? (
              <div className="px-6 py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-orange-600" />
                <p className="text-sm text-gray-500 mt-2">Loading teams...</p>
              </div>
            ) : filteredTeams.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-500 text-center">
                {teamSearchTerm ? "No teams found" : "No teams registered"}
              </p>
            ) : (
              filteredTeams.map((team) => {
                const isSelected = selectedTeamId === team.teamId
                return (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team?.teamId)}
                    className={`w-full text-left px-6 py-3.5 transition-all border-l-4 group ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/30 border-orange-600 text-orange-700 dark:text-orange-400 font-semibold"
                        : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{team.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {team.scc_id}
                        </div>
                      </div>
                      <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                        isSelected
                          ? "bg-orange-600 text-white" 
                          : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                      }`}>
                        {getTeamTaskCount(team.teamId)}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-1">Task Management</h1>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  Monitor and manage team tasks
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm lg:text-base"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Task</span>
              </button>
            </div>

            {/* Selected Team Info - Mobile */}
            {selectedTeamId && selectedTeam && (
              <div className="lg:hidden mb-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Viewing tasks for</p>
                    <p className="font-semibold">{selectedTeam.title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTeamId(null)}
                    className="text-sm text-orange-600 dark:text-orange-400 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 lg:p-4 rounded-xl mb-4 lg:mb-6 flex items-center gap-3 text-sm lg:text-base"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-3 lg:p-4 rounded-xl mb-4 lg:mb-6 flex items-center gap-3 text-sm lg:text-base"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Action completed successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Filter Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base lg:text-lg font-semibold flex items-center gap-2">
                  <Filter className=" h-4 w-4 lg:h-5 lg:w-5" />
                  Filter by Status
                </h2>
                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredTasks.length}</span> of {tasks.length}
                </span>
              </div>
              
              {/* Desktop Filter Buttons */}
              <div className="hidden sm:flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterStatus(filter.id)}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-2 ${
                      filterStatus === filter.id
                        ? `${filter.color} text-white shadow-md`
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {filter.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      filterStatus === filter.id
                        ? "bg-white/30"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mobile Filter Dropdown */}
              <div className="sm:hidden">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between text-sm font-medium"
                >
                  <span>{statusFilters.find(f => f.id === filterStatus)?.label || "All"}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {statusFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setFilterStatus(filter.id)
                            setIsFilterOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                            filterStatus === filter.id
                              ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                              : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span>{filter.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Tasks Grid */}
            {loading ? (
              <div className="text-center py-12 lg:py-20">
                <Loader2 className="h-10 w-10 lg:h-12 lg:w-12 animate-spin mx-auto text-orange-600 mb-4" />
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12 lg:py-20 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
                <div className="p-3 lg:p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 lg:w-16 lg:h-16 mx-auto flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg font-medium">No tasks found</p>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Try adjusting your filters or create a new task
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredTasks.map((task) => {
                  const statusConfig = getStatusConfig(task.status)
                  const StatusIcon = statusConfig.icon
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-lg transition-all"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex justify-between items-start mb-3 lg:mb-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          #{task.id}
                        </span>
                        <span
                          className={`${statusConfig.bg} ${statusConfig.color} border text-xs font-semibold px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg flex items-center gap-1.5`}
                        >
                          <StatusIcon className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      {task.team && (
                        <div className="mb-3">
                          <span className="inline-flex items-center text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Users className="h-3 w-3 mr-1.5" />
                            {task.team.title}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-base lg:text-lg font-bold mb-2 line-clamp-2">{task.title}</h3>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {task.description}
                      </p>

                      <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex justify-between items-center text-xs lg:text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Points</span>
                          <span className="font-bold text-orange-600 dark:text-orange-400">{task.points}</span>
                        </div>
                        {task.difficulty && (
                          <div className="flex justify-between items-center text-xs lg:text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                            <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">{task.difficulty}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs lg:text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Round</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">Round {task.round_num}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(task.timestamp)}
                      </div>

                      {task.teamNotes && (
                        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs lg:text-sm border border-blue-200 dark:border-blue-800">
                          <strong className="text-blue-700 dark:text-blue-300">Team Notes:</strong>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{task.teamNotes}</p>
                        </div>
                      )}

                      {task.reviewNotes && (
                        <div className="mb-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-xs lg:text-sm border border-green-200 dark:border-green-800">
                          <strong className="text-green-700 dark:text-green-300">Admin Review:</strong>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{task.reviewNotes}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {task.status === "InReview" && (
                          <button
                            onClick={() => approveTask(task.id)}
                            className="flex-1 px-3 py-2 lg:py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2 text-xs lg:text-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            Approve
                          </button>
                        )}
                        {/* <button
                          className="flex-1 px-3 py-2 lg:py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2 text-xs lg:text-sm"
                          onClick={() => openEditModal(task)}
                        >
                          <Edit className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                          Edit
                        </button> */}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (modalMode === "create" || selectedTask) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="p-5 lg:p-6">
                <div className="flex justify-between items-center mb-5 lg:mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                    {modalMode === "create" ? (
                      <>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Plus className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
                        </div>
                        Create New Task
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Edit className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
                        </div>
                        Edit Task
                      </>
                    )}
                  </h3>
                  <button
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    <X className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>
                </div>

                {successMessage && (
                  <motion.div
                    className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-3 lg:p-4 rounded-xl mb-5 lg:mb-6 flex items-center gap-3 border border-green-200 dark:border-green-800 text-sm lg:text-base"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Task saved successfully!</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                  {modalMode === "create" && (
                    <div>
                      <label className="block font-semibold mb-2 text-xs lg:text-sm">Assign to Team *</label>
                      <select
                        name="teamId"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all disabled:opacity-50"
                        value={newTask.teamId}
                        onChange={handleTaskInputChange}
                        disabled={submitting}
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

                  <div>
                    <label className="block font-semibold mb-2 text-xs lg:text-sm">Task Title *</label>
                    <input
                      name="title"
                      type="text"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all disabled:opacity-50"
                      value={modalMode === "create" ? newTask.title : selectedTask?.title || ""}
                      onChange={handleTaskInputChange}
                      placeholder="Enter task title..."
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-xs lg:text-sm">Task Description *</label>
                    <textarea
                      name="description"
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none disabled:opacity-50"
                      value={modalMode === "create" ? newTask.description : selectedTask?.description || ""}
                      onChange={handleTaskInputChange}
                      placeholder="Describe the task in detail..."
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 lg:gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-xs lg:text-sm">Round *</label>
                      <input
                        name="round_num"
                        type="number"
                        min="1"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all disabled:opacity-50"
                        value={modalMode === "create" ? newTask.round_num : selectedTask?.round_num || 1}
                        onChange={handleTaskInputChange}
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-xs lg:text-sm">Points *</label>
                      <input
                        name="points"
                        type="number"
                        min="0"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all disabled:opacity-50"
                        value={modalMode === "create" ? newTask.points : selectedTask?.points || 0}
                        onChange={handleTaskInputChange}
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-xs lg:text-sm">Difficulty *</label>
                      <select
                        name="difficulty"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all disabled:opacity-50"
                        value={modalMode === "create" ? newTask.difficulty : selectedTask?.difficulty || "medium"}
                        onChange={handleTaskInputChange}
                        disabled={submitting}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting}
                      className="flex-1 px-3 lg:px-4 py-2 lg:py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs lg:text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2 text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {modalMode === "create" ? "Creating..." : "Updating..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {modalMode === "create" ? "Create Task" : "Update Task"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}