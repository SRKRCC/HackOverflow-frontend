import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, Edit2, Trash2, X, Loader2, CheckCircle, Calendar, Clock, AlertTriangle } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { Announcement } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, Edit2, Trash2, X, Loader2, CheckCircle, Calendar, Clock, AlertTriangle } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { Announcement } from "@/lib/types";

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<{
    title?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  }>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<{
    title?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return { dateStr, timeStr };
  };

  const parseDateTimeFromISO = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
    return { dateStr, timeStr };
  };

  const getAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ApiService.admin.getAnnouncements();
      setAnnouncements(response || []);
    } catch (err) {
      setError("Failed to load announcements. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const validateDateTime = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setError("All date and time fields are required.");
      return false;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      setError("Invalid date or time format.");
      return false;
    }

    if (endDateTime <= startDateTime) {
      setError("End date/time must be after start date/time.");
      return false;
    }

    return true;
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return { dateStr, timeStr };
  };

  const parseDateTimeFromISO = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
    return { dateStr, timeStr };
  };

  const getAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ApiService.admin.getAnnouncements();
      setAnnouncements(response || []);
    } catch (err) {
      setError("Failed to load announcements. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const validateDateTime = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setError("All date and time fields are required.");
      return false;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      setError("Invalid date or time format.");
      return false;
    }

    if (endDateTime <= startDateTime) {
      setError("End date/time must be after start date/time.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError("Title and description are required.");
      return;
    }

    if (!validateDateTime()) {
    
    if (!formData.title || !formData.description) {
      setError("Title and description are required.");
      return;
    }

    if (!validateDateTime()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: startDateTime,
        endTime: endDateTime
      };
    try {
      setSubmitting(true);
      setError("");

      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).toISOString();

      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: startDateTime,
        endTime: endDateTime
      };

      if (editingId) {
        const response = await ApiService.admin.updateAnnouncement(editingId, payload);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingId ? response.data : a))
        );
        showSuccess("Announcement updated successfully!");
      } else {
        const response = await ApiService.admin.createAnnouncement(payload);
        setAnnouncements((prev) => [response.data, ...prev]);
        showSuccess("Announcement created successfully!");
      }

      setFormData({});
      setShowModal(false);
      if (editingId) {
        const response = await ApiService.admin.updateAnnouncement(editingId, payload);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingId ? response.data : a))
        );
        showSuccess("Announcement updated successfully!");
      } else {
        const response = await ApiService.admin.createAnnouncement(payload);
        setAnnouncements((prev) => [response.data, ...prev]);
        showSuccess("Announcement created successfully!");
      }

      setFormData({});
      setShowModal(false);
      setEditingId(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || `Failed to ${editingId ? "update" : "create"} announcement. Please try again.`;
      setError(errorMessage);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    const { dateStr: startDate, timeStr: startTime } = parseDateTimeFromISO(announcement.startTime);
    const { dateStr: endDate, timeStr: endTime } = parseDateTimeFromISO(announcement.endTime);
    
    setFormData({
      title: announcement.title,
      description: announcement.description,
      startDate,
      startTime,
      endDate,
      endTime
    });
    setEditingId(announcement.id);
    setShowModal(true);
    setError("");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || `Failed to ${editingId ? "update" : "create"} announcement. Please try again.`;
      setError(errorMessage);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    const { dateStr: startDate, timeStr: startTime } = parseDateTimeFromISO(announcement.startTime);
    const { dateStr: endDate, timeStr: endTime } = parseDateTimeFromISO(announcement.endTime);
    
    setFormData({
      title: announcement.title,
      description: announcement.description,
      startDate,
      startTime,
      endDate,
      endTime
    });
    setEditingId(announcement.id);
    setShowModal(true);
    setError("");
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setDeleting(true);
      setError("");
      await ApiService.admin.deleteAnnouncement(deleteModal.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteModal.id));
      showSuccess("Announcement deleted successfully!");
      setDeleteModal({ show: false, id: null });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to delete announcement. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setShowModal(false);
    setEditingId(null);
    setError("");
  };

  const openCreateModal = () => {
    setFormData({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowModal(true);
    setError("");
  };

  const getMinEndDateTime = () => {
    if (!formData.startDate || !formData.startTime) return {};
    
    return {
      minDate: formData.startDate,
      minTime: formData.startDate === formData.endDate ? formData.startTime : undefined
    };
  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setDeleting(true);
      setError("");
      await ApiService.admin.deleteAnnouncement(deleteModal.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteModal.id));
      showSuccess("Announcement deleted successfully!");
      setDeleteModal({ show: false, id: null });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to delete announcement. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setShowModal(false);
    setEditingId(null);
    setError("");
  };

  const openCreateModal = () => {
    setFormData({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowModal(true);
    setError("");
  };

  const getMinEndDateTime = () => {
    if (!formData.startDate || !formData.startTime) return {};
    
    return {
      minDate: formData.startDate,
      minTime: formData.startDate === formData.endDate ? formData.startTime : undefined
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-7xl"
            >
              📢
            </motion.div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-4 tracking-tight">
            Announcements
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Create, manage, and share important updates with your community in real-time
          </p>
        </motion.div>

        {/* Success Toast */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-md"
            >
              <div className="bg-white/20 rounded-full p-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="font-semibold">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Toast */}
        <AnimatePresence>
          {error && !showModal && !deleteModal.show && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-md"
            >
              <div className="bg-white/20 rounded-full p-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="font-semibold flex-1">{error}</p>
              <button onClick={() => setError("")} className="hover:bg-white/20 rounded-full p-1 transition">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openCreateModal}
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={handleCancel}
              />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl border border-orange-200 dark:border-orange-900/50 my-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-t-3xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          {editingId ? "✏️ Update Announcement" : "✨ Create Announcement"}
                        </h2>
                        <p className="text-orange-100 text-sm">
                          {editingId ? "Modify your announcement details" : "Share something important with your community"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-7xl"
            >
              📢
            </motion.div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-4 tracking-tight">
            Announcements
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Create, manage, and share important updates with your community in real-time
          </p>
        </motion.div>

        {/* Success Toast */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-md"
            >
              <div className="bg-white/20 rounded-full p-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="font-semibold">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Toast */}
        <AnimatePresence>
          {error && !showModal && !deleteModal.show && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-md"
            >
              <div className="bg-white/20 rounded-full p-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="font-semibold flex-1">{error}</p>
              <button onClick={() => setError("")} className="hover:bg-white/20 rounded-full p-1 transition">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openCreateModal}
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={handleCancel}
              />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl border border-orange-200 dark:border-orange-900/50 my-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-t-3xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          {editingId ? "✏️ Update Announcement" : "✨ Create Announcement"}
                        </h2>
                        <p className="text-orange-100 text-sm">
                          {editingId ? "Modify your announcement details" : "Share something important with your community"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Title <span className="text-orange-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., System Maintenance Notice"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>
                  {/* Modal Body */}
                  <div className="p-6">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Title <span className="text-orange-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., System Maintenance Notice"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Description <span className="text-orange-500">*</span>
                          </label>
                          <textarea
                            placeholder="Provide detailed information about this announcement..."
                            rows={5}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none transition"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-4 border-2 border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-green-500 rounded-full p-1.5">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Start Date & Time</h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.startDate || ""}
                                onChange={(e) => {
                                  setFormData({ ...formData, startDate: e.target.value });
                                  if (formData.endDate && e.target.value > formData.endDate) {
                                    setFormData(prev => ({ ...prev, endDate: e.target.value, endTime: "" }));
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Time
                              </label>
                              <input
                                type="time"
                                className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.startTime || ""}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Description <span className="text-orange-500">*</span>
                          </label>
                          <textarea
                            placeholder="Provide detailed information about this announcement..."
                            rows={5}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none transition"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-4 border-2 border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-green-500 rounded-full p-1.5">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Start Date & Time</h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.startDate || ""}
                                onChange={(e) => {
                                  setFormData({ ...formData, startDate: e.target.value });
                                  if (formData.endDate && e.target.value > formData.endDate) {
                                    setFormData(prev => ({ ...prev, endDate: e.target.value, endTime: "" }));
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Time
                              </label>
                              <input
                                type="time"
                                className="w-full px-3 py-2 border-2 border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.startTime || ""}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 rounded-2xl p-4 border-2 border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-red-500 rounded-full p-1.5">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">End Date & Time</h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Date
                              </label>
                              <input
                                type="date"
                                min={formData.startDate || undefined}
                                className="w-full px-3 py-2 border-2 border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.endDate || ""}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Time
                              </label>
                              <input
                                type="time"
                                min={getMinEndDateTime().minTime}
                                className="w-full px-3 py-2 border-2 border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.endTime || ""}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 rounded-2xl p-4 border-2 border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-red-500 rounded-full p-1.5">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">End Date & Time</h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Date
                              </label>
                              <input
                                type="date"
                                min={formData.startDate || undefined}
                                className="w-full px-3 py-2 border-2 border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.endDate || ""}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                                Time
                              </label>
                              <input
                                type="time"
                                min={getMinEndDateTime().minTime}
                                className="w-full px-3 py-2 border-2 border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition text-sm"
                                value={formData.endTime || ""}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {editingId ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            {editingId ? "💾 Update" : "🚀 Create"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
                    {/* Modal Footer */}
                    <div className="flex gap-3 mt-6 pt-6 border-t-2 border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {editingId ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            {editingId ? "💾 Update" : "🚀 Create"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal.show && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => !deleting && setDeleteModal({ show: false, id: null })}
              />
              
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full border-2 border-red-200 dark:border-red-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
                        <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
                      Delete Announcement?
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                      This action cannot be undone. The announcement will be permanently removed from the system.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteModal({ show: false, id: null })}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal.show && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => !deleting && setDeleteModal({ show: false, id: null })}
              />
              
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full border-2 border-red-200 dark:border-red-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
                        <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
                      Delete Announcement?
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                      This action cannot be undone. The announcement will be permanently removed from the system.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteModal({ show: false, id: null })}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <Loader2 className="w-16 h-16 text-orange-500" />
            </>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <Loader2 className="w-16 h-16 text-orange-500" />
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">Loading announcements...</p>
          </div>
        ) : (
          /* Announcements Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            <AnimatePresence mode="popLayout">
              {announcements.length > 0 ? (
                announcements.map((announcement, idx) => {
                  const { dateStr: startDate, timeStr: startTime } = formatDateTime(announcement.startTime);
                  const { dateStr: endDate, timeStr: endTime } = formatDateTime(announcement.endTime);
                  
                  return (
                    <motion.div
                      key={announcement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden group"
                    >
                      <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
                      
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                          {announcement.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                          {announcement.description}
                        </p>

                        <div className="space-y-3 mb-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="font-bold text-green-700 dark:text-green-300 text-xs uppercase tracking-wide">Start</span>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 ml-6 text-sm">
                              <div className="font-semibold">{startDate}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{startTime}</div>
                            </div>
                          </div>

                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                              <span className="font-bold text-red-700 dark:text-red-300 text-xs uppercase tracking-wide">End</span>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 ml-6 text-sm">
                              <div className="font-semibold">{endDate}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{endTime}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="flex-1 px-4 py-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/50 transition flex items-center justify-center gap-2 border-2 border-orange-200 dark:border-orange-800"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: announcement.id })}
                            className="flex-1 px-4 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="text-8xl mb-6"
                  >
                    📭
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">No Announcements Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Create your first announcement to get started!</p>
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Announcement
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;