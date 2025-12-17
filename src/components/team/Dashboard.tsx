import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "../../lib/stores/team";
import { useAuth } from "../../lib/hooks";
import {
  ClipboardList,
  CheckCircle,
  Hourglass,
  Timer,
  Bell,
  AlertCircle,
  ListTodo,
} from "lucide-react";

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    team,
    problemStatement,
    loading,
    error,
    fetchTeam,
    announcements,
    fetchAnnouncements,
  } = useTeamStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === "team") {
      fetchTeam();
      fetchAnnouncements();
    }
  }, [isAuthenticated, user, fetchTeam, fetchAnnouncements]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const tasks = team?.tasks || [];

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: <ClipboardList className="w-6 h-6" />,
      gradient: "from-secondary/20 to-secondary/5",
      filter: "All",
    },
    {
      title: "Completed",
      value: tasks.filter((t) => t.status === "Completed").length,
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: "from-chart-2/20 to-chart-2/5",
      filter: "Completed",
    },
    {
      title: "In Review",
      value: tasks.filter((t) => t.status === "InReview").length,
      icon: <Timer className="w-6 h-6" />,
      gradient: "from-primary/20 to-primary/5",
      filter: "InReview",
    },
    {
      title: "Pending",
      value: tasks.filter((t) => t.status === "Pending").length,
      icon: <Hourglass className="w-6 h-6" />,
      gradient: "from-chart-1/20 to-chart-1/5",
      filter: "Pending",
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
          <div className="mb-4 sm:mb-8">
            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                    <span
                      className="bg-clip-text text-transparent bg-gradient-to-r 
                 from-foreground via-primary to-foreground animate-gradient"
                    >
                      Team Dashboard
                    </span>
                  </h1>

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

                {team && (
                  <div className="flex flex-wrap gap-3">
                    <div className="px-2 py-2 rounded-lg bg-card/40 border border-border/50 backdrop-blur-sm">
                      <p
                        className="text-xs font-semibold bg-clip-text text-transparent animate-gradient"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, oklch(0.78 0.15 265), oklch(0.58 0.22 265))",
                        }}
                      >
                        Team ID
                      </p>

                      <p
                        className="text-sm font-extrabold bg-clip-text text-transparent animate-gradient"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, oklch(0.85 0.18 265), oklch(0.60 0.23 265))",
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
                            backgroundImage:
                              "linear-gradient(90deg, oklch(0.78 0.15 265), oklch(0.58 0.22 265))",
                          }}
                        >
                          Problem Statement
                        </p>

                        <p
                          className="text-sm font-extrabold bg-clip-text text-transparent animate-gradient"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, oklch(0.85 0.18 265), oklch(0.60 0.23 265))",
                          }}
                        >
                          #{problemStatement?.psId || team.ps_id}
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


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                onClick={() => navigate(`/team/tasks?filter=${stat.filter}`)}
                className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border border-border rounded-xl p-5 hover:scale-105 transition-transform duration-300 cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-foreground truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-4xl opacity-30 shrink-0 ml-2">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="relative rounded-2xl overflow-hidden group">
              <div className="relative bg-card/30 backdrop-blur-md border border-primary/30 rounded-2xl p-6 hover:border-primary/60 transition-all duration-300 hover:bg-card/50">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at top right, oklch(0.65 0.15 70 / 0.1), transparent 70%)",
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
                          onClick={() => navigate(`/team/tasks?filter=${task.status}`)}
                          className="group/task bg-card/40 sm:bg-card/20 sm:hover:bg-card/40 border border-primary/30 sm:border-border/40 rounded-xl p-4 transition-all duration-300 sm:hover:border-primary/50 shadow-lg sm:shadow-none sm:hover:shadow-lg cursor-pointer"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-primary sm:text-foreground/90 mb-2 sm:group-hover/task:text-primary transition-colors">
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
                                  {new Date(task.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              )}
                            </div>
                            <span
                              className="px-3 py-1 text-xs font-semibold uppercase whitespace-nowrap w-fit rounded-lg relative"
                              style={{
                                background:
                                  (task.status === "Completed"
                                    ? "radial-gradient(circle at center, oklch(0.696 0.17 162.48), oklch(0.496 0.17 162.48))"
                                    : task.status === "Pending"
                                    ? "radial-gradient(circle at center, oklch(0.627 0.265 303.9), oklch(0.427 0.265 303.9))"
                                    : "radial-gradient(circle at center, oklch(0.645 0.246 16.439), oklch(0.445 0.246 16.439))") +
                                  ", transparent",

                                backgroundClip: "padding-box, border-box",
                                padding: "4px 12px",
                                border: "2px solid transparent",
                                borderRadius: "6px",

                                WebkitBackgroundClip: "text",
                                color: "transparent",

                                boxShadow:
                                  "0 0 10px " +
                                  (task.status === "Completed"
                                    ? "oklch(0.696 0.17 162.48 / 0.6)"
                                    : task.status === "Pending"
                                    ? "oklch(0.627 0.265 303.9 / 0.6)"
                                    : "oklch(0.645 0.246 16.439 / 0.6)"),
                              }}
                            >
                              {task.status === "InReview"
                                ? "In Review"
                                : task.status}
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

            <section className="relative rounded-2xl overflow-hidden group">
              <div className="relative bg-card/30 backdrop-blur-md border border-secondary/30 rounded-2xl p-6 hover:border-secondary/60 transition-all duration-300 hover:bg-card/50">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at top left, oklch(0.6 0.2 270 / 0.1), transparent 70%)",
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
                    {announcements && announcements.length > 0 ? (
                      announcements.slice(0, 8).map((announcement) => (
                        <div
                          key={announcement.id}
                          className="group/announcement bg-card/40 sm:bg-card/20 sm:hover:bg-card/40 border border-secondary/40 sm:border-border/40 rounded-xl p-4 transition-all duration-300 sm:hover:border-secondary/50 shadow-lg sm:shadow-none sm:hover:shadow-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-secondary sm:text-foreground/90 mb-2 sm:group-hover/announcement:text-secondary transition-colors">
                              {announcement.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {announcement.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center text-xs">
                                <span className="text-green-600 dark:text-green-400 font-semibold">
                                  Start:
                                </span>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-foreground/80">
                                    {formatDate(announcement.startTime)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatTime(announcement.startTime)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center text-xs">
                                <span className="text-red-600 dark:text-red-400 font-semibold">
                                  End:
                                </span>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-foreground/80">
                                    {formatDate(announcement.endTime)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatTime(announcement.endTime)}
                                  </span>
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
                          <p className="text-xs text-muted-foreground/70">
                            Check back later for updates
                          </p>
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
    </div>
  );
};

export default TeamDashboard;
