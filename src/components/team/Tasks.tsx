"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  CheckCircle,
  Send,
  Clock,
  ClipboardList,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { ApiService } from "@/lib/api";
import type { Task } from "@/lib/types";

export default function TaskStatusManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "InReview" | "Completed">("All");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamNote, setTeamNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- Fetch tasks dynamically ----
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data: Task[] = await ApiService.team.getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ---- Helper: Format date ----
  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "";

  // ---- Submit for Review ----
const handleSubmitForReview = async (id: number, noteText: string) => {
  try {
    setLoading(true);
    setError("");

    // 🔥 Actual backend call
    await ApiService.team.submitTask(id, { teamNotes: noteText });

    // ✅ Optimistic UI update after success
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "InReview",
              in_review: true,
              teamNotes: noteText,
              timestamp: new Date().toISOString(),
            }
          : t
      )
    );
  } catch (error) {
    console.error("Error submitting task for review:", error);
    setError("Failed to submit task. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // ---- Modal Controls ----
  const openSubmitModal = (task: Task) => {
    setSelectedTask(task);
    setTeamNote(task.teamNotes ?? "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setTeamNote("");
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    if (!teamNote.trim()) return;

    await handleSubmitForReview(selectedTask.id, teamNote.trim());
    closeModal();
  };

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const getStatusBadge = (status: Task["status"]) => {
    if (status === "Pending")
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          Pending
        </span>
      );
    if (status === "InReview")
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          In Review
        </span>
      );
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Completed
      </span>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* ---- Header + Filter ---- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-semibold">My Team Tasks</h2>
        </div>

        <div className="flex gap-2">
          {(["All", "Pending", "InReview", "Completed"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === opt
                  ? "bg-orange-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt === "InReview" ? "In Review" : opt}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Loading / Error States ---- */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          <span className="ml-3 text-gray-700">Loading tasks...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 mt-10 text-center">
          No tasks found for this filter.
        </p>
      ) : (
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
                      {formatDate(task.timestamp || task.created_at)}
                    </div>
                  </div>
                </div>

                {task.teamNotes && (
                  <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0f0f0f] text-sm text-gray-700 dark:text-gray-300">
                    <strong className="block text-xs text-gray-500 mb-1">
                      Team note
                    </strong>
                    <div>{task.teamNotes}</div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  {task.status === "Pending" && (
                    <button
                      onClick={() => openSubmitModal(task)}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
                    >
                      <Send className="w-4 h-4" />
                      Submit for Review
                    </button>
                  )}

                  {task.status === "InReview" && (
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
      )}

      {/* ---- Submit-for-review modal ---- */}
      <AnimatePresence>
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                <strong>{selectedTask.title}</strong> — {selectedTask.description}
              </p>

              <label className="block text-sm font-medium mb-2">
                Completion note (required)
              </label>
              <textarea
                value={teamNote}
                onChange={(e) => setTeamNote(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-[#0f0f0f] text-sm mb-4 focus:outline-none"
                placeholder="Write a short note describing what you completed..."
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white"
                >
                  Submit for Review
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
