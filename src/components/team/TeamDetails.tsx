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
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
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
      bgColor: "bg-teal-50 dark:bg-teal-900/20"
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
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
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
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
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
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    }
  ]
};

export default function TeamCompass() {
  const leaderIndex = teamDetails.team_members.findIndex(member => member.role === "Lead");
  const [currentIndex, setCurrentIndex] = useState(leaderIndex >= 0 ? leaderIndex : 0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const selectedMember = teamDetails.team_members[currentIndex];
  const teamSize = teamDetails.team_members.length;

  const handleMemberClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-32">
      {/* Container with proper spacing for navbar/sidebar/footer */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4">
            Meet Our Team
          </h1>
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-400 font-medium mb-3 md:mb-4 px-4">
            {teamDetails.title}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Team ID:</span>
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full font-mono text-xs">
                {teamDetails.scc_id}
              </span>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Members:</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                {teamSize}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-8 lg:min-h-[70vh] lg:items-center">
          
          {/* Detailed Profile - Full width on mobile/tablet, left side on desktop */}
          <div className="lg:col-span-3 flex items-center justify-center px-4 sm:px-6 lg:px-0">
            <div className={`w-full max-w-2xl ${selectedMember.bgColor} rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-500`}>
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl lg:rounded-2xl bg-gradient-to-r ${selectedMember.color} p-1 lg:p-1.5 shadow-xl`}>
                    <ProfileImage member={selectedMember} className="rounded-lg lg:rounded-xl" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r ${selectedMember.color} rounded-full flex items-center justify-center shadow-lg`}>
                    {selectedMember.role === 'Lead' ? (
                      <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.383-1.835-.383-2.516zM21 12.25c0 .16-.013.318-.04.472a29.861 29.861 0 00-3.186-2.01c.03.655-.14 1.37-.15 2.038.386.262.771.538 1.554.82a.75.75 0 00.822-.74z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMember.name}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 lg:mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${selectedMember.color} text-white shadow-md mx-auto sm:mx-0`}>
                      Team {selectedMember.role}
                    </span>
                    <span className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
                      {selectedMember.department}
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium">
                    {selectedMember.college_name}
                  </p>
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

          {/* Team Members List - Full width on mobile/tablet, right side on desktop */}
          <div className="lg:col-span-2 px-4 sm:px-6 lg:px-0">
            <div className="lg:sticky lg:top-6">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 text-center lg:text-left">
                Team Members
              </h3>
              
              {/* Mobile: Grid layout, Desktop: Vertical list */}
              <div className="lg:space-y-3">
                {/* Mobile grid layout */}
                <div className="lg:hidden grid grid-cols-2 gap-3 px-2">
                  {teamDetails.team_members.map((member, index) => (
                    <div
                      key={member.id}
                      onClick={() => handleMemberClick(index)}
                      className={`cursor-pointer transition-all duration-300 ${
                        index === currentIndex 
                          ? `${member.bgColor} ring-2 ring-blue-500 shadow-lg scale-102` 
                          : `bg-white dark:bg-gray-800 hover:shadow-md hover:scale-101`
                      } rounded-xl p-3 border border-gray-200 dark:border-gray-700`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${member.color} p-1 shadow-md shrink-0`}>
                          <ProfileImage member={member} size="small" />
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
                  ))}
                </div>

                {/* Desktop vertical list */}
                <div className="hidden lg:block space-y-3 max-w-sm mx-auto lg:mx-0">
                  {teamDetails.team_members.map((member, index) => (
                    <div
                      key={member.id}
                      onClick={() => handleMemberClick(index)}
                      className={`cursor-pointer transition-all duration-300 ${
                        index === currentIndex 
                          ? `${member.bgColor} ring-2 ring-blue-500/50 shadow-lg` 
                          : `bg-white dark:bg-gray-800 hover:shadow-md`
                      } rounded-xl p-3 border border-gray-200 dark:border-gray-700`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-gradient-to-r ${member.color} p-1 shadow-md shrink-0`}>
                          <ProfileImage member={member} size="small" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">
                            {member.name}
                          </h4>
                          <p className={`text-xs lg:text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                            Team {member.role}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                            {member.department}
                          </p>
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