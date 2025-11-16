import { useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import type { Team } from "@/lib/types";

export default function TeamsTable() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rowsPerPage = 10; // Number of rows per page

  // ✅ Load teams from API
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

  // ✅ Filter teams by ID or Title
  const filteredTeams = teams.filter((team) =>
    [team.teamId.toString(), team.title.toLowerCase()].some((value) =>
      value.includes(search.toLowerCase())
    )
  );

  // ✅ Pagination logic
  const startIndex = page * rowsPerPage;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + rowsPerPage);
  const hasPrevious = page > 0;
  const hasNext = startIndex + rowsPerPage < filteredTeams.length;

  // ✅ Render UI
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
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-600/20 transition"
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
