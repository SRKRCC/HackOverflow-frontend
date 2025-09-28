"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Filter,
  CheckCircle,
  Send,
  Clock,
  ClipboardList,
  AlertCircle,
  X,
} from "lucide-react"

type Task = {
  id: number
  title: string
  description: string
  status: "Pending" | "In Review" | "Completed"
  note?: string
  lastUpdated?: string
}

export default function TaskStatusManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "User Authentication",
      description: "Implement secure login & registration with JWT and hashing.",
      status: "Pending",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Dashboard Layout",
      description: "Build responsive dashboard UI and charts.",
      status: "Pending",
      lastUpdated: new Date().toISOString(),
    },
    // Example: if admin already marked something completed, team will see it here:
    // { id: 3, title: "Release v1.0", description: "Ship MVP", status: "Completed", lastUpdated: "2025-09-01T10:00:00Z" }
  ])

  const [filter, setFilter] = useState<"All" | "Pending" | "In Review" | "Completed">("All")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [note, setNote] = useState("")

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : ""

  // Team submits a task for review (this is the only state-change team can do)
  const handleSubmitForReview = (id: number, noteText: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "In Review", note: noteText, lastUpdated: new Date().toISOString() }
          : t
      )
    )
  }

  // Open modal to enter note before submitting; modal handles final submit
  const openSubmitModal = (task: Task) => {
    setSelectedTask(task)
    setNote(task.note ?? "")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
    setNote("")
  }

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTask) return
    if (!note.trim()) return // require a note
    handleSubmitForReview(selectedTask.id, note.trim())
    closeModal()
  }

  const filteredTasks = filter === "All" ? tasks : tasks.filter((t) => t.status === filter)

  const getStatusBadge = (status: Task["status"]) => {
    if (status === "Pending") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
    if (status === "In Review") return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">In Review</span>
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-semibold">My Team Tasks</h2>
        </div>

        <div className="flex gap-2">
          {(["All", "Pending", "In Review", "Completed"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === opt ? "bg-orange-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.article
              key={task.id}
              className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gray-500" />
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  {getStatusBadge(task.status)}
                  <div className="text-xs text-gray-400">
                    <Clock className="inline w-3 h-3 mr-1" />
                    {formatDate(task.lastUpdated)}
                  </div>
                </div>
              </div>

              {/* Note shown if exists */}
              {task.note && (
                <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0f0f0f] text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-xs text-gray-500 mb-1">Team note</strong>
                  <div>{task.note}</div>
                </div>
              )}

              {/* Actions: teams can only submit for review when pending */}
              <div className="mt-4 flex items-center gap-3">
                {task.status === "Pending" && (
                  <button
                    onClick={() => openSubmitModal(task)}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
                    aria-label={`Submit ${task.title} for review`}
                  >
                    <Send className="w-4 h-4" />
                    Submit for Review
                  </button>
                )}

                {task.status === "In Review" && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 text-yellow-800 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Awaiting admin approval
                  </div>
                )}

                {task.status === "Completed" && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-800 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Submit-for-review modal */}
      <AnimatePresence>
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.form
              onSubmit={handleModalSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="relative bg-white dark:bg-[#0b0b0b] rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-100 dark:border-gray-800 z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Submit for Review</h4>
                <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                <strong>{selectedTask.title}</strong> — {selectedTask.description}
              </p>

              <label className="block text-sm font-medium mb-2">Completion note (required)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-[#0f0f0f] text-sm mb-4 focus:outline-none"
                placeholder="Write a short note describing what you completed and why it's ready for review..."
                required
              />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-gray-200 text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white">
                  Submit for Review
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
