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

      <div className="flex flex-col md:grid md:grid-cols-5 min-h-[calc(100vh-200px)]">
        {/* Left Side - Detailed Profile */}
        <div className="md:col-span-3 flex flex-col justify-center p-4 md:p-8 order-2 md:order-1">
          <div className={`${typeof window !== 'undefined' && localStorage.getItem("theme") === "dark" ? "bg-zinc-900" : selectedColorScheme.bgColor} rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-700 transform max-w-2xl mx-auto border`}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-6">
              <div className="relative mb-4 md:mb-0">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r ${selectedColorScheme.color} p-1 shadow-xl`}>
                  <ProfileImage size="normal" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{selectedMember.name}</h2>
                <p className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${selectedColorScheme.color} bg-clip-text text-transparent mb-1`}>
                  Team Member
                </p>
                <p className="text-base md:text-lg text-muted-foreground">{selectedMember.department}</p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedColorScheme.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
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

        {/* Right Side - Dynamic Carousel */}
        <div className="md:col-span-2 relative h-80 md:h-auto order-1 md:order-2">
          {/* Path Indicator - Hidden on mobile */}
          <div className="hidden md:block absolute top-1/2 right-16 w-1 h-auto bg-gradient-to-b from-transparent via-border to-transparent rounded-full transform -translate-y-1/2 opacity-30"></div>
          
          {/* Cards Container */}
          <div className="relative w-full h-full">
            {teamDetails.team_members.map((member, index) => {
              const position = getCardPosition(index);
              const shape = getCardShape(index);
              const isCenter = shape === 'center';
              const memberColorScheme = colorSchemes[index % colorSchemes.length];

              if (!position) return null;
              
              return (
                <div
                  key={member.id}
                  className="absolute transition-all duration-700 ease-in-out cursor-pointer hover:scale-110"
                  style={{
                    top: position.top,
                    right: typeof window !== 'undefined' && window.innerWidth >= 768 && 'right' in position ? position.right : undefined,
                    left: typeof window !== 'undefined' && window.innerWidth < 768 && 'left' in position ? position.left : undefined,
                    transform: `translate(-50%, -50%) scale(${position.scale})`,
                    opacity: position.opacity,
                    zIndex: position.zIndex,
                  }}
                  onClick={() => handleMemberClick(index)}
                >
                  {isCenter ? (
                    <div
                      className={`${
                        typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
                          ? "bg-zinc-900"
                          : memberColorScheme.bgColor
                      } rounded-2xl p-4 shadow-xl w-64 md:w-72 border-4 border-background hover:shadow-2xl transition-all duration-300`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${memberColorScheme.color} p-[2px] shadow-lg overflow-hidden`}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden bg-background">
                            <ProfileImage
                              size="large"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-base md:text-lg">
                            {member.name}
                          </h3>
                          <p
                            className={`text-xs md:text-sm font-medium bg-gradient-to-r ${memberColorScheme.color} bg-clip-text text-transparent`}
                          >
                            Team Member
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {member.department}
                          </p>
                        </div>
                      </div>
                    </div>


                  ) : (
                    // Non-center Cards - Uniform card style
                    <div className={`${typeof window !== 'undefined' && localStorage.getItem("theme") === "dark" ? "bg-zinc-900" : memberColorScheme.bgColor} rounded-xl p-3 shadow-lg w-40 md:w-48 hover:shadow-xl transition-all duration-300 border`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${memberColorScheme.color} p-1 shadow-md`}>
                          <ProfileImage size="small" className="w-full h-full" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground dark:text-sidebar-foreground text-xs md:text-sm truncate">{member.name}</h4>
                          <p className="text-xs text-muted-foreground dark:text-sidebar-foreground/70 truncate">Team Member</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}