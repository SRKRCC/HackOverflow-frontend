import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  department: string;
  college_name: string;
  year_of_study: number;
  role: string;
  color: string;
  bgColor: string;
}

const teamDetails = {
  id: 1,
  scc_id: "SCC12345",
  scc_password: "securePass@123",
  title: "Innovative AI Solutions",
  team_members: [
    {
      id: 101,
      name: "Bongu Ashok",
      email: "bonguashok86@gmail.com",
      phone_number: "9392954525",
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      department: "Computer Science",
      college_name: "S R K R ENGINEERING COLLEGE",
      year_of_study: 3,
      role: "Lead",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50" ,
    },
    {
      id: 102,
      name: "Ambati Satish",
      email: "satish.ambati0804@gmail.com",
      phone_number: "8106204119",
      profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      department: "Information Technology",
      college_name: "S R K R ENGINEERING COLLEGE",
      year_of_study: 3,
      role: "Member",
      color: "from-teal-400 to-teal-600",
      bgColor: "bg-teal-50" ,

    },
    {
      id: 103,
      name: "Kotni Uma Mahesh",
      email: "umamaheshkotni2005@gmail.com",
      phone_number: "7337063596",
      profile_image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      department: "Electronics",
      college_name: "S R K R ENGINEERING COLLEGE",
      year_of_study: 2,
      role: "Member",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50" ,

    },
    {
      id: 104,
      name: "Kotni Pavan",
      email: "kotnipavan8@gmail.com",
      phone_number: "9985794617",
      profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      department: "Mechanical",
      college_name: "S R K R ENGINEERING COLLEGE",
      year_of_study: 4,
      role: "Member",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50" ,

    }
  ].filter((member, index, arr) => 
    // Remove duplicate entries (same id)
    arr.findIndex(m => m.id === member.id) === index
  ),
};

export default function TeamCompass() {
  const leaderIndex = teamDetails.team_members.findIndex(member => member.role === "Lead");
  const [currentIndex, setCurrentIndex] = useState(leaderIndex >= 0 ? leaderIndex : 0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});


  // Calculate the center position (position 2 in a 5-card layout)
  const centerPosition = 2;
  const selectedMemberIndex = (currentIndex + centerPosition) % teamDetails.team_members.length;
  const selectedMember = teamDetails.team_members[selectedMemberIndex];
  const teamSize = teamDetails.team_members.length;

  const handleMemberClick = (clickedIndex: number) => {
    // Calculate the offset needed to bring the clicked member to center position
    const targetCurrentIndex = (clickedIndex - centerPosition + teamSize) % teamSize;
    setCurrentIndex(targetCurrentIndex);
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  // Dynamic position calculation based on team size
  const getCardPosition = (index: number) => {
    const relativeIndex = (index - currentIndex + teamSize) % teamSize;
    
    // For mobile view, use a simplified horizontal layout
    if (window.innerWidth < 768) {
      const positions = [
        { left: '5%', scale: 0.7, opacity: 0.6, zIndex: 1 },
        { left: '20%', scale: 0.85, opacity: 0.8, zIndex: 2 },
        { left: '50%', scale: 1, opacity: 1, zIndex: 3 },
        { left: '80%', scale: 0.85, opacity: 0.8, zIndex: 2 },
        { left: '95%', scale: 0.7, opacity: 0.6, zIndex: 1 }
      ];
      
      if (relativeIndex < 5) {
        return { ...positions[relativeIndex], top: '50%' };
      }
      return { top: '50%', left: '120%', scale: 0.5, opacity: 0, zIndex: 0 };
    }
    
    // Calculate positions dynamically based on team size for desktop
    const visibleCards = Math.min(teamSize, 5);
    
    if (teamSize <= 3) {
      // For small teams (3 or less), use simpler positioning
      const positions = [
        { top: '35%', right: '8%', scale: 0.85, opacity: 0.8, zIndex: 2 },
        { top: '50%', right: '5%', scale: 1, opacity: 1, zIndex: 3 },
        { top: '65%', right: '8%', scale: 0.85, opacity: 0.8, zIndex: 2 }
      ];
      return positions[relativeIndex] || { top: '50%', right: '20%', scale: 0.5, opacity: 0, zIndex: 0 };
    }
    
    // For larger teams, use full 5-card layout
    const positions = [
      { top: '10%', right: '15%', scale: 0.7, opacity: 0.6, zIndex: 1 },
      { top: '30%', right: '8%', scale: 0.85, opacity: 0.8, zIndex: 2 },
      { top: '50%', right: '5%', scale: 1, opacity: 1, zIndex: 3 },
      { top: '70%', right: '8%', scale: 0.85, opacity: 0.8, zIndex: 2 },
      { top: '90%', right: '15%', scale: 0.7, opacity: 0.6, zIndex: 1 }
    ];

    if (relativeIndex < visibleCards) {
      return positions[relativeIndex];
    }
    return { top: '50%', right: '20%', scale: 0.5, opacity: 0, zIndex: 0 };
  };

  const getCardShape = (index: number) => {
    const relativeIndex = (index - currentIndex + teamSize) % teamSize;
    const visibleCards = Math.min(teamSize, 5);
    const centerIndex = Math.floor(visibleCards / 2);
    
    if (relativeIndex === centerIndex) return 'center';
    return 'card';
  };

  const ProfileImage = ({
    member,
    className = "",
    size = "normal"
  }: {
    member: TeamMember;
    className?: string;
    size?: "small" | "normal" | "large";
  }) => {
    const sizeClasses = {
      small: "w-10 h-10",
      normal: "w-full h-full",
      large: "w-16 h-16"
    };

    if (imageErrors[member.id] || !member.profile_image || member.profile_image.includes('C:')) {
      return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
          <svg
            className={`${size === "small" ? "h-5 w-5" : size === "large" ? "h-8 w-8" : "h-8 w-8"} text-gray-400`}
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
    }

    return (
      <img
        src={member.profile_image}
        alt={member.name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={() => handleImageError(member.id)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Enhanced Header */}
      <header className="relative py-8 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-20 left-1/2 w-60 h-60 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary rounded-full animate-slide-in"></div>
              <div className="mx-4">
                <svg className="w-8 h-8 text-primary animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <div className="w-12 h-1 bg-gradient-to-l from-transparent to-secondary rounded-full animate-slide-in" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4 animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                OUR TEAM
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-scale-in" style={{animationDelay: '0.4s'}}></div>
          </div>
          {/* Team Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-3 transition-all duration-300 hover:bg-card/70 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium">SCC ID</p>
                  <p className="text-foreground font-bold">{teamDetails.scc_id}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-3 transition-all duration-300 hover:bg-card/70 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium">Team Size</p>
                  <p className="text-foreground font-bold">{teamSize} Members</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-3 transition-all duration-300 hover:bg-card/70 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium">College</p>
                  <p className="text-foreground font-bold">SRKR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:grid md:grid-cols-5 min-h-[calc(100vh-200px)]">
        {/* Left Side - Detailed Profile */}
        <div className="md:col-span-3 flex flex-col justify-center p-4 md:p-8 order-2 md:order-1">
          <div className={`${localStorage.getItem("theme") === "dark" ? "bg-zinc-900" :selectedMember.bgColor} rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-700 transform max-w-2xl mx-auto border`}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-6">
              <div className="relative mb-4 md:mb-0">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r ${selectedMember.color} p-1 shadow-xl`}>
                  <ProfileImage member={selectedMember} size="normal" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{selectedMember.name}</h2>
                <p className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${selectedMember.color} bg-clip-text text-transparent mb-1`}>
                  Team {selectedMember.role}
                </p>
                <p className="text-base md:text-lg text-muted-foreground">{selectedMember.department}</p>
              </div>
            </div>

              {/* Detailed Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg lg:rounded-xl">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center shadow-md shrink-0`}>
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Institution</p>
                      <p className="text-sm lg:text-base text-gray-900 dark:text-white font-semibold leading-tight">
                        {selectedMember.college_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg lg:rounded-xl">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center shadow-md shrink-0`}>
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Academic Year</p>
                      <p className="text-sm lg:text-base text-gray-900 dark:text-white font-semibold">
                        {selectedMember.year_of_study}{selectedMember.year_of_study === 1 ? 'st' : 
                         selectedMember.year_of_study === 2 ? 'nd' : 
                         selectedMember.year_of_study === 3 ? 'rd' : 'th'} Year
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg lg:rounded-xl">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center shadow-md shrink-0`}>
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="text-sm lg:text-base text-gray-900 dark:text-white font-semibold break-all">
                        {selectedMember.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg lg:rounded-xl">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center shadow-md shrink-0`}>
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Contact Number</p>
                      <p className="text-sm lg:text-base text-gray-900 dark:text-white font-semibold">
                        +91 {selectedMember.phone_number}
                      </p>
                    </div>
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

              if (!position) return null;
              
              return (
                <div
                  key={member.id}
                  className="absolute transition-all duration-700 ease-in-out cursor-pointer hover:scale-110"
                  style={{
                    top: position.top,
                    right: window.innerWidth >= 768 && 'right' in position ? position.right : undefined,
                    left: window.innerWidth < 768 && 'left' in position ? position.left : undefined,
                    transform: `translate(-50%, -50%) scale(${position.scale})`,
                    opacity: position.opacity,
                    zIndex: position.zIndex,
                  }}
                  onClick={() => handleMemberClick(index)}
                >
                  {isCenter ? (
                    // Center Card - Always detailed
                    <div className={`${localStorage.getItem("theme") === "dark" ? "bg-zinc-900" :member.bgColor} rounded-2xl p-4 shadow-xl w-64 md:w-72 border-4 border-background hover:shadow-2xl transition-all duration-300 border`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${member.color} p-1 shadow-lg`}>
                          <ProfileImage member={member} size="large" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {member.name}
                          </h4>
                          <p className={`text-xs font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                            Team {member.role}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {member.department}
                          </p>
                        </div>
                        {index === currentIndex && (
                          <div className="shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Non-center Cards - Uniform card style
                    <div className={`${localStorage.getItem("theme") === "dark" ? "bg-zinc-900" :member.bgColor } rounded-xl p-3 shadow-lg w-40 md:w-48 hover:shadow-xl transition-all duration-300 border`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${member.color} p-1 shadow-md`}>
                          <ProfileImage member={member} size="small" className="w-full h-full" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground dark:text-sidebar-foreground text-xs md:text-sm truncate">{member.name}</h4>
                          <p className="text-xs text-muted-foreground dark:text-sidebar-foreground/70 truncate">Team {member.role}</p>
                        </div>
                        {index === currentIndex && (
                          <div className="text-blue-500 shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}