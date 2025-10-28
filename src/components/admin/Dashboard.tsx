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

  const stats = [
    { 
      title: "Total Tasks", 
      value: tasks.length, 
      icon: "📋",
      gradient: "from-secondary/20 to-secondary/5"
    },
    { 
      title: "Completed", 
      value: tasks.filter(t => t.completed).length, 
      icon: "✓",
      gradient: "from-chart-2/20 to-chart-2/5"
    },
    { 
      title: "In Review", 
      value: tasks.filter(t => t.in_review).length, 
      icon: "⏱",
      gradient: "from-primary/20 to-primary/5"
    },
    { 
      title: "Active Teams", 
      value: leaderboard.length, 
      icon: "👥",
      gradient: "from-chart-1/20 to-chart-1/5"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3, 5);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="text-primary font-semibold">{user?.email}</span>
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive px-6 py-4 rounded-xl mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border border-border rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-5xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="text-5xl opacity-30">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
          
        {/* Content Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 📝 Recent Tasks */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <span>📝</span>
                Recent Tasks
              </h2>
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-medium">
                {tasks.length}
              </span>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="group bg-muted/40 border border-border hover:border-accent/40 rounded-lg p-4 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm sm:text-base text-card-foreground group-hover:text-accent transition-colors flex-1">
                        {task.title}
                      </h3>
                      <span
                        className={`ml-3 px-2 py-1 rounded-md text-[10px] font-semibold uppercase ${
                          task.completed
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : task.in_review
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mt-1">
                      <span className="px-2 py-1 bg-background border border-border rounded-md font-medium">
                        Round {task.round_num}
                      </span>
                      <span className="font-semibold text-primary">{task.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground flex-1 flex flex-col items-center justify-center">
                <div className="text-4xl mb-2 opacity-30">📋</div>
                <p>No tasks available</p>
              </div>
            )}
          </div>

          {/* 🏆 Leaderboard */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2 justify-center">
              <span className="text-2xl">🏆</span>
              Leaderboard
            </h2>

            {leaderboard.length > 0 ? (
              <div className="flex-1 flex flex-col">
                {/* --- Top 3 Podium --- */}
                <div className="flex items-end justify-center gap-3 mb-6">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-500 rounded-xl flex items-center justify-center text-2xl mb-2 shadow">
                        🥈
                      </div>
                      <div className="border border-border rounded-lg p-3 text-center h-20 w-full flex flex-col justify-center">
                        <p className="font-semibold text-sm truncate">{top3[1].title}</p>
                        <p className="text-lg font-bold text-slate-600 dark:text-slate-200">{top3[1].totalPoints}</p>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <div className="flex flex-col items-center flex-1 scale-110">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-3xl mb-2 shadow-lg ring-2 ring-yellow-300/40 animate-pulse">
                        🥇
                      </div>
                      <div className="border border-yellow-400/50 rounded-lg p-4 text-center h-24 w-full flex flex-col justify-center">
                        <p className="font-bold text-base truncate">{top3[0].title}</p>
                        <p className="text-xl font-extrabold text-yellow-600 dark:text-yellow-300">{top3[0].totalPoints}</p>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl flex items-center justify-center text-2xl mb-2 shadow">
                        🥉
                      </div>
                      <div className="border border-amber-700/40 rounded-lg p-3 text-center h-20 w-full flex flex-col justify-center">
                        <p className="font-semibold text-sm truncate">{top3[2].title}</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{top3[2].totalPoints}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- Remaining Teams --- */}
                {remaining.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
                    {remaining.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-muted/30 border border-border rounded-lg p-3 hover:bg-muted/60 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center text-accent text-xs font-semibold">
                              #{entry.rank}
                            </div>
                            <div>
                              <p className="font-medium text-sm truncate">{entry.title}</p>
                              <p className="text-xs text-muted-foreground">{entry.completedTasks} tasks</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-foreground">{entry.totalPoints}</p>
                            <p className="text-[10px] text-muted-foreground">pts</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground flex-1 flex flex-col items-center justify-center">
                <div className="text-4xl mb-2 opacity-30">🏆</div>
                <p>No leaderboard data available</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;