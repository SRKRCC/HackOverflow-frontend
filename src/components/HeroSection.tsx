"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, Trophy, ArrowRight, Clock, Code2, Zap } from "lucide-react"

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const navigate = useNavigate();

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const targetDate = new Date("2025-12-19T00:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      id="home"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40 gap-8 md:gap-12 lg:gap-16 relative overflow-hidden py-8 lg:py-5"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-20 sm:top-32 left-4 sm:left-8 lg:left-12 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-primary/40 rounded-full blur-2xl sm:blur-3xl animate-pulse opacity-30" />
      <div className="absolute bottom-20 sm:bottom-32 lg:bottom-40 right-4 sm:right-12 lg:right-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-accent to-accent/40 rounded-2xl blur-xl sm:blur-2xl opacity-20 animate-float" />

      <div className="flex-1 z-10 flex flex-col justify-center text-center lg:text-left">
        <div className="animate-slide-up space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm w-fit mx-auto lg:mx-0">
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="text-xs font-mono text-primary font-semibold tracking-widest">HACKATHON 2K25</span>
            <Zap className="w-3 h-3 text-accent" />
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-tight font-black tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
                HackOverflow
              </span>
            </h1>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-primary mt-2 sm:mt-3 tracking-tight">2K25</div>
          </div>
        </div>

        <div className="animate-slide-up mt-6 sm:mt-8 lg:mt-10" style={{ animationDelay: "0.2s" }}>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
            The ultimate hackathon for developers who innovate. Build groundbreaking solutions, collaborate with
            brilliant minds, and compete for premium prizes.
          </p>
        </div>

        <div className="animate-slide-up mt-8 sm:mt-10 lg:mt-12" style={{ animationDelay: "0.4s" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-lg sm:max-w-none mx-auto lg:mx-0">
            {[
              { icon: Calendar, label: "Duration", value: "24H" },
              { icon: Users, label: "Hackers", value: "500+" },
              { icon: Trophy, label: "Prizes", value: "35K" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/30 backdrop-blur-md p-4 sm:p-5 hover:border-primary/60 transition-all duration-300 hover:bg-card/50"
                style={{
                  animation: `slide-up 0.6s ease-out ${0.5 + idx * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col sm:flex-col gap-2 items-center sm:items-start text-center sm:text-left">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm sm:text-sm font-mono text-primary font-bold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-slide-up mt-10 sm:mt-12 lg:mt-16" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 sm:mb-8">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-xs font-mono text-muted-foreground font-bold uppercase tracking-widest">
              Event Countdown
            </span>
          </div>
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
            {Object.entries(timeLeft).map(([unit, value], idx) => (
              <div
                key={unit}
                className="relative flex-1 max-w-[70px] sm:max-w-[80px] md:flex-none group"
                style={{
                  animation: `scale-in 0.6s ease-out ${0.7 + idx * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-card/60 to-card/30 border border-primary/30 backdrop-blur-xl rounded-xl p-2 sm:p-3 md:p-6 min-w-[55px] sm:min-w-[65px] md:min-w-[85px] text-center hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:from-card/80 hover:to-card/50 group-hover:scale-110">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl md:text-4xl font-black text-primary font-mono tracking-tighter">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <div className="text-[9px] sm:text-[10px] md:text-xs font-mono text-muted-foreground font-bold uppercase tracking-widest">
                      {unit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced button section with improved interactions */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12 justify-center lg:justify-start" style={{ animationDelay: "0.8s" }}>
          <button
            onMouseEnter={() => setIsHovering("register")}
            onMouseLeave={() => setIsHovering(null)}
            onClick={() => navigate('/register')}
            className="group relative overflow-hidden rounded-lg px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/85 text-primary-foreground font-bold text-base sm:text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50 active:scale-95"
          >
            {/* Animated background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            <span className="relative z-10 flex items-center justify-center gap-2">
              Register Now
              <ArrowRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isHovering === "register" ? "translate-x-2" : ""}`}
              />
            </span>
          </button>

          <button
            onMouseEnter={() => setIsHovering("learn")}
            onMouseLeave={() => setIsHovering(null)}
            onClick={scrollToAbout}
            className="group relative overflow-hidden rounded-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary/50 text-primary hover:border-primary/100 font-semibold text-base sm:text-lg bg-transparent backdrop-blur-sm transition-all duration-300 hover:bg-primary/10 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
          >
            {/* Animated border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

            <span className="relative z-10">Learn More</span>
          </button>
        </div>
      </div>

      <div className="flex-1 z-10 hidden md:flex lg:flex animate-scale-in max-w-lg lg:max-w-none mx-auto lg:mx-0" style={{ animationDelay: "1s" }}>
        <div className="relative w-full">
          <div className="animate-float">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/10 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-3xl sm:group-hover:blur-4xl transition-all duration-500 opacity-60" />
              <img
                src="/HS1.webp"
                alt="HackOverflow 2k25 - Innovation and Collaboration"
                className="relative rounded-2xl sm:rounded-3xl shadow-2xl border border-primary/30 backdrop-blur-sm w-full hover:scale-105 lg:hover:scale-110 hover:border-primary/60 transition-all duration-500"
              />
            </div>
          </div>

          <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/60" />
          <div
            className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 w-3 h-3 sm:w-5 sm:h-5 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/60"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection;
