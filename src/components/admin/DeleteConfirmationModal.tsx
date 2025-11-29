import { useState } from "react";
import { motion } from "framer-motion";
import { ApiService } from "@/lib/api";
import type { Team } from "@/lib/types";

interface DeleteConfirmationModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (deletedTeamId: number) => void;
}

export default function DeleteConfirmationModal({ 
  team, 
  isOpen, 
  onClose, 
  onDelete 
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await ApiService.admin.deleteTeam(team.teamId);
      
      if (response.success) {
        onDelete(team.teamId);
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to delete team:", error);
      setError(error.response?.data?.message || "Failed to delete team. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={!isDeleting ? onClose : undefined}
      />
      
      {/* Modal */}
      <motion.div
        className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Delete Team?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{team.title}"</span>?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>This action cannot be undone.</strong> All team data, members, and associated records will be permanently deleted.
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p><strong>Team ID:</strong> {team.teamId}</p>
            <p><strong>SCC ID:</strong> {team.scc_id}</p>
            <p><strong>Members:</strong> {team.members?.length || 0} people</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-lg transition-colors flex items-center justify-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Team
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}