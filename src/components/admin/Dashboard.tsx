import React from "react";

const Dashboard = () => {
  // Mock data
  const stats = [
    { title: "Total Users", value: 1250, color: "bg-blue-500" },
    { title: "Active Events", value: 15, color: "bg-green-500" },
    { title: "Pending Tasks", value: 8, color: "bg-yellow-500" },
    { title: "Revenue", value: "$45,230", color: "bg-purple-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg text-white ${stat.color}`}>
            <h2 className="text-lg font-semibold">{stat.title}</h2>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="p-4 bg-gray-100 rounded">User John Doe registered</li>
          <li className="p-4 bg-gray-100 rounded">Event "Hackathon 2025" created</li>
          <li className="p-4 bg-gray-100 rounded">Task "Update API" completed</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
