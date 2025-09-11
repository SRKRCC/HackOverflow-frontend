import { useState } from "react";

type Team = {
  teamId: number;
  teamName: string;
  leadName: string;
  memberCount: number;
};

const teams: Team[] = [
  { teamId: 1, teamName: "CodeWarriors", leadName: "Ravi Kumar", memberCount: 4 },
  { teamId: 2, teamName: "DebugSquad", leadName: "Priya Sharma", memberCount: 3 },
  { teamId: 3, teamName: "HackMasters", leadName: "Aman Verma", memberCount: 5 },
  { teamId: 4, teamName: "ByteHunters", leadName: "Sneha Reddy", memberCount: 6 },
  { teamId: 5, teamName: "AlgoNinjas", leadName: "Karthik Rao", memberCount: 2 },
  { teamId: 6, teamName: "DataPirates", leadName: "Anjali Mehta", memberCount: 4 },
  { teamId: 7, teamName: "CodeTitans", leadName: "Vikas Sharma", memberCount: 3 },
];

export default function TeamsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 3; // number of rows per page

  // Filter teams (ignoring member count in search)
  const filteredTeams = teams.filter((team) =>
    [team.teamId.toString(), team.teamName, team.leadName]
      .some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const startIndex = page * rowsPerPage;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + rowsPerPage);
  const hasPrevious = page > 0;
  const hasNext = startIndex + rowsPerPage < filteredTeams.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-black dark:to-black px-6 py-12 transition-colors duration-300">
      {/* Page Heading */}
      <h1 className="text-4xl font-extrabold text-center text-orange-600 dark:text-orange-400 mb-8">
        HackOverflow 2K25 Teams
      </h1>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by ID, Team Name or Leader..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // reset to first page on new search
          }}
          className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-black text-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Teams Table */}
      <div className="overflow-x-auto max-w-5xl mx-auto rounded-lg">
        <table className="bg-white dark:bg-gray-900 shadow-lg border border-orange-200 dark:border-gray-700 w-full">
          <thead className="bg-orange-100 dark:bg-gray-800 text-orange-700 dark:text-orange-300">
            <tr>
              <th className="px-4 py-3 text-left">Team ID</th>
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
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{team.teamName}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{team.leadName}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{team.memberCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center px-4 py-6 text-gray-500 dark:text-gray-400 italic"
                >
                  No matching teams found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-end text-sm items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevious}
            className={`px-4 py-2 rounded-lg transition ${
              hasPrevious
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            Page {page + 1} of {Math.ceil(filteredTeams.length / rowsPerPage) || 1}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            className={`px-4 py-2 rounded-lg transition ${
              hasNext
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}