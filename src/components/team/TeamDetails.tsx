import { useState, useEffect } from "react";

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
      bgColor: "bg-purple-50"
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
      bgColor: "bg-teal-50"
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
      bgColor: "bg-orange-50"
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
      bgColor: "bg-blue-50"
    },
    {
      id: 105,
      name: "Simma Rohith",
      email: "rohithsimma@gmail.com",
      phone_number: "8008084781",
      profile_image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      department: "Civil Engineering",
      college_name: "S R K R ENGINEERING COLLEGE",
      year_of_study: 2,
      role: "Member",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      id: 106,
      name: "Test Member",
      email: "test@gmail.com",
      phone_number: "1234567890",
      profile_image: "https://images.unsplash.com/photo-1494790108755-2616b612b376?w=150&h=150&fit=crop&crop=face",
      department: "Computer Science",
      college_name: "S R K R ENGINEERING COLLEGE",
      year_of_study: 1,
      role: "Member",
      color: "from-indigo-400 to-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ].filter((member, index, arr) => 
    // Remove duplicate entries (same id)
    arr.findIndex(m => m.id === member.id) === index
  ),
};

export default function TeamCompass() {
  const leaderIndex = teamDetails.team_members.findIndex(member => member.role === "Lead");
  const [currentIndex, setCurrentIndex] = useState(leaderIndex >= 0 ? leaderIndex : 0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const selectedMember = teamDetails.team_members[currentIndex];
  const teamSize = teamDetails.team_members.length;

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll && teamSize > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % teamSize);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoScroll, teamSize]);

  const handleMemberClick = (index: number) => {
    setCurrentIndex(index);
    setAutoScroll(false);
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  // Dynamic position calculation based on team size
  const getCardPosition = (index: number) => {
    const relativeIndex = (index - currentIndex + teamSize) % teamSize;
    
    // Calculate positions dynamically based on team size
    const visibleCards = Math.min(teamSize, 5); // Maximum 5 visible cards
    // const centerIndex = Math.floor(visibleCards / 2);
    
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
    // Return a default position object for cards not in the visible range
    return { top: '50%', right: '20%', scale: 0.5, opacity: 0, zIndex: 0 };
  }
  // Removed duplicate ProfileImage declaration

  const getCardShape = (index: number) => {
    const relativeIndex = (index - currentIndex + teamSize) % teamSize;
    const visibleCards = Math.min(teamSize, 5);
    const centerIndex = Math.floor(visibleCards / 2);
    
    if (relativeIndex === centerIndex) return 'center';
    return relativeIndex < centerIndex ? 'card' : 'card';
  };

  const ProfileImage = ({
    member,
    className,
    size = "normal"
  }: {
    member: TeamMember;
    className?: string;
    size?: "small" | "normal" | "large";
  }) => {
    const sizeClasses = {
      small: "w-6 h-6",
      normal: "w-full h-full",
      large: "w-16 w-16"
    };

    if (imageErrors[member.id] || !member.profile_image || member.profile_image.includes('C:')) {
      // Fallback to default avatar
      return (
        <div className={`${sizeClasses[size]} rounded-full bg-white flex items-center justify-center ${className}`}>
          <svg
            className={size === "small" ? "h-4 w-4" : size === "large" ? "h-8 w-8" : "h-8 w-8 md:h-16 md:w-16"} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            color="#9CA3AF"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <div className="flex flex-col items-center mb-2 text-center">
          <div className="relative">
            <h1 className="text-5xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 animate-fade-in">
                   OUR TEAM
            </h1>
            </div></div>
        <p className="text-gray-600 font-medium">{teamDetails.title}</p>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <p className="text-sm text-gray-500"><b>SCC ID:</b> {teamDetails.scc_id}</p>
          <span className="text-gray-300 text-2xl">•</span>
          <p className="text-sm text-gray-500"><b>Team Size:</b> {teamSize} members</p>
        </div>
      </div>

      <div className="grid grid-cols-5 min-h-[calc(100vh-200px)]">
        {/* Left Side - Detailed Profile */}
        <div className="col-span-3 flex flex-col justify-center p-8">
          <div className={`${selectedMember.bgColor} rounded-3xl p-8 shadow-2xl transition-all duration-700 transform max-w-2xl mx-auto`}>
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${selectedMember.color} p-1 shadow-xl`}>
                  <ProfileImage member={selectedMember} size="normal" />
                </div>
                {selectedMember.role === "Lead" && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                    TEAM LEAD
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedMember.name}</h2>
                <p className={`text-xl font-semibold bg-gradient-to-r ${selectedMember.color} bg-clip-text text-transparent mb-1`}>
                  {selectedMember.role}
                </p>
                <p className="text-lg text-gray-600">{selectedMember.department}</p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">College</p>
                    <p className="text-gray-700 font-medium">{selectedMember.college_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year of Study</p>
                    <p className="text-gray-700 font-medium">Year {selectedMember.year_of_study}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700 font-medium text-sm">{selectedMember.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedMember.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700 font-medium">{selectedMember.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Dynamic Carousel */}
        <div className="col-span-2 relative">
          {/* Path Indicator */}
          <div className="absolute top-1/2 right-16 w-1 h-96 bg-gradient-to-b from-transparent via-gray-300 to-transparent rounded-full transform -translate-y-1/2 opacity-30"></div>
          
          {teamDetails.team_members.map((member, index) => {
            const position = getCardPosition(index);
            const shape = getCardShape(index);
            const isCenter = shape === 'center';

            if (!position) return null;
            
            return (
              <div
                key={member.id}
                className="fixed transition-all duration-700 ease-in-out cursor-pointer hover:scale-110"
                style={{
                  top: position.top,
                  right: position.right,
                  transform: `translateY(-50%) scale(${position.scale})`,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                }}
                onClick={() => handleMemberClick(index)}
              >
                {isCenter ? (
                  // Center Card - Always detailed
                  <div className={`${member.bgColor} rounded-2xl p-4 shadow-xl w-72 border-4 border-white hover:shadow-2xl transition-all duration-300`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${member.color} p-1 shadow-lg`}>
                        <ProfileImage member={member} size="large" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
                        <p className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>{member.role}</p>
                        <p className="text-sm text-gray-600">{member.department}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Non-center Cards - Uniform card style
                  <div className={`${member.bgColor} rounded-xl p-3 shadow-lg w-48 hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${member.color} p-1 shadow-md`}>
                        <ProfileImage member={member} size="small" className="w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">{member.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{member.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-8 right-8 flex space-x-2">
        {teamSize > 1 && (
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
              autoScroll 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {autoScroll ? 'Pause' : 'Play'}
          </button>
        )}
        
        {/* Manual navigation buttons */}
        <button
          onClick={() => handleMemberClick((currentIndex - 1 + teamSize) % teamSize)}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
        >
          ←
        </button>
        <button
          onClick={() => handleMemberClick((currentIndex + 1) % teamSize)}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
        >
          →
        </button>
      </div>

      {/* Team size indicator */}
      <div className="fixed bottom-8 left-8">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {teamSize}
          </span>
        </div>
      </div>
    </div>
  );
}