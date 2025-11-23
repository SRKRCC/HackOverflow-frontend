import { useEffect, useState } from 'react';
import { useTeamStore } from '../../lib/stores/team';
import { useAuth } from '../../lib/hooks';
import { ClipboardList, CheckCircle, Hourglass, Timer,Bell,AlertCircle ,ListTodo} from 'lucide-react';
import { ApiService } from "@/lib/api";
import type { Announcement } from "@/lib/types";

const TeamDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    team,
    tasks = [], 
    loading, 
    error,
    fetchTeam,
    fetchTasks
  } = useTeamStore();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'team') {
      fetchTeam();
      fetchTasks();
      getAnnouncements();
    }
  }, [isAuthenticated, user, fetchTeam, fetchTasks]);

  const getAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await ApiService.team.getAnnouncements();
      setAnnouncements(response || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Helper to format ISO datetime to date string
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper to format ISO datetime to 12-hour time with AM/PM
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const stats = [
    { 
      title: "Total Tasks", 
      value: tasks.length, 
      icon: <ClipboardList className="w-6 h-6" />,
      gradient: "from-secondary/20 to-secondary/5"
    },
    { 
      title: "Completed", 
      value: tasks.filter(t => t.status === 'Completed').length, 
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: "from-chart-2/20 to-chart-2/5"
    },
    { 
      title: "Pending", 
      value: tasks.filter(t => t.status === 'Pending').length, 
      icon: <Hourglass className="w-6 h-6" />,
      gradient: "from-chart-1/20 to-chart-1/5"
    },
    { 
      title: "In Review", 
      value: tasks.filter(t => t.status === 'InReview').length, 
      icon: <Timer className="w-6 h-6" />,
      gradient: "from-primary/20 to-primary/5"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="min-h-screen bg-gray-100 dark:bg-transparent p-4 sm:p-6 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
  <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-2xl p-6 sm:p-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* Left Section */}
      <div className="flex-1">

        {/* Animated Gradient Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r 
                 from-foreground via-primary to-foreground animate-gradient">
            Team Dashboard
          </span>
        </h1>

        {/* Subtitle with animated gradient team name */}
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back,{" "}
          <span
            className="font-semibold bg-clip-text text-transparent bg-gradient-to-r 
                       from-secondary via-foreground to-secondary animate-gradient"
          >
            {team?.title || user?.email}
          </span>
        </p>
      </div>

      {/* Right Side Details */}
      {team && (
  <div className="flex flex-wrap gap-3">

    <div className="px-4 py-2 rounded-lg bg-card/40 border border-border/50 backdrop-blur-sm">
      <p 
        className="text-xs font-semibold bg-clip-text text-transparent animate-gradient"
        style={{
          backgroundImage: 'linear-gradient(90deg, oklch(0.78 0.15 265), oklch(0.58 0.22 265))'
        }}
      >
        Team ID
      </p>

      <p 
        className="text-sm font-extrabold bg-clip-text text-transparent animate-gradient"
        style={{
          backgroundImage: 'linear-gradient(90deg, oklch(0.85 0.18 265), oklch(0.60 0.23 265))'
        }}
      >
        {team.scc_id}
      </p>
    </div>

    {team.ps_id && (
      <div className="px-4 py-2 rounded-lg bg-card/40 border border-border/50 backdrop-blur-sm">
        <p 
          className="text-xs font-semibold bg-clip-text text-transparent animate-gradient"
          style={{
            backgroundImage: 'linear-gradient(90deg, oklch(0.78 0.15 265), oklch(0.58 0.22 265))'
          }}
        >
          Problem Statement
        </p>

        <p 
          className="text-sm font-extrabold bg-clip-text text-transparent animate-gradient"
          style={{
            backgroundImage: 'linear-gradient(90deg, oklch(0.85 0.18 265), oklch(0.60 0.23 265))'
          }}
        >
          #{team.ps_id}
        </p>
      </div>
    )}

  </div>
)}


    </div>
  </div>
</div>


          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-6 py-4 rounded-xl mb-8 backdrop-blur-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Enhanced Stats Grid - Shiny, Reflective, Light */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
  {stats.map((stat, index) => {

    const gradients = [
      'radial-gradient(circle at center, oklch(0.488 0.243 264.376), oklch(0.288 0.243 264.376))',
      'radial-gradient(circle at center, oklch(0.696 0.17 162.48), oklch(0.496 0.17 162.48))',
      'radial-gradient(circle at center, oklch(0.627 0.265 303.9), oklch(0.427 0.265 303.9))',
      'radial-gradient(circle at center, oklch(0.645 0.246 16.439), oklch(0.445 0.246 16.439))'
    ];

    return (
      <div
        key={index}
        className="group relative overflow-hidden rounded-xl p-5 hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-xl"
        style={{
          background: gradients[index % 4],
          backgroundSize: '150% 150%',
          animation: 'radialPulse 4s ease-in-out infinite'
        }}
      >

        {/* Soft glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700"
          style={{
            background: gradients[index % 4],
            backgroundSize: '160% 160%',
            animation: 'radialPulse 4s ease-in-out infinite'
          }}
        />

        <div className="relative z-10">
          <div className="text-white mb-3 text-3xl opacity-90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 w-fit">
            {stats[index % 4].icon}
          </div>

          <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
            {stat.title}
          </p>

          <p className="text-4xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
            {stat.value}
          </p>
        </div>

        <style>{`
          @keyframes radialPulse {
            0% { background-size: 120% 120%; }
            50% { background-size: 160% 160%; }
            100% { background-size: 120% 120%; }
          }
        `}</style>
      </div>
    );
  })}
</div>


          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Tasks - Primary Color Theme (Amber) */}
            <section className="relative rounded-2xl overflow-hidden group">
              <div className="relative bg-card/30 backdrop-blur-md border border-primary/30 rounded-2xl p-6 hover:border-primary/60 transition-all duration-300 hover:bg-card/50">
                {/* Subtle glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at top right, oklch(0.65 0.15 70 / 0.1), transparent 70%)',
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/30">
                        <ListTodo className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-primary">
                        My Tasks
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/30">
                      {tasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.length > 0 ? (
                      tasks.slice(0, 8).map((task) => (
                        <div
                          key={task.id}
                          className="group/task bg-card/20 hover:bg-card/40 border border-border/40 rounded-xl p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground/90 mb-2 group-hover/task:text-primary transition-colors">
                                {task.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2 py-1 rounded-md bg-background border border-border text-muted-foreground">
                                  Round {task.round_num}
                                </span>
                                <span className="px-2 py-1 rounded-md font-semibold bg-primary/10 text-primary border border-primary/30">
                                  {task.points} pts
                                </span>
                              </div>
                              {task.created_at && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase whitespace-nowrap ${
                                task.status === 'Completed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : task.status === 'InReview'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {task.status === 'InReview' ? 'In Review' : task.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 text-muted-foreground">
                        <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No tasks assigned yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Announcements - Secondary Color Theme (Tech Blue) */}
            <section className="relative rounded-2xl overflow-hidden group">
              <div className="relative bg-card/30 backdrop-blur-md border border-secondary/30 rounded-2xl p-6 hover:border-secondary/60 transition-all duration-300 hover:bg-card/50">
                {/* Subtle glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at top left, oklch(0.6 0.2 270 / 0.1), transparent 70%)',
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/30">
                      <Bell className="w-5 h-5 text-secondary" />
                    </div>
                    <h2 className="text-xl font-bold text-secondary">
                      Announcements
                    </h2>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {announcementsLoading ? (
                      <div className="min-h-[360px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-sm text-muted-foreground">Loading announcements...</p>
                        </div>
                      </div>
                    ) : announcements.length > 0 ? (
                      announcements.slice(0, 8).map((announcement) => (
                        <div
                          key={announcement.id}
                          className="group/announcement bg-card/20 hover:bg-card/40 border border-border/40 rounded-xl p-4 transition-all duration-300 hover:border-secondary/50 hover:shadow-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground/90 mb-2 group-hover/announcement:text-secondary transition-colors">
                              {announcement.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {announcement.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-green-600 dark:text-green-400 font-semibold">Start:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground/80">{formatDate(announcement.startTime)}</span>
                                  <span className="text-muted-foreground">{formatTime(announcement.startTime)}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-red-600 dark:text-red-400 font-semibold">End:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground/80">{formatDate(announcement.endTime)}</span>
                                  <span className="text-muted-foreground">{formatTime(announcement.endTime)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="min-h-[360px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm mb-2">No announcements yet</p>
                          <p className="text-xs text-muted-foreground/70">Check back later for updates</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
};

export default TeamDashboard;