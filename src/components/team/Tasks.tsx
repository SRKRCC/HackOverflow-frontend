"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Send,
  Clock,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { ApiService } from "@/lib/api";
import type { Task } from "@/lib/types";

export default function TaskStatusManager() {
  const [searchParams] = useSearchParams();
  const urlFilter = searchParams.get("filter");
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "InReview" | "Completed">(
    (urlFilter as "All" | "Pending" | "InReview" | "Completed") || "All"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamNote, setTeamNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (urlFilter && ["All", "Pending", "InReview", "Completed"].includes(urlFilter)) {
      setFilter(urlFilter as "All" | "Pending" | "InReview" | "Completed");
    }
  }, [urlFilter]);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "";

const handleSubmitForReview = async (id: number, noteText: string) => {
  try {
    setLoading(true);
    setError("");

    await ApiService.team.submitTask(id, { teamNotes: noteText });

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
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Pending
        </span>
      );
    if (status === "InReview")
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          In Review
        </span>
      );
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
        Completed
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-11/12 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">My Tasks</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(["All", "Pending", "InReview", "Completed"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                filter === opt
                  ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {opt === "InReview" ? "In Review" : opt}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10 sm:mt-20">
          <Loader2 className="animate-spin text-orange-600 dark:text-orange-400 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="ml-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">Loading tasks...</span>
        </div>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400 text-center text-sm sm:text-base px-4">{error}</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mt-8 sm:mt-10 text-center text-sm sm:text-base px-4">
          No tasks found for this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.article
                key={task.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="break-words">{task.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">{task.description}</p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2 shrink-0">
                    {getStatusBadge(task.status)}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="inline w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{formatDate(task.timestamp || task.created_at)}</span>
                      <span className="sm:hidden text-[10px]">{formatDate(task.timestamp || task.created_at)}</span>
                    </div>
                  </div>
                </div>

                {task.teamNotes && (
                  <div className="mb-3 p-2.5 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-800">
                    <strong className="block text-xs text-blue-700 dark:text-blue-300 mb-1">
                      Team note
                    </strong>
                    <div className="break-words">{task.teamNotes}</div>
                  </div>
                )}

                <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
                  {task.status === "Pending" && (
                    <button
                      onClick={() => openSubmitModal(task)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all shadow-lg font-medium text-xs sm:text-sm"
                    >
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Submit for Review
                    </button>
                  )}

                  {task.status === "InReview" && (
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm font-medium">
                      <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>Awaiting admin approval</span>
                    </div>
                  )}

                  {task.status === "Completed" && (
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs sm:text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
              className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg p-4 sm:p-6 border border-gray-200/50 dark:border-gray-800/50 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Submit for Review</h4>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 break-words">
                <strong className="text-gray-900 dark:text-gray-100">{selectedTask.title}</strong> — {selectedTask.description}
              </p>

              <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Completion note (required)
              </label>
              <textarea
                value={teamNote}
                onChange={(e) => setTeamNote(e.target.value)}
                rows={4}
                className="w-full rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-700 p-2.5 sm:p-3 bg-white dark:bg-gray-800 text-xs sm:text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                placeholder="Write a short note describing what you completed..."
                required
              />

              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all shadow-lg text-xs sm:text-sm"
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
