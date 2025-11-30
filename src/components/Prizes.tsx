import React from "react"
import { Trophy, Medal, Award, Gift, Star } from "lucide-react"

const Prizes: React.FC = () => {
  const prizes = [
    {
      position: "1st Place",
      amount: "₹15,000",
      icon: Trophy,
      color: "from-yellow-400 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      description: "Champion Team",
      glowColor: "shadow-yellow-500/50"
    },
    {
      position: "2nd Place",
      amount: "₹12,000",
      icon: Medal,
      color: "from-gray-300 to-gray-500",
      bgColor: "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
      borderColor: "border-gray-200 dark:border-gray-800",
      description: "Runner-up Team",
      glowColor: "shadow-gray-500/50"
    },
    {
      position: "3rd Place",
      amount: "₹8,000",
      icon: Award,
      color: "from-amber-600 to-amber-800",
      bgColor: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      description: "Third Place Team",
      glowColor: "shadow-amber-500/50"
    },
    {
      position: "4th & 5th Place",
      amount: "Consolidated Prizes (TBA)",
      icon: Star,
      color: "from-blue-400 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      description: "Honorable Mention",
      glowColor: "shadow-blue-500/50"
    }
  ]

  const additionalRewards = [
    {
      title: "All Participants",
      items: ["Participation Certificates", "Goodies Bag", "Networking Opportunities"],
      icon: Gift
    },
    {
      title: "Special Mentions",
      items: ["Best Innovation Award", "Best UI/UX Award", "Best Problem Solving"],
      icon: Star
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 via-muted/30 to-muted/30 px-6 lg:px-12 py-10 pb-0">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6">
          <div className="relative">
            <Trophy className="h-16 w-16 text-primary animate-bounce" />
            <div className="absolute inset-0 h-16 w-16 text-primary animate-ping opacity-20" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
          PRIZES & REWARDS
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Compete for glory and recognition in HackOverflow hackathon
        </p>
        <div className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Total Prize Pool: ₹35,000
          </span>
        </div>
      </div>

      {/* Main Prize Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {prizes.map((prize, index) => {
          const IconComponent = prize.icon
          return (
            <div
              key={prize.position}
              className={`relative group animate-fade-in bg-gradient-to-br ${prize.bgColor} backdrop-blur-md border-2 ${prize.borderColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl ${prize.glowColor} hover:scale-105 transition-all duration-300 overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4">
                  <IconComponent size={60} className={`text-current`} />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${prize.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={32} className="text-white" />
                </div>

                {/* Position */}
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {prize.position}
                </h3>

                {/* Amount */}
                <div className="mb-3">
                  <span className={`text-xl font-black bg-gradient-to-r ${prize.color} bg-clip-text text-transparent`}>
                    {prize.amount}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground font-medium">
                  {prize.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>
          )
        })}
      </div>

      {/* Additional Rewards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {additionalRewards.map((reward, index) => {
          const IconComponent = reward.icon
          return (
            <div
              key={reward.title}
              className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl animate-fade-in"
              style={{ animationDelay: `${0.6 + index * 0.2}s` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mr-4">
                  <IconComponent size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{reward.title}</h3>
              </div>

              <div className="space-y-3">
                {reward.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
    </div>
  )
}

export default Prizes