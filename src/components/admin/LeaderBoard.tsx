// src/LeaderBoard.tsx
import React from "react";

type Team = {
  id: number;
  name: string;
  score: number;
};

const LeaderBoard: React.FC = () => {
  const teams: Team[] = [
    { id: 101, name: "Alpha Coders", score: 95 },
    { id: 102, name: "Bug Smashers", score: 88 },
    { id: 103, name: "Hack Ninjas", score: 76 },
    { id: 104, name: "Code Crushers", score: 90 },
  ];

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Title bar styled like landing page navbar */}
      <header className="py-6 bg-white text-gray-800 text-center shadow-md border-b">
        <h1 className="text-4xl font-extrabold">🏆 HackOverflow 2K25 Leaderboard</h1>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-lg border-b">
            <tr>
              <th className="p-4">Position</th>
              <th className="p-4">Team ID</th>
              <th className="p-4">Team Name</th>
              <th className="p-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr
                key={team.id}
                className="border-b hover:bg-gray-50 text-gray-800"
              >
                <td className="p-4 text-lg">#{index + 1}</td>
                <td className="p-4">{team.id}</td>
                <td className="p-4">{team.name}</td>
                <td className="p-4">{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
