import { ApiService } from "@/lib/api";
import type { Member } from "@/lib/types";
import { useState, useEffect } from "react";

interface TeamDetails {
  teamId: number;
  scc_id: string;
  title: string;
  team_members: Member[];
}

const memberColors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-indigo-500 to-indigo-600",
  "from-cyan-500 to-cyan-600",
  "from-slate-500 to-slate-600",
  "from-stone-500 to-stone-600",
];

export default function TeamCompass() {
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true);

  const centerPosition = 2;

  const getTeamMembers = async () => {
    try {
      setLoading(true);
      const response = (await ApiService.team.getDetails()) as TeamDetails;
      setTeamDetails(response);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeamMembers();
  }, []);

  const teamSize = teamDetails?.team_members?.length || 0;

  useEffect(() => {
    if (autoScroll && teamSize > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % teamSize);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoScroll, teamSize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!teamDetails || !teamDetails.team_members || teamDetails.team_members.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No team members found</p>
      </div>
    );
  }

  const selectedMemberIndex = (currentIndex + centerPosition) % teamSize;
  const selectedMember = teamDetails.team_members[selectedMemberIndex];
  const selectedColorGradient = memberColors[selectedMemberIndex % memberColors.length];

  const handleMemberClick = (clickedIndex: number) => {
    const targetCurrentIndex = (clickedIndex - centerPosition + teamSize) % teamSize;
    setCurrentIndex(targetCurrentIndex);
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const getCarouselPosition = (index: number) => {
    const relativeIndex = (index - currentIndex + teamSize) % teamSize;
    const positions = [
      { translateY: -120, scale: 0.75, opacity: 0.5, zIndex: 1 },
      { translateY: -60, scale: 0.85, opacity: 0.75, zIndex: 2 },
      { translateY: 0, scale: 1, opacity: 1, zIndex: 3 },
      { translateY: 60, scale: 0.85, opacity: 0.75, zIndex: 2 },
      { translateY: 120, scale: 0.75, opacity: 0.5, zIndex: 1 },
    ];
    return positions[relativeIndex] || { translateY: 200, scale: 0.5, opacity: 0, zIndex: 0 };
  };

  const ProfileImage = ({ size = "normal" }: { size?: "small" | "normal" }) => {
    const sizeClasses = {
      small: "w-8 h-8",
      normal: "w-full h-full",
    };

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-card flex items-center justify-center`}>
        <svg
          className={`${size === "small" ? "w-4 h-4" : "w-12 h-12"} text-muted-foreground`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
              {teamDetails.title}
            </h1>
            <p className="text-muted-foreground">Meet our talented team</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">SCC ID</p>
              <p className="font-semibold text-foreground">{teamDetails.scc_id}</p>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Team Size</p>
              <p className="font-semibold text-foreground">{teamSize}</p>
            </div>
            <div className="text-center p-3 bg-card/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Members</p>
              <p className="font-semibold text-foreground">Active</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Profile Header Background */}
              <div
                className={`h-32 bg-gradient-to-r ${selectedColorGradient}`}
              />

              {/* Profile Content */}
              <div className="px-6 sm:px-8 py-8">
                {/* Profile Avatar and Basic Info */}
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${selectedColorGradient} p-1 flex-shrink-0 shadow-lg`}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <ProfileImage size="normal" />
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <h2 className="text-3xl font-bold text-foreground mb-1">
                      {selectedMember.name}
                    </h2>
                    <p className={`text-lg font-medium bg-gradient-to-r ${selectedColorGradient} bg-clip-text text-transparent mb-2`}>
                      {selectedMember.department}
                    </p>
                    <p className="text-sm text-muted-foreground">Team Member</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Email
                      </p>
                      <p className="text-sm text-foreground break-all">
                        {selectedMember.email}
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Phone
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedMember.phone_number}
                      </p>
                    </div>

                    {/* College */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        College
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedMember.college_name}
                      </p>
                    </div>

                    {/* Year of Study */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Year of Study
                      </p>
                      <p className="text-sm text-foreground">
                        Year {selectedMember.year_of_study}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 px-2">
                Team Members
              </h3>

              {/* Carousel Container */}
              <div className="relative h-96 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {teamDetails.team_members.map((member, index) => {
                    const position = getCarouselPosition(index);
                    const colorGradient = memberColors[index % memberColors.length];
                    const isCenter = position.zIndex === 3;

                    return (
                      <div
                        key={member.id}
                        className="absolute transition-all duration-500 ease-out cursor-pointer"
                        style={{
                          transform: `translateY(${position.translateY}px) scale(${position.scale})`,
                          opacity: position.opacity,
                          zIndex: position.zIndex,
                        }}
                        onClick={() => handleMemberClick(index)}
                      >
                        {isCenter ? (
                          // Center highlighted card
                          <div className={`w-48 bg-gradient-to-r ${colorGradient} rounded-xl p-4 shadow-lg border-2 border-background`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorGradient} p-[2px]`}>
                                <div className="w-full h-full rounded-lg bg-card flex items-center justify-center">
                                  <ProfileImage size="small" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm truncate">
                                  {member.name}
                                </p>
                                <p className="text-white/80 text-xs truncate">
                                  {member.department}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Side cards - more subtle
                          <div className="w-40 bg-card rounded-lg p-3 shadow-sm border border-border/50">
                            <div className="flex items-center gap-2">
                              <div className={`w-10 h-10 rounded-md bg-gradient-to-r ${colorGradient} p-[2px] flex-shrink-0`}>
                                <div className="w-full h-full rounded-md bg-card flex items-center justify-center">
                                  <ProfileImage size="small" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-xs truncate">
                                  {member.name}
                                </p>
                                <p className="text-muted-foreground text-xs truncate">
                                  Team Member
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {teamDetails.team_members.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setAutoScroll(false);
                      setTimeout(() => setAutoScroll(true), 5000);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedMemberIndex
                        ? "bg-primary w-8"
                        : "bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to member ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}