"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, CheckCircle, Clock, Edit, Save, X, AlertCircle, Filter } from "lucide-react"

type Team = {
  id: number
  name: string
  task: string
  description: string
  round: number
  progress: number
  lastUpdated: string
  status: "pending" | "in-progress" | "completed" | "review"
}

export default function TeamTaskManagement() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Alpha Team",
      task: "User Authentication",
      description: "Implement secure login and registration system with JWT tokens and password hashing.",
      round: 2,
      progress: 65,
      lastUpdated: "2023-07-15T14:30:00",
      status: "in-progress"
    },
    {
      id: 2,
      name: "Beta Team",
      task: "Dashboard UI",
      description: "Create responsive admin dashboard with analytics and reporting components.",
      round: 1,
      progress: 100,
      lastUpdated: "2023-07-16T09:45:00",
      status: "completed"
    },
    {
      id: 3,
      name: "Gamma Team",
      task: "Database Optimization",
      description: "Optimize database queries and add proper indexing for performance improvement.",
      round: 3,
      progress: 30,
      lastUpdated: "2023-07-14T16:20:00",
      status: "pending"
    },
    {
      id: 4,
      name: "Delta Team",
      task: "API Integration",
      description: "Integrate third-party payment gateway and social media APIs with proper error handling.",
      round: 2,
      progress: 80,
      lastUpdated: "2023-07-16T11:15:00",
      status: "review"
    },
    {
      id: 5,
      name: "Epsilon Team",
      task: "Mobile Responsiveness",
      description: "Ensure all pages are fully responsive and provide optimal experience on mobile devices.",
      round: 1,
      progress: 50,
      lastUpdated: "2023-07-13T13:50:00",
      status: "in-progress"
    },
    {
      id: 6,
      name: "Zeta Team",
      task: "Testing Suite",
      description: "Write unit and integration tests for core functionality with over 80% coverage.",
      round: 4,
      progress: 20,
      lastUpdated: "2023-07-15T17:40:00",
      status: "pending"
    }
  ])

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color and icon
  const getStatusInfo = (status: Team["status"]) => {
    switch (status) {
      case "pending":
        return { color: "text-amber-600", bg: "bg-amber-100", icon: <Clock size={16} />, label: "Pending" }
      case "in-progress":
        return { color: "text-blue-600", bg: "bg-blue-100", icon: <Edit size={16} />, label: "In Progress" }
      case "completed":
        return { color: "text-green-600", bg: "bg-green-100", icon: <CheckCircle size={16} />, label: "Completed" }
      case "review":
        return { color: "text-purple-600", bg: "bg-purple-100", icon: <AlertCircle size={16} />, label: "Under Review" }
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", icon: <Clock size={16} />, label: "Pending" }
    }
  }

  // Open edit modal with team data
  const openEditModal = (team: Team) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
    setSuccessMessage(false)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTeam(null)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTeam) return
    
    // Update the team in the state
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === selectedTeam.id ? {
          ...selectedTeam,
          lastUpdated: new Date().toISOString()
        } : team
      )
    )
    
    // Show success message
    setSuccessMessage(true)
    
    // Close modal after 2 seconds
    setTimeout(() => {
      closeModal()
    }, 2000)
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!selectedTeam) return
    
    const { name, value } = e.target
    setSelectedTeam({
      ...selectedTeam,
      [name]: name === 'round' || name === 'progress' ? parseInt(value) : value
    })
  }

  // Filter teams by status
  const filteredTeams = filterStatus === "all" 
    ? teams 
    : teams.filter(team => team.status === filterStatus)

  return (
    <div id="home" className="min-h-screen flex items-center justify-between px-4 md:px-20 gap-8 md:gap-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />

      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
      <div
        className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-lg rotate-45 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-12 h-12 bg-secondary/10 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-14 h-14 bg-accent/10 rounded-lg rotate-12 animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-primary/10 rounded-full animate-float"
        style={{ animationDelay: "0.5s" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto py-8 w-full">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Team Task Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage tasks, descriptions, rounds, and status for all teams
          </p>
        </header>

        {/* Filter Section */}
        <div className="bg-card/80 border border-border/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Teams
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
              >
                All Teams
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${filterStatus === "pending" ? "bg-amber-100 text-amber-800" : "bg-muted hover:bg-muted/80"}`}
              >
                <Clock className="h-4 w-4" />
                Pending
              </button>
              <button
                onClick={() => setFilterStatus("in-progress")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${filterStatus === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-muted hover:bg-muted/80"}`}
              >
                <Edit className="h-4 w-4" />
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${filterStatus === "completed" ? "bg-green-100 text-green-800" : "bg-muted hover:bg-muted/80"}`}
              >
                <CheckCircle className="h-4 w-4" />
                Completed
              </button>
              <button
                onClick={() => setFilterStatus("review")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${filterStatus === "review" ? "bg-purple-100 text-purple-800" : "bg-muted hover:bg-muted/80"}`}
              >
                <AlertCircle className="h-4 w-4" />
                Review
              </button>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTeams.map(team => {
            const statusInfo = getStatusInfo(team.status)
            return (
              <motion.div 
                key={team.id}
                className="bg-card/80 border border-border/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm team-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm">ID: {team.id}</span>
                  <span className={`${statusInfo.bg} ${statusInfo.color} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{team.name}</h3>
                <div className="mb-4">
                  <h4 className="font-medium text-foreground">{team.task}</h4>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{team.description}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{team.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${team.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Round {team.round}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatDate(team.lastUpdated)}
                  </div>
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                  onClick={() => openEditModal(team)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Task
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isModalOpen && selectedTeam && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div 
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground">Edit Team Task</h3>
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={closeModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <motion.div 
                      className="bg-green-100 text-green-800 p-4 rounded-xl mb-4 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                      Task updated successfully!
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-foreground font-medium mb-2">Team Name</label>
                      <input 
                        type="text" 
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" 
                        value={selectedTeam.name}
                        readOnly
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-foreground font-medium mb-2">Task Title</label>
                      <input 
                        type="text" 
                        name="task"
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" 
                        value={selectedTeam.task}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-foreground font-medium mb-2">Task Description</label>
                      <textarea 
                        name="description"
                        rows={3}
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" 
                        value={selectedTeam.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-foreground font-medium mb-2">Round</label>
                        <input 
                          type="number" 
                          name="round"
                          min="1"
                          className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" 
                          value={selectedTeam.round}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-foreground font-medium mb-2">Previous Task Progress (%)</label>
                        <input 
                          type="number" 
                          name="progress"
                          min="0"
                          max="100"
                          className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" 
                          value={selectedTeam.progress}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-foreground font-medium mb-2">Status</label>
                      <select
                        name="status"
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                        value={selectedTeam.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="review">Under Review</option>
                      </select>
                    </div>

                    {/* <div className="mb-6">
                      <label className="block text-foreground font-medium mb-2">Comments</label>
                      <textarea 
                        name="comments"
                        rows={2}
                        className="w-full rounded-xl border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" 
                        placeholder="Add comments about this update..."
                      />
                    </div> */}

                    <button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Update Task
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}