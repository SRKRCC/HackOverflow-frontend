import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  Presentation,
  ClipboardList,
  Laptop,
  Trophy,
  Calendar,
  Clock,
  Users,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StagePosition {
  x: number;
  y: number;
}

interface Stage {
  key: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  details: string;
  date: string;
  duration: string;
  participants: string;
  objective: string;
  colorClass: string;
  darkColorClass: string;
  bgClass: string;
  lightBg: string;
  darkBg: string;
  borderColor: string;
  position: StagePosition;
  mobilePosition: StagePosition;
}

const Schedule: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const stages: Stage[] = [
    {
      key: "registration",
      title: "Team Registration",
      icon: UserPlus,
      details: "Register your innovative team with up to 4 passionate members. This is where your journey begins - form strategic partnerships, define roles, and outline your initial project vision. Teams can consist of developers, designers, product managers, and domain experts working together.",
      date: "December 13, 2025",
      duration: "10 days",
      participants: "All interested teams",
      objective: "Form teams and submit your problem statement",
      colorClass: "text-blue-600",
      darkColorClass: "dark:text-blue-400",
      bgClass: "bg-blue-500",
      lightBg: "bg-blue-50",
      darkBg: "dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      position: { x: 100, y: 100 },
      mobilePosition: { x: 80, y: 80 }
    },
    {
      key: "hackathon",
      title: "24-Hour Hackathon",
      icon: Laptop,
      details: "The main event! An intensive 24-hour hackathon where selected teams build their minimum viable product. Work collaboratively in a high-energy environment with food, networking, and technical support.",
      date: "December 19-20, 2025",
      duration: "24 hours non-stop",
      participants: "Selected teams only",
      objective: "Build your minimum viable product",
      colorClass: "text-purple-600",
      darkColorClass: "dark:text-purple-400",
      bgClass: "bg-purple-500",
      lightBg: "bg-purple-50",
      darkBg: "dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      position: { x: 500, y: 100 },
      mobilePosition: { x: 220, y: 320 }
    },
    {
      key: "winners",
      title: "Awards & Recognition",
      icon: Trophy,
      details: "The grand finale! Top projects will be awarded prizes including cash rewards, incubation opportunities, and industry partnerships. All participants receive certificates, and winners get featured in our innovation showcase and media coverage.",
      date: "December 20, 2025",
      duration: "Awards ceremony",
      participants: "All hackathon participants",
      objective: "Celebrate achievements and network",
      colorClass: "text-rose-600",
      darkColorClass: "dark:text-rose-400",
      bgClass: "bg-rose-500",
      lightBg: "bg-rose-50",
      darkBg: "dark:bg-rose-900/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      position: { x: 900, y: 100 },
      mobilePosition: { x: 80, y: 400 }
    }
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleStageClick = (index: number): void => {
    setSelectedStage(index);
  };

  const nextStage = (): void => {
    setSelectedStage((prev) => (prev + 1) % stages.length);
  };

  const prevStage = (): void => {
    setSelectedStage((prev) => (prev - 1 + stages.length) % stages.length);
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    hoverColor: string
  ): void => {
    (e.target as HTMLButtonElement).style.color = hoverColor;
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLButtonElement>,
    defaultColor: string
  ): void => {
    (e.target as HTMLButtonElement).style.color = defaultColor;
  };

  const handleDotMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void => {
    if (selectedStage !== index) {
      (e.target as HTMLButtonElement).style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
      (e.target as HTMLButtonElement).style.transform = 'scale(1.2)';
    }
  };

  const handleDotMouseLeave = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void => {
    if (selectedStage !== index) {
      (e.target as HTMLButtonElement).style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
      (e.target as HTMLButtonElement).style.transform = 'scale(1)';
    }
  };

  const currentStage: Stage = stages[selectedStage];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)'
      }}>

        {/* Header */}
        <div className="text-center pt-12 pb-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hackathon Journey
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            Navigate through your path to innovation and success
          </p>
        </div>

        {/* Roadmap Container */}
        <div ref={containerRef} className={`relative w-full mx-auto max-w-7xl px-4 ${isMobile ? 'h-[500px]' : 'h-96 mb-8 md:mb-12'}`}>

          {/* Road Path */}
          <svg
            viewBox={isMobile ? "0 0 300 480" : "0 0 1000 200"}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {/* Main road body */}
            <path
              d={isMobile ?
                "M 80 80 Q 150 120 220 160 Q 150 200 80 240 Q 150 280 220 320 Q 150 360 80 400" :
                "M 100 100 Q 300 50 500 100 Q 700 150 900 100"
              }
              stroke={isDarkMode ? '#ffffff' : '#000000'}
              strokeWidth={isMobile ? "16" : "20"}
              fill="none"
            />
            {/* Road center line - dashed */}
            <path
              d={isMobile ?
                "M 80 80 Q 150 120 220 160 Q 150 200 80 240 Q 150 280 220 320 Q 150 360 80 400" :
                "M 100 100 Q 300 50 500 100 Q 700 150 900 100"
              }
              stroke={isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'}
              strokeWidth={isMobile ? "2" : "3"}
              fill="none"
              strokeDasharray={isMobile ? "8,5" : "15,10"}
            />
            {/* Road side lines - solid */}
            <path
              d={isMobile ?
                "M 80 80 Q 150 120 220 160 Q 150 200 80 240 Q 150 280 220 320 Q 150 360 80 400" :
                "M 100 100 Q 300 50 500 100 Q 700 150 900 100"
              }
              stroke={isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.6)'}
              strokeWidth="2"
              fill="none"
              transform={isMobile ? "translate(-8, 0)" : "translate(0, -10)"}
            />
            <path
              d={isMobile ?
                "M 80 80 Q 150 120 220 160 Q 150 200 80 240 Q 150 280 220 320 Q 150 360 80 400" :
                "M 100 100 Q 300 50 500 100 Q 700 150 900 100"
              }
              stroke={isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.6)'}
              strokeWidth="2"
              fill="none"
              transform={isMobile ? "translate(8, 0)" : "translate(0, 10)"}
            />
          </svg>

          {/* Stage Icons */}
          {stages.map((stage, index) => {
            const IconComponent = stage.icon;
            const isActive = selectedStage === index;
            const position = isMobile ? stage.mobilePosition : stage.position;

            return (
              <div
                key={stage.key}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{
                  left: isMobile ? `${(position.x / 300) * 100}%` : `${(position.x / 1000) * 100}%`,
                  top: isMobile ? `${(position.y / 480) * 100}%` : `${(position.y / 200) * 100}%`
                }}
                onClick={() => handleStageClick(index)}
              >
                {/* Spotlight Effect */}
                {isActive && (
                  <div className="absolute inset-0">
                    <div
                      className={`${isMobile ? 'w-20 h-20' : 'w-12 h-12 md:w-24 md:h-24'} rounded-full ${stage.bgClass} opacity-30 blur-xl animate-pulse absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2`}
                    ></div>
                  </div>
                )}

                {/* Icon Container */}
                <div
                  className={`${isMobile ? 'w-14 h-14' : 'w-10 h-10 md:w-16 md:h-16'} rounded-lg md:rounded-xl ${stage.bgClass} shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative ${isActive ? 'scale-110 md:scale-125 shadow-3xl' : ''}`}
                  style={{
                    borderWidth: '2px',
                    borderColor: isDarkMode ? 'var(--border)' : 'rgba(255, 255, 255, 0.4)'
                  }}
                >
                  <IconComponent size={isMobile ? 22 : 18} className="text-white drop-shadow-lg md:w-6 md:h-6" />

                  {/* Pulsing border when active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-lg md:rounded-xl animate-pulse border-2 md:border-4 z-10"
                      style={{ borderColor: 'var(--primary)' }}
                    ></div>
                  )}

                  {/* Stage Number */}
                  <div
                    className={`absolute -top-2 -right-2 ${isMobile ? 'w-6 h-6' : 'w-5 h-5 md:w-7 md:h-7'} rounded-full flex items-center justify-center text-xs font-bold shadow-lg border pointer-events-none`}
                    style={{
                      backgroundColor: isDarkMode ? 'var(--card)' : '#ffffff',
                      color: isDarkMode ? 'var(--card-foreground)' : '#1f2937',
                      borderColor: 'var(--border)',
                      zIndex: 30
                    }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Stage Label */}
                <div className={`absolute ${isMobile ? 'top-full left-1/2 transform -translate-x-1/2' : 'top-full left-1/2 transform -translate-x-1/2'} text-center ${isMobile ? 'mt-3' : 'mt-1 md:mt-2'}`}>
                  <div
                    className={`px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg text-xs font-semibold shadow-xl border whitespace-nowrap transition-all duration-300 ${isActive ? 'scale-105 md:scale-110 shadow-2xl' : ''} ${stage.bgClass}`}
                    style={{
                      color: 'white',
                      borderColor: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.3)',
                      maxWidth: isMobile ? '120px' : 'none',
                      lineHeight: '1.2',
                      fontSize: isMobile ? '11px' : undefined
                    }}
                  >
                    {stage.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Navigation with Arrows */}
        <div className="flex items-center justify-center space-x-4 md:space-x-6 mb-6 md:mb-8 mt-8 md:mt-0">
          {/* Previous Arrow */}
          <button
            onClick={prevStage}
            className="p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl border-2 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)'
            }}
            onMouseEnter={(e) => handleMouseEnter(e, 'var(--foreground)')}
            onMouseLeave={(e) => handleMouseLeave(e, 'var(--muted-foreground)')}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Stage Dots */}
          <div className="flex space-x-2">
            {stages.map((stage, index) => (
              <button
                key={stage.key}
                onClick={() => setSelectedStage(index)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${selectedStage === index
                    ? `${stage.bgClass} shadow-lg scale-125`
                    : 'hover:scale-110'
                  }`}
                style={{
                  backgroundColor: selectedStage === index
                    ? undefined
                    : isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => handleDotMouseEnter(e, index)}
                onMouseLeave={(e) => handleDotMouseLeave(e, index)}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextStage}
            className="p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl border-2 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)'
            }}
            onMouseEnter={(e) => handleMouseEnter(e, 'var(--foreground)')}
            onMouseLeave={(e) => handleMouseLeave(e, 'var(--muted-foreground)')}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Stage Details Box */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div
            className="rounded-2xl shadow-2xl border-2 overflow-hidden bg-white dark:bg-card"
            style={{
              borderColor: 'var(--border)'
            }}
          >

            {/* Header */}
            <div
              className="p-4 md:p-6 border-b"
              style={{
                backgroundColor: 'var(--card)',
                borderBottomColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl ${currentStage.bgClass} flex items-center justify-center shadow-lg`}>
                    <currentStage.icon size={isMobile ? 20 : 28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold text-card-foreground">
                      {currentStage.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Stage {selectedStage + 1} of {stages.length}
                    </p>
                  </div>
                </div>

                {/* Navigation arrows in header */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevStage}
                    className="p-2 rounded-lg shadow hover:shadow-md border transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, 'var(--foreground)')}
                    onMouseLeave={(e) => handleMouseLeave(e, 'var(--muted-foreground)')}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextStage}
                    className="p-2 rounded-lg shadow hover:shadow-md border transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, 'var(--foreground)')}
                    onMouseLeave={(e) => handleMouseLeave(e, 'var(--muted-foreground)')}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <p className="text-sm md:text-base leading-relaxed text-card-foreground">
                {currentStage.details}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div
                  className="p-4 md:p-6 rounded-xl md:rounded-2xl border transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group bg-blue-50 dark:bg-muted"
                  style={{
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3 relative z-10">
                    <div className="p-1 md:p-2 rounded-lg bg-blue-500 shadow-lg">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold tracking-wide text-muted-foreground">{currentStage.key !== "registration" ? "DATE" : "DUE DATE"}</span>
                  </div>
                  <p className="font-bold text-sm md:text-lg relative z-10 text-card-foreground">
                    {currentStage.date}
                  </p>
                </div>

                {currentStage.key !== "registration" && (
                  <div
                    className="p-4 md:p-6 rounded-xl md:rounded-2xl border transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group bg-emerald-50 dark:bg-muted"
                    style={{
                      borderColor: 'var(--border)'
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3 relative z-10">
                      <div className="p-1 md:p-2 rounded-lg bg-green-500 shadow-lg">
                        <Clock size={16} className="text-white" />
                      </div>
                      <span className="text-xs md:text-sm font-semibold tracking-wide text-muted-foreground">DURATION</span>
                    </div>
                    <p className="font-bold text-sm md:text-lg relative z-10 text-card-foreground">
                      {currentStage.duration}
                    </p>
                  </div>
                )}

                <div
                  className="p-4 md:p-6 rounded-xl md:rounded-2xl border transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group bg-purple-50 dark:bg-muted"
                  style={{
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3 relative z-10">
                    <div className="p-1 md:p-2 rounded-lg bg-purple-500 shadow-lg">
                      <Users size={16} className="text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold tracking-wide text-muted-foreground">PARTICIPANTS</span>
                  </div>
                  <p className="font-bold text-sm md:text-lg relative z-10 text-card-foreground">
                    {currentStage.participants}
                  </p>
                </div>

                <div
                  className="p-4 md:p-6 rounded-xl md:rounded-2xl border transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group bg-amber-50 dark:bg-muted"
                  style={{
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3 relative z-10">
                    <div className="p-1 md:p-2 rounded-lg bg-amber-500 shadow-lg">
                      <Target size={16} className="text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold tracking-wide text-muted-foreground">OBJECTIVE</span>
                  </div>
                  <p className="font-bold text-sm md:text-lg relative z-10 text-card-foreground">
                    {currentStage.objective}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;