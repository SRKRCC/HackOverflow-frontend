"use client"
import { useState } from "react"
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

type Team = {
  id: number
  name: string
  task: string
  description: string
  round: number
  points: number
  lastUpdated: string
  status: "pending" | "in-review" | "completed"
}

export default function TeamTaskManagement() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Alpha",
      task: "User Authentication",
      description:
        "Implement secure login and registration system with JWT tokens and password hashing.",
      round: 2,
      points: 65,
      lastUpdated: "2023-07-15T14:30:00",
      status: "pending",
    },
    {
      id: 2,
      name: "Beta",
      task: "Dashboard UI",
      description:
        "Create responsive admin dashboard with analytics and reporting components.",
      round: 1,
      points: 100,
      lastUpdated: "2023-07-16T09:45:00",
      status: "completed",
    },
    {
      id: 3,
      name: "Gamma",
      task: "Database Optimization",
      description:
        "Optimize database queries and add proper indexing for performance improvement.",
      round: 3,
      points: 30,
      lastUpdated: "2023-07-14T16:20:00",
      status: "pending",
    },
    {
      id: 4,
      name: "Delta",
      task: "API Integration",
      description:
        "Integrate third-party payment gateway and social media APIs with proper error handling.",
      round: 2,
      points: 80,
      lastUpdated: "2023-07-16T11:15:00",
      status: "completed",
    },
  ])

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeSidebarTeam, setActiveSidebarTeam] = useState<string>("")
  const [darkMode] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit")
  const [sidebarTeams, setSidebarTeams] = useState<string[]>([
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
  ])

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

  const getStatusInfo = (status: Team["status"]) => {
    switch (status) {
      case "pending":
        return {
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-900",
          icon: <Clock size={16} />,
          label: "Pending",
        }
      case "in-review":
        return {
          color: "text-purple-600 dark:text-purple-300",
          bg: "bg-purple-100 dark:bg-purple-900",
          icon: <AlertCircle size={16} />,
          label: "In Review",
        }
      case "completed":
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

  // Open edit modal with team data
  const openEditModal = (team: Team) => {
    setModalMode("edit")
    setSelectedTeam({ ...team })
    setIsModalOpen(true)
    setSuccessMessage(false)
  }

  // Open create modal
  const openCreateModal = () => {
    const nextId = teams.length ? Math.max(...teams.map((t) => t.id)) + 1 : 1
    setModalMode("create")
    setSelectedTeam({
      id: nextId,
      name: "",
      task: "",
      description: "",
      round: 1,
      points: 0,
      lastUpdated: new Date().toISOString(),
      status: "pending",
    })
    setIsModalOpen(true)
    setSuccessMessage(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTeam(null)
  }

  // Handle form submission for both create & update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return

    if (modalMode === "create") {
      const newTeam: Team = {
        ...selectedTeam,
        lastUpdated: new Date().toISOString(),
      }
      setTeams((prev) => [...prev, newTeam])
      setSidebarTeams((prev) =>
        prev.includes(newTeam.name) ? prev : [...prev, newTeam.name]
      )
      setSuccessMessage(true)
      setTimeout(() => {
        closeModal()
      }, 1200)
      return
    }

    // edit mode
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === selectedTeam.id
          ? { ...selectedTeam, lastUpdated: new Date().toISOString() }
          : team
      )
    )
    setSuccessMessage(true)
    setTimeout(() => {
      closeModal()
    }, 1200)
  }

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!selectedTeam) return
    const { name, value } = e.target
    setSelectedTeam({
      ...selectedTeam,
      [name]:
        name === "round" || name === "points" ? parseInt(value as string) : value,
    } as Team)
  }

  // Filtering Logic (fixed for exact sidebar match)
  const filteredTeams = teams.filter((team) => {
    const matchesStatus = filterStatus === "all" || team.status === filterStatus
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesSidebar = activeSidebarTeam
      ? team.name.toLowerCase() === activeSidebarTeam.toLowerCase()
      : true
    return matchesStatus && matchesSearch && matchesSidebar
  })

  // Status transition helpers
  const approveTask = (id: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    )
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
            {sidebarTeams.map((team) => (
              <button
                key={team}
                onClick={() => setActiveSidebarTeam(team)}
                className={`w-full text-left px-6 py-3 hover:bg-amber-100 dark:hover:bg-amber-900 ${
                  activeSidebarTeam === team
                    ? "bg-amber-600 text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {team}
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

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTeams.map((team) => {
              const statusInfo = getStatusInfo(team.status)
              return (
                <motion.div
                  key={team.id}
                  className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      ID: {team.id}
                    </span>
                    <span
                      className={`${statusInfo.bg} ${statusInfo.color} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
                  <div className="mb-4">
                    <h4 className="font-medium">{team.task}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {team.description}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                      <span>Points</span>
                      <span className="font-semibold">{team.points}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                      Round {team.round}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(team.lastUpdated)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {team.status === "in-review" && (
                      <button
                        onClick={() => approveTask(team.id)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl flex items-center justify-center gap-2"
                      onClick={() => openEditModal(team)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Task
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Edit/Create Modal */}
          <AnimatePresence>
            {isModalOpen && selectedTeam && (
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
                      <div className="mb-4">
                        <label className="block font-medium mb-2">Team Name</label>
                        <input
                          name="name"
                          type="text"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                          value={selectedTeam.name}
                          onChange={handleInputChange}
                          readOnly={modalMode === "edit"}
                          placeholder={modalMode === "create" ? "Enter team name" : ""}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block font-medium mb-2">Task Title</label>
                        <input
                          name="task"
                          type="text"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                          value={selectedTeam.task}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block font-medium mb-2">Task Description</label>
                        <textarea
                          name="description"
                          rows={3}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                          value={selectedTeam.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block font-medium mb-2">Round</label>
                          <input
                            name="round"
                            type="number"
                            min="1"
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                            value={selectedTeam.round}
                            onChange={handleInputChange}
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
                            value={selectedTeam.points}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block font-medium mb-2">Status</label>
                        <select
                          name="status"
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm"
                          value={selectedTeam.status}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="in-review">In Review</option>
                          <option value="completed">Completed</option>
                        </select>
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