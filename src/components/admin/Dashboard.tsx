import { useEffect } from 'react';
import { useAdminStore } from '../../lib/stores/admin';
import { useAuth } from '../../lib/hooks';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    tasks, 
    leaderboard, 
    loading, 
    error,
    fetchTasks, 
    fetchLeaderboard 
  } = useAdminStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchTasks();
      fetchLeaderboard();
    }
  }, [isAuthenticated, user, fetchTasks, fetchLeaderboard]);

  // Simple stats based on actual data
  const stats = [
    { title: "Total Tasks", value: tasks.length, color: "bg-blue-500" },
    { title: "Completed Tasks", value: tasks.filter(t => t.completed).length, color: "bg-green-500" },
    { title: "In Review", value: tasks.filter(t => t.in_review).length, color: "bg-yellow-500" },
    { title: "Teams on Leaderboard", value: leaderboard.length, color: "bg-purple-500" },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg text-white ${stat.color}`}>
            <h2 className="text-lg font-semibold">{stat.title}</h2>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">Round {task.round_num} • {task.points} points</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.completed ? 'bg-green-100 text-green-800' :
                    task.in_review ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks available</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Leaderboard Preview</h2>
          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {entry.rank}
                    </span>
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-sm text-gray-600">{entry.completedTasks} tasks completed</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600">{entry.totalPoints} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No leaderboard data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
