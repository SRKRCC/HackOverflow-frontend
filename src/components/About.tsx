import type { FC } from "react";
import { useEffect, useState } from "react";
import { 
  Code,
  Users,
  Trophy,
  Calendar,
  MapPin
} from "lucide-react";

const About: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7715e8]/5 via-white to-[#b35605]/5" />

      <div className="absolute top-20 left-10 w-20 h-20 bg-[#7715e8]/10 rounded-full animate-float" />
      <div
        className="absolute bottom-32 right-16 w-16 h-16 bg-[#b35605]/10 rounded-lg rotate-45 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#7715e8]/10 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className={`flex justify-center mb-6 ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-[#7715e8] p-3 rounded-lg">
              <Code size={36} className="text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.1s" }}>
            About <span className="text-[#b35605]">HackOverflow</span> <span className="text-[#7715e8]">2K25</span>
          </h1>
          <p className={`text-lg text-gray-700 max-w-3xl mx-auto ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.2s" }}>
            India's premier nationwide hackathon bringing together innovators to solve real-world challenges
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Hackathon Image - LEFT side */}
          <div className={`${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="animate-float">
                <div className="bg-gradient-to-br from-[#7715e8] to-[#b35605] h-64 md:h-80 rounded-lg flex items-center justify-center overflow-hidden shadow-2xl border border-gray-200/20">
                  <div className="text-center p-6 text-white">
                    <Code size={48} className="mx-auto mb-4" />
                    <p className="text-xl font-semibold">HackOverflow 2K25</p>
                    <p className="text-sm mt-2">National Hackathon by SRKR Coding Club</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#7715e8] rounded-full animate-pulse" />
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#b35605] rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center text-[#b35605] mr-6">
                <Calendar size={18} className="mr-2" />
                <span>24 Hours</span>
              </div>
              <div className="flex items-center text-[#7715e8]">
                <Trophy size={18} className="mr-2" />
                <span>₹10L+ Prizes</span>
              </div>
            </div>
          </div>

          {/* Organizer Information - RIGHT side */}
          <div className={`${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-[#7715e8]">
              <Users className="mr-3" size={24} />
              Organized by SRKR Coding Club
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-[#7715e8] rounded-full flex items-center justify-center mr-4">
                  <Code className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">SRKR Coding Club</h3>
                  <p className="text-gray-600">SRKR Engineering College, Bhimavaram</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                A student-run community dedicated to promoting coding culture, technical skills, and innovation among students. We organize workshops, coding competitions, and hackathons to nurture the next generation of developers.
              </p>
              
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>West Godavari District, Andhra Pradesh</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#7715e8] to-[#b35605] p-6 rounded-lg text-white">
              <h3 className="font-bold text-lg mb-2">Our Mission</h3>
              <p>
                To create a platform where students can learn, collaborate, and innovate through practical coding experiences and competitive programming.
              </p>
            </div>
          </div>
        </div>

        {/* Themes Section */}
        <div className={`mb-16 ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.5s" }}>
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Hackathon Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { theme: "AI & Machine Learning", color: "bg-purple-100 text-purple-800" },
              { theme: "Web3 & Blockchain", color: "bg-blue-100 text-blue-800" },
              { theme: "Healthcare Technology", color: "bg-green-100 text-green-800" },
              { theme: "Sustainable Development", color: "bg-emerald-100 text-emerald-800" },
              { theme: "FinTech Innovation", color: "bg-amber-100 text-amber-800" },
              { theme: "Education Technology", color: "bg-cyan-100 text-cyan-800" },
              { theme: "IoT & Smart Devices", color: "bg-orange-100 text-orange-800" },
              { theme: "Open Innovation", color: "bg-pink-100 text-pink-800" },
            ].map((item, index) => (
              <div key={index} className={`p-4 rounded-lg ${item.color} text-center hover:shadow-md transform hover:scale-105 transition-transform duration-300`}>
                <h3 className="font-semibold">{item.theme}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes slide-up {
          0% { 
            opacity: 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default About;