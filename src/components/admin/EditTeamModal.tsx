import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ApiService } from "@/lib/api";
import type { Team, ValidationError } from "@/lib/types";

interface EditTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTeam: Team) => void;
}

export default function EditTeamModal({ team, isOpen, onClose, onUpdate }: EditTeamModalProps) {
  const [formData, setFormData] = useState({
    title: team.title,
    ps_id: team.ps_id || 0,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: team.title,
        ps_id: team.ps_id || 0,
      });
      setErrors([]);
    }
  }, [isOpen, team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Only send changed fields
      const updates: { title?: string; ps_id?: number } = {};
      
      if (formData.title !== team.title) {
        updates.title = formData.title;
      }
      
      if (formData.ps_id !== (team.ps_id || 0) && formData.ps_id > 0) {
        updates.ps_id = formData.ps_id;
      }

      // Don't make API call if nothing changed
      if (Object.keys(updates).length === 0) {
        onClose();
        return;
      }

      const response = await ApiService.admin.updateTeam(team.teamId, updates);
      
      if (response.success) {
        onUpdate(response.data);
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update team:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ 
          field: "general", 
          message: error.response?.data?.message || "Failed to update team" 
        }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Edit Team Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* General errors */}
        {getFieldError("general") && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{getFieldError("general")}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("title")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter team name"
              minLength={3}
              required
              disabled={isSubmitting}
            />
            {getFieldError("title") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("title")}
              </p>
            )}
          </div>

          {/* Problem Statement ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Problem Statement ID
            </label>
            <input
              type="number"
              value={formData.ps_id || ""}
              onChange={(e) => setFormData({ ...formData, ps_id: parseInt(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                getFieldError("ps_id")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
              }`}
              placeholder="Enter problem statement ID"
              min={1}
              disabled={isSubmitting}
            />
            {getFieldError("ps_id") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getFieldError("ps_id")}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 rounded-lg transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}