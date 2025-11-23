import { ApiService } from "@/lib/api";
import type { Member } from "@/lib/types";
import { useState, useEffect } from "react";

interface TeamDetails {
  teamId: number;
  scc_id: string;
  title: string;
  team_members: Member[];
}

// removed the previous multi-color array — we now use two exact OKLCH gradients
const PRIMARY_GRADIENT = "from-[oklch(0.75_0.10_70)] to-[oklch(0.65_0.15_70)]";

const SECONDARY_GRADIENT =
  "from-[oklch(0.70_0.15_270)] to-[oklch(0.50_0.22_270)]";

export default function TeamCompass() {
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true);

  // This boolean toggles each time the carousel changes.
  // When true: active member uses PRIMARY, others use SECONDARY.
  // When false: active member uses SECONDARY, others use PRIMARY.
  const [isPrimaryCycle, setIsPrimaryCycle] = useState(true);

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

  // Auto-scroll: also toggle the color cycle on every tick
  useEffect(() => {
    if (autoScroll && teamSize > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % teamSize);
        setIsPrimaryCycle((prev) => !prev);
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

  if (
    !teamDetails ||
    !teamDetails.team_members ||
    teamDetails.team_members.length === 0
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No team members found</p>
      </div>
    );
  }

  // selectedMemberIndex uses the same centerPosition logic you had
  const selectedMemberIndex = (currentIndex + centerPosition) % teamSize;
  const selectedMember = teamDetails.team_members[selectedMemberIndex];

  // Helper to get correct gradient (active vs others) based on isPrimaryCycle
  const getGradientForIndex = (index: number) => {
    const isActive = index === selectedMemberIndex;
    if (isActive) {
      return isPrimaryCycle ? PRIMARY_GRADIENT : SECONDARY_GRADIENT;
    } else {
      return isPrimaryCycle ? SECONDARY_GRADIENT : PRIMARY_GRADIENT;
    }
  };

  // When a user clicks a member, keep your existing mapping but toggle cycle
  const handleMemberClick = (clickedIndex: number) => {
    const targetCurrentIndex =
      (clickedIndex - centerPosition + teamSize) % teamSize;
    setCurrentIndex(targetCurrentIndex);
    setAutoScroll(false);
    // toggle the cycle on user interaction as well
    setIsPrimaryCycle((prev) => !prev);
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
    return (
      positions[relativeIndex] || {
        translateY: 200,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
      }
    );
  };

  // Smaller avatar sizes included; added a "tiny" option for very small icons
  const ProfileImage = ({
    size = "normal",
  }: {
    size?: "tiny" | "small" | "normal";
  }) => {
    const sizeClasses: Record<string, string> = {
      tiny: "w-6 h-6",
      small: "w-8 h-8",
      normal: "w-full h-full",
    };

    const iconSize =
      size === "tiny" ? "w-3 h-3" : size === "small" ? "w-4 h-4" : "w-12 h-12";

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-card flex items-center justify-center`}
      >
        <svg
          className={`${iconSize} text-muted-foreground`}
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
      <header className="relative py-10 px-4  border-b border-border/40">
        {/* Animated Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-36 -right-36 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-36 -left-36 w-72 h-72 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1.2s" }}
          ></div>
          <div className="absolute top-24 left-1/2 w-48 h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Title Section */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="w-10 h-1 bg-gradient-to-r from-transparent to-primary rounded-full animate-slide-in"></div>

              <div className="mx-3">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>

              <div
                className="w-10 h-1 bg-gradient-to-l from-transparent to-secondary rounded-full animate-slide-in"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                {teamDetails.title}
              </span>
            </h1>

            <div
              className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-3 animate-scale-in"
              style={{ animationDelay: "0.45s" }}
            ></div>
          </div>

          {/* Info Cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-muted-foreground mb-0.5">SCC ID</p>
              <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
                {teamDetails.scc_id}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-muted-foreground mb-0.5">Team Size</p>
              <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
                {teamDetails.team_members.length}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-muted-foreground mb-0.5">Members</p>
              <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
                Active
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* LEFT — Profile Section (matches active member gradient) */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-3xl border border-border/40 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {/* Header Banner with subtle pattern overlay */}
              <div
                className={`relative h-22 bg-gradient-to-r ${getGradientForIndex(
                  selectedMemberIndex
                )} overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>
              </div>

              {/* Content Container with negative margin for avatar overlap */}
              <div className="relative px-6 sm:px-10 pb-10">
                {/* Avatar with overlap effect */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 mb-8">
                  {/* Avatar */}
                  <div
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradientForIndex(
                      selectedMemberIndex
                    )} p-1 shadow-2xl flex-shrink-0 ring-4 ring-card`}
                  >
                    <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                      <ProfileImage size="normal" />
                    </div>
                    {/* Subtle glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getGradientForIndex(
                        selectedMemberIndex
                      )} opacity-20 blur-xl -z-10`}
                    />
                  </div>

                  {/* Text Info - Better hierarchy */}
                  <div className="flex-1 sm:pb-2">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
                      {selectedMember.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 py-2">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${getGradientForIndex(
                          selectedMemberIndex
                        )} text-white shadow-md`}
                      >
                        {selectedMember.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Team Member
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid - Card-based layout with icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="group relative bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all duration-200 border border-border/30 hover:border-border/60">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-lg bg-gradient-to-br ${getGradientForIndex(
                          selectedMemberIndex
                        )} flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Email
                        </p>
                        <p className="text-sm font-medium text-foreground break-all group-hover:text-primary transition-colors">
                          {selectedMember.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group relative bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all duration-200 border border-border/30 hover:border-border/60">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-lg bg-gradient-to-br ${getGradientForIndex(
                          selectedMemberIndex
                        )} flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {selectedMember.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* College */}
                  <div className="group relative bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all duration-200 border border-border/30 hover:border-border/60">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-lg bg-gradient-to-br ${getGradientForIndex(
                          selectedMemberIndex
                        )} flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          College
                        </p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {selectedMember.college_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Year of Study */}
                  <div className="group relative bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all duration-200 border border-border/30 hover:border-border/60">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-lg bg-gradient-to-br ${getGradientForIndex(
                          selectedMemberIndex
                        )} flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Year of Study
                        </p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          Year {selectedMember.year_of_study}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Carousel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 px-2">
                Team Members
              </h3>

              <div className="relative h-80 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {teamDetails.team_members.map((member, index) => {
                    const position = getCarouselPosition(index);
                    const gradient = getGradientForIndex(index);
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
                          // CENTER CARD (slightly reduced width)
                          <div
                            className={`w-36 bg-gradient-to-br ${gradient} rounded-xl p-3 shadow-lg border border-background`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-9 h-9 rounded-md bg-gradient-to-r ${gradient} p-[2px]`}
                              >
                                <div className="w-full h-full rounded-md bg-card flex items-center justify-center">
                                  <ProfileImage size="tiny" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-xs truncate">
                                  {member.name}
                                </p>
                                <p className="text-white/80 text-[10px] truncate">
                                  {member.department}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // SIDE CARDS (primary/secondary applied by getGradientForIndex)
                          <div className="w-28 bg-card rounded-lg p-2 shadow-sm border border-border/50">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded bg-gradient-to-r ${gradient} p-[2px]`}
                              >
                                <div className="w-full h-full rounded bg-card flex items-center justify-center">
                                  <ProfileImage size="tiny" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-[11px] truncate">
                                  {member.name}
                                </p>
                                <p className="text-muted-foreground text-[10px] truncate">
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

              {/* INDICATORS */}
              <div className="flex justify-center gap-1.5 mt-5">
                {teamDetails.team_members.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // preserve your original indicator behavior (sets current index directly),
                      // while toggling the color cycle as requested
                      setCurrentIndex(index);
                      setAutoScroll(false);
                      setIsPrimaryCycle((prev) => !prev);
                      setTimeout(() => setAutoScroll(true), 5000);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      index === selectedMemberIndex
                        ? "bg-primary w-6"
                        : "bg-border w-2"
                    }`}
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
