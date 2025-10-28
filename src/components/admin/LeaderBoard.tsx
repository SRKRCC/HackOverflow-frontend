import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";

const LeaderBoard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await ApiService.admin.getLeaderboard();

        // Sort by totalPoints (descending)
        const sorted = data.sort(
          (a: LeaderboardEntry, b: LeaderboardEntry) => b.totalPoints - a.totalPoints
        );

        setLeaderboard(sorted);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-[#1a1a1a] dark:to-[#1a1a1a] flex flex-col items-center p-6 pb-20 transition-colors duration-300">
      {/* ---- Heading ---- */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 dark:text-orange-400 mt-12 mb-8 text-center">
        🏆 HackOverflow 2K25 Leaderboard
      </h1>

      {/* ---- Loader ---- */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-orange-500 dark:text-orange-400 w-10 h-10" />
          <span className="ml-3 text-orange-600 dark:text-orange-300 text-lg font-semibold">
            Loading Leaderboard...
          </span>
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 mt-10 text-lg">
          No leaderboard data available yet.
        </p>
      ) : (
        <div className="w-full max-w-5xl overflow-x-auto shadow-lg rounded-2xl border border-orange-200 dark:border-gray-700">
          <table className="w-full border-collapse text-center rounded-2xl overflow-hidden">
            <thead className="bg-orange-100 dark:bg-gray-900 text-orange-700 dark:text-orange-300 text-lg">
              <tr>
                <th className="p-5">Rank</th>
                <th className="p-5">Team ID</th>
                <th className="p-5">Team Name</th>
                <th className="p-5">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-b last:border-none border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                    index === 0
                      ? "bg-yellow-50 dark:bg-yellow-900/30 font-bold"
                      : index === 1
                      ? "bg-gray-50 dark:bg-gray-800/40"
                      : index === 2
                      ? "bg-orange-50 dark:bg-orange-900/30"
                      : "hover:bg-orange-50 dark:hover:bg-orange-600/20"
                  }`}
                >
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">
                    #{index + 1}
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-100">
                    {entry.id}
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-100">
                    {entry.title}
                  </td>
                  <td className="p-4 font-semibold text-orange-700 dark:text-orange-400">
                    {entry.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
