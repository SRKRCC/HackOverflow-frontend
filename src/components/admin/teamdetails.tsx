import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ApiService } from "@/lib/api";
import type { Team } from "@/lib/types";

export default function TeamsTable() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<boolean | null>(null);

  const rowsPerPage = 10; // Number of rows per page

  // Load teams from API
  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await ApiService.admin.getAllTeams();
      setTeams(teamsData || []);
    } catch (err) {
      console.error("Error loading teams:", err);
      setError("Failed to load teams. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Filter teams by ID or Title
  const filteredTeams = teams.filter((team) =>
    [team.teamId.toString(), team.title.toLowerCase()].some((value) =>
      value.includes(search.toLowerCase())
    )
  );

  // Pagination logic
  const startIndex = page * rowsPerPage;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + rowsPerPage);
  const hasPrevious = page > 0;
  const hasNext = startIndex + rowsPerPage < filteredTeams.length;

  // Render UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-black dark:to-black px-4 sm:px-6 py-8 sm:py-12 transition-colors duration-300">
      {/* Page Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-orange-600 dark:text-orange-400 mb-6 sm:mb-8 px-2">
        HackOverflow 2K25 Teams
      </h1>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by Team ID or Team Name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="w-full px-3 sm:px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-black 
          text-sm sm:text-base text-gray-800 dark:text-gray-100"
        />
      </div>
      {/* Slide-in Side Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => {
                setPanelOpen(false);
                setSelectedTeam(null);
                setPanelError(null);
                setHasChanges(false);
                setPendingPaymentStatus(null);
              }}
            />

            {/* Panel */}
            <motion.div
              className="relative bg-white dark:bg-gray-900 shadow-xl w-full sm:w-[500px] max-h-screen overflow-auto p-6 border-l border-gray-200 dark:border-gray-700"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Team Details</h2>
                <button
                  onClick={() => {
                    setPanelOpen(false);
                    setSelectedTeam(null);
                    setPanelError(null);
                    setHasChanges(false);
                    setPendingPaymentStatus(null);
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900"
                >
                  Close
                </button>
              </div>

              {panelError ? (
                <div className="text-sm text-red-500">{panelError}</div>
              ) : selectedTeam ? (
                <div className="space-y-4">
                  {/* Team Basic Info */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-3">Team Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Team ID:</span>
                        <div className="text-gray-800 dark:text-gray-200">{selectedTeam.teamId}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">SCC ID:</span>
                        <div className="text-gray-800 dark:text-gray-200">{selectedTeam.scc_id}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Team Name:</span>
                        <div className="text-gray-800 dark:text-gray-200 font-medium">{selectedTeam.title}</div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Team Members ({selectedTeam.members.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedTeam.members.map((member, index) => (
                        <div key={member.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">
                              {member.name}
                              {index === 0 && <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Leader</span>}
                            </h4>
                            <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                              Year {member.year_of_study}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <div>
                              <span className="font-medium">Email:</span>
                              <div className="text-gray-800 dark:text-gray-300 break-all">{member.email}</div>
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span>
                              <div className="text-gray-800 dark:text-gray-300">{member.phone_number}</div>
                            </div>
                            <div>
                              <span className="font-medium">Department:</span>
                              <div className="text-gray-800 dark:text-gray-300">{member.department}</div>
                            </div>
                            <div>
                              <span className="font-medium">T-Shirt:</span>
                              <div className="text-gray-800 dark:text-gray-300">{member.tShirtSize}</div>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="font-medium">College:</span>
                              <div className="text-gray-800 dark:text-gray-300">{member.college_name}</div>
                            </div>
                            {member.location && (
                              <div>
                                <span className="font-medium">Location:</span>
                                <div className="text-gray-800 dark:text-gray-300">{member.location}</div>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Attendance:</span>
                              <div className="text-gray-800 dark:text-gray-300">{member.attendance}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Verification Section */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">Payment Status</h3>
                    <div className="mb-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={pendingPaymentStatus ?? false}
                          onChange={(e) => {
                            const newValue = e.target.checked;
                            setPendingPaymentStatus(newValue);
                            setHasChanges(newValue !== (selectedTeam?.paymentVerified ?? false));
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Payment Verified</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pendingPaymentStatus 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {pendingPaymentStatus ? 'Verified' : 'Pending'}
                        </span>
                      </label>
                    </div>

                    {/* Save Button */}
                    {hasChanges && (
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!selectedTeam || pendingPaymentStatus === null) return;
                            
                            try {
                              setSaving(true);
                              setPanelError(null);
                              await ApiService.admin.verifyTeamPayment(selectedTeam.teamId, pendingPaymentStatus);
                              
                              // Update local UI
                              const updatedTeam = { ...selectedTeam, paymentVerified: pendingPaymentStatus };
                              setSelectedTeam(updatedTeam);
                              setTeams((prev) => prev.map((t) => 
                                t.teamId === selectedTeam.teamId 
                                  ? { ...t, paymentVerified: pendingPaymentStatus } 
                                  : t
                              ));
                              setHasChanges(false);
                            } catch (err) {
                              console.error('Failed to update payment status', err);
                              setPanelError('Failed to update payment status');
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => {
                            setPendingPaymentStatus(selectedTeam?.paymentVerified ?? false);
                            setHasChanges(false);
                          }}
                          disabled={saving}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No team selected</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Loading teams...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-sm sm:text-base text-red-500 px-4">{error}</div>
        ) : (
          <table className="bg-white dark:bg-gray-900 shadow-lg border border-orange-200 dark:border-gray-700 w-full rounded-lg overflow-hidden">
            <thead className="bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-300">
              <tr>
                <th className="px-4 py-3 text-left">Team ID</th>
                <th className="px-4 py-3 text-left">SCC ID</th>
                <th className="px-4 py-3 text-left">Team Name</th>
                <th className="px-4 py-3 text-left">Team Leader</th>
                <th className="px-4 py-3 text-left">Member Count</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeams.length > 0 ? (
                paginatedTeams.map((team) => (
                  <tr
                    key={team.teamId}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-600/20 transition cursor-pointer"
                    onClick={() => {
                      setSelectedTeam(team);
                      setPanelOpen(true);
                      setPanelError(null);
                      setHasChanges(false);
                      setPendingPaymentStatus(team.paymentVerified ?? false);
                    }}
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-white">{team.teamId}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{team.scc_id}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{team.title}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                      {team.members?.[0]?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                      {team.members?.length || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-gray-500 dark:text-gray-400 italic"
                  >
                    No matching teams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end text-xs sm:text-sm items-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrevious}
              className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg transition ${
                hasPrevious
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-200 font-medium whitespace-nowrap">
              Page {page + 1} of {Math.ceil(filteredTeams.length / rowsPerPage) || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg transition ${
                hasNext
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
