import { useState, useEffect } from "react"
import Button from "@/components/ui/button"
import { Calendar, Users, Trophy, Zap, ArrowRight, Clock } from "lucide-react"

const HeroSection = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const targetDate = new Date("2025-10-15T00:00:00").getTime()

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
        <div id="home" className="min-h-screen flex items-center justify-between px-4 md:px-20 gap-8 md:gap-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />

            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
            <div
                className="absolute bottom-32 right-16 w-16 h-16 bg-accent/10 rounded-lg rotate-45 animate-float"
                style={{ animationDelay: "1s" }}
            />
            <div
                className="absolute top-1/2 left-1/4 w-12 h-12 bg-secondary/10 rounded-full animate-float"
                style={{ animationDelay: "2s" }}
            />

            {/* Left Content */}
            <div className="flex-1 z-10">
                <div className="animate-slide-up">
                    <h1 className="text-4xl md:text-8xl leading-tight mb-6">
                        <div className="text-foreground mt-2 font-bold">
                            <span className="text-primary">HackOverflow</span>
                        </div>
                        <div className="text-right text-primary font-black">2K25</div>
                    </h1>
                </div>

                <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                        Join the ultimate hackathon experience — innovate, collaborate, and excel! Connect with brilliant minds,
                        build groundbreaking solutions, and compete for amazing prizes.
                    </p>
                </div>

                <div className="animate-slide-up mb-8" style={{ animationDelay: "0.4s" }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>48 Hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span>500+ Hackers</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span>$50K Prizes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Zap className="w-4 h-4 text-primary" />
                            <span>10 Tracks</span>
                        </div>
                    </div>
                </div>

                <div className="animate-slide-up mb-8" style={{ animationDelay: "0.6s" }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Event Starts In:</span>
                    </div>
                    <div className="flex gap-4">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <div className="bg-card border border-border rounded-lg p-3 min-w-[60px]">
                                    <div className="text-2xl font-bold text-primary">{value}</div>
                                    <div className="text-xs text-muted-foreground capitalize">{unit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-slide-up flex flex-col sm:flex-row gap-4" style={{ animationDelay: "0.8s" }}>
                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                    >
                        Register Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                        Learn More
                    </Button>
                </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 z-10 animate-scale-in" style={{ animationDelay: "1s" }}>
                <div className="relative">
                    <div className="animate-float">
                        <img
                            src="/HS1.webp"
                            alt="HackOverflow 2k25 - Innovation and Collaboration"
                            className="rounded-3xl shadow-2xl border border-border/20 w-full max-w-lg mx-auto hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse" />
                    <div
                        className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                    />
                </div>
            </div>
        </div>
    )
}

export default HeroSection