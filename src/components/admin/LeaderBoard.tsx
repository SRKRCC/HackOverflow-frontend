import React, { useEffect, useState } from "react";
import { Loader2, Trophy, Medal, Award, Sparkles, Crown } from "lucide-react";
import { ApiService } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";

const LeaderBoard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await ApiService.admin.getLeaderboard();
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

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col items-center justify-center p-6">
        <div className="relative">
          <Loader2 className="animate-spin text-primary w-16 h-16" />
          <div className="absolute inset-0 animate-ping">
            <Loader2 className="text-primary/30 w-16 h-16" />
          </div>
        </div>
        <p className="mt-6 text-foreground text-xl font-semibold animate-pulse">
          Loading Leaderboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-chart-1/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-primary animate-float" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              HackOverflow 2K25
            </h1>
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-primary animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-muted-foreground text-lg md:text-xl font-medium">
            Champions of Innovation
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
            <p className="text-muted-foreground text-xl">
              No leaderboard data available yet.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <div className="mb-12 md:mb-20 animate-slide-up">
                <div className="flex items-end justify-center gap-4 md:gap-6 lg:gap-8 px-4">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <div className="flex flex-col items-center flex-1 max-w-xs animate-scale-in" style={{ animationDelay: '0.2s' }}>
                      <div className="relative mb-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-background transform hover:scale-110 transition-transform">
                          <Medal className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          2
                        </div>
                      </div>
                      <div className="w-full bg-gradient-to-br from-card to-secondary/10 border-2 border-secondary/30 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 backdrop-blur-sm">
                        <div className="h-24 md:h-32 flex flex-col justify-center">
                          <p className="font-bold text-card-foreground text-base md:text-lg mb-2 text-center truncate" title={top3[1].title}>
                            {top3[1].title}
                          </p>
                          <div className="text-center">
                            <p className="text-3xl md:text-4xl font-black text-secondary mb-1">
                              {top3[1].totalPoints}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                              Points
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <div className="flex flex-col items-center flex-1 max-w-xs animate-scale-in" style={{ animationDelay: '0.1s' }}>
                      <div className="relative mb-4">
                        <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 text-primary animate-float" />
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl border-4 border-background transform hover:scale-110 transition-transform animate-pulse-glow">
                          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                          1
                        </div>
                        <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-pulse" />
                        <Sparkles className="absolute -bottom-2 -right-2 w-6 h-6 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
                      </div>
                      <div className="w-full bg-gradient-to-br from-card to-primary/10 border-4 border-primary/50 rounded-2xl p-5 md:p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 backdrop-blur-sm">
                        <div className="h-32 md:h-40 flex flex-col justify-center">
                          <p className="font-black text-card-foreground text-lg md:text-2xl mb-3 text-center truncate" title={top3[0].title}>
                            {top3[0].title}
                          </p>
                          <div className="text-center">
                            <p className="text-4xl md:text-6xl font-black text-primary mb-2">
                              {top3[0].totalPoints}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                              Points
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <div className="flex flex-col items-center flex-1 max-w-xs animate-scale-in" style={{ animationDelay: '0.3s' }}>
                      <div className="relative mb-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-background transform hover:scale-110 transition-transform">
                          <Award className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-chart-1 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          3
                        </div>
                      </div>
                      <div className="w-full bg-gradient-to-br from-card to-chart-1/10 border-2 border-chart-1/30 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 backdrop-blur-sm">
                        <div className="h-20 md:h-28 flex flex-col justify-center">
                          <p className="font-bold text-card-foreground text-base md:text-lg mb-2 text-center truncate" title={top3[2].title}>
                            {top3[2].title}
                          </p>
                          <div className="text-center">
                            <p className="text-2xl md:text-3xl font-black text-chart-1 mb-1">
                              {top3[2].totalPoints}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                              Points
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Remaining Teams */}
            {remaining.length > 0 && (
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span>Other Teams</span>
                  <Sparkles className="w-6 h-6 text-primary" />
                </h2>
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  {remaining.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-card border border-border hover:border-primary/50 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all hover:scale-[1.02] backdrop-blur-sm"
                      style={{ animationDelay: `${(index + 4) * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-xl flex items-center justify-center font-black text-foreground text-lg md:text-xl flex-shrink-0 border-2 border-border">
                            {index + 4}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-card-foreground text-base md:text-lg truncate mb-1" title={entry.title}>
                              {entry.title}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Team ID: {entry.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl md:text-3xl font-black text-primary">
                            {entry.totalPoints}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            pts
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
    </div>
  );
};

export default LeaderBoard;