import { useEffect, useState } from 'react';
import { useAdminStore } from '../../lib/stores/admin';
import { useAuth } from '../../lib/hooks';
import { ApiService } from '../../lib/api';
import type { TasksOverview, Team } from '../../lib/types';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    leaderboard, 
    fetchLeaderboard 
  } = useAdminStore();
  
  const [tasksOverview, setTasksOverview] = useState<TasksOverview | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
      fetchLeaderboard();
      fetchTeamsData();
    }
  }, [isAuthenticated, user, fetchLeaderboard]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const overview = await ApiService.admin.getTasksOverview();
      setTasksOverview(overview);
    } catch (err) {
      console.error('Error fetching tasks overview:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTeamsData = async () => {
    try {
      setLoadingTeams(true);
      const teamsData = await ApiService.admin.getAllTeams();
      setTeams(teamsData || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  };
  
  const totalMembers = teams.reduce((sum, team) => sum + (team.member_count || 0), 0);

  const stats = [
    { 
      title: "Total Tasks", 
      value: tasksOverview?.stats.total || 0, 
      icon: "📋",
      gradient: "from-secondary/20 to-secondary/5"
    },
    { 
      title: "Completed", 
      value: tasksOverview?.stats.completed || 0, 
      icon: "✓",
      gradient: "from-chart-2/20 to-chart-2/5"
    },
    { 
      title: "In Review", 
      value: tasksOverview?.stats.in_review || 0, 
      icon: "⏱",
      gradient: "from-primary/20 to-primary/5"
    },
    { 
      title: "Active Teams", 
      value: leaderboard.length, 
      icon: "👥",
      gradient: "from-chart-1/20 to-chart-1/5"
    },
    { 
      title: "Total Members", 
      value: loadingTeams ? '...' : totalMembers, 
      icon: "👤",
      gradient: "from-blue-500/20 to-blue-500/5"
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
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Welcome back, <span className="text-primary font-semibold break-all">{user?.email}</span>
          </p>
        </div>
        
        {/* {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl">⚠️</span>
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )} */}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mb-6 sm:mb-8 md:mb-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm font-medium mb-1 sm:mb-2 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl opacity-30 shrink-0 ml-2">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
          
        {/* Content Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* 📝 Recent Tasks */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 shadow-sm backdrop-blur-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground flex items-center gap-2">
                <span className="text-lg sm:text-xl">📝</span>
                <span>Recent Tasks</span>
              </h2>
              <span className="px-2 sm:px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-[10px] sm:text-xs font-medium">
                {tasksOverview?.recentTasks.length ?? 0}
              </span>
            </div>

            {tasksOverview?.recentTasks && tasksOverview.recentTasks.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent max-h-[400px] sm:max-h-none">
                {tasksOverview.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-muted/40 border border-border hover:border-accent/40 rounded-lg p-3 sm:p-4 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-card-foreground group-hover:text-accent transition-colors flex-1 break-words">
                        {task.title}
                      </h3>
                      <span
                        className={`shrink-0 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-semibold uppercase ${
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

                    <div className="flex items-center justify-between text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">
                      <span className="px-2 py-1 bg-background border border-border rounded-md font-medium">
                        Round {task.round_num}
                      </span>
                      <span className="font-semibold text-primary">{task.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10 text-muted-foreground flex-1 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl mb-2 opacity-30">📋</div>
                <p className="text-sm sm:text-base">No tasks available</p>
              </div>
            )}
          </div>

          {/* 🏆 Leaderboard */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 shadow-sm backdrop-blur-sm flex flex-col h-full">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-card-foreground mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 justify-center">
              <span className="text-xl sm:text-2xl">🏆</span>
              <span>Leaderboard</span>
            </h2>

            {leaderboard.length > 0 ? (
              <div className="flex-1 flex flex-col">
                {/* --- Top 3 Podium --- */}
                <div className="flex items-end justify-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <div className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-[120px]">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-300 to-slate-500 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-2 shadow">
                        🥈
                      </div>
                      <div className="border border-border rounded-lg p-2 sm:p-3 text-center h-16 sm:h-20 w-full flex flex-col justify-center">
                        <p className="font-semibold text-[10px] sm:text-xs md:text-sm truncate px-1">{top3[1].title}</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-slate-600 dark:text-slate-200">{top3[1].totalPoints}</p>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <div className="flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[130px] scale-105 sm:scale-110">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-lg ring-2 ring-yellow-300/40 animate-pulse">
                        🥇
                      </div>
                      <div className="border border-yellow-400/50 rounded-lg p-3 sm:p-4 text-center h-20 sm:h-24 w-full flex flex-col justify-center">
                        <p className="font-bold text-xs sm:text-sm md:text-base truncate px-1">{top3[0].title}</p>
                        <p className="text-base sm:text-lg md:text-xl font-extrabold text-yellow-600 dark:text-yellow-300">{top3[0].totalPoints}</p>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <div className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-[120px]">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-700 to-amber-800 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-2 shadow">
                        🥉
                      </div>
                      <div className="border border-amber-700/40 rounded-lg p-2 sm:p-3 text-center h-16 sm:h-20 w-full flex flex-col justify-center">
                        <p className="font-semibold text-[10px] sm:text-xs md:text-sm truncate px-1">{top3[2].title}</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-amber-700 dark:text-amber-300">{top3[2].totalPoints}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- Remaining Teams --- */}
                {remaining.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent max-h-[200px] sm:max-h-[250px] md:max-h-none">
                    {remaining.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-muted/30 border border-border rounded-lg p-2.5 sm:p-3 hover:bg-muted/60 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent/10 rounded-md flex items-center justify-center text-accent text-[10px] sm:text-xs font-semibold shrink-0">
                              #{entry.rank}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-xs sm:text-sm truncate">{entry.title}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">{entry.completedTasks} tasks</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm sm:text-base font-bold text-foreground">{entry.totalPoints}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground">pts</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10 text-muted-foreground flex-1 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl mb-2 opacity-30">🏆</div>
                <p className="text-sm sm:text-base">No leaderboard data available</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;