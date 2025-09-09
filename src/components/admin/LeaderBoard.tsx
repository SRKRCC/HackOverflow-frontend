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
    { id: 105, name: "Script Masters", score: 85 },
    { id: 106, name: "Binary Beasts", score: 92 },
    { id: 107, name: "Dev Ninjas", score: 80 },
    { id: 108, name: "Cyber Spartans", score: 70 },
    { id: 109, name: "Logic Lords", score: 83 },
    { id: 110, name: "Pixel Pirates", score: 78 },
    { id: 111, name: "Algo Ninjas", score: 82 },
    { id: 112, name: "Data Dynamos", score: 89 },
  ];

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex flex-col items-center p-6 pb-20">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mt-12 mb-8 text-center">
        🏆 HackOverflow 2K25 Leaderboard
      </h1>

      {/* Table */}
      <div className="w-full max-w-5xl overflow-x-auto shadow-lg rounded-2xl border border-orange-200">
        <table className="w-full border-collapse rounded-2xl overflow-hidden text-center">
          <thead className="bg-orange-100 text-orange-700 text-lg">
            <tr>
              <th className="p-5">Position</th>
              <th className="p-5">Team ID</th>
              <th className="p-5">Team Name</th>
              <th className="p-5">Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr
                key={team.id}
                className="border-b last:border-none hover:bg-orange-50 transition"
              >
                <td className="p-3 font-semibold text-gray-800">#{index + 1}</td>
                <td className="p-3 text-gray-700">{team.id}</td>
                <td className="p-3 text-gray-700">{team.name}</td>
                <td className="p-3 text-gray-700">{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
