import type { FC } from "react";
import { useEffect, useState } from "react";
import { 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Trophy,
  Users,
  Code,
  Award,
  Clock,
  Shield,
  BookOpen,
  Heart
} from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className={`overflow-hidden relative bg-gradient-to-b from-gray-900 to-gray-800 text-white ${className}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full animate-float" />
        <div
          className="absolute bottom-32 right-16 w-16 h-16 bg-purple-500 rounded-lg rotate-45 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-500 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand and description */}
          <div className={`lg:col-span-2 ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                <Code size={28} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                HackOverflow 2K25
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              India's premier nationwide 48-hour hackathon bringing together the brightest minds to innovate, collaborate, and create solutions for real-world problems.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Calendar, label: "Oct 15-17, 2025" },
                { icon: Clock, label: "48 Hours" },
                { icon: Users, label: "500+ Hackers" },
                { icon: Trophy, label: "₹10L+ Prizes" },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-gray-800 p-2 rounded-lg flex items-center"
                >
                  <item.icon size={16} className="text-blue-400 mr-2" />
                  <span className="text-gray-300 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={`${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2 flex items-center">
              <Code className="mr-2" size={18} /> Hackathon Info
            </h3>
            <ul className="space-y-3">
              {[
                { text: "Schedule", icon: Calendar },
                { text: "Tracks & Themes", icon: Code },
                { text: "Prizes", icon: Trophy },
                { text: "Judges & Mentors", icon: Users },
                { text: "Rules", icon: Award },
                { text: "Code of Conduct", icon: Shield },
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group"
                  >
                    <item.icon size={16} className="mr-2 group-hover:scale-110 transition-transform" /> 
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className={`${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.4s" }}>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2 flex items-center">
              <BookOpen className="mr-2" size={18} /> Quick Support
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <MapPin size={18} className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">123 Tech Park, Innovation Road, Bengaluru, Karnataka 560001</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-blue-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@hackoverflow.in" className="text-gray-300 hover:text-blue-400">info@hackoverflow.in</a>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="bg-gray-800 p-3 rounded-lg mt-4">
              <h4 className="text-blue-400 font-semibold text-sm mb-1">Emergency Contact</h4>
              <p className="text-gray-300 text-sm">For urgent issues during the event</p>
              <p className="text-gray-300 text-sm mt-1">+91 91234 56789</p>
            </div>
          </div>
        </div>

        {/* Tracks/Themes Section
        <div className={`border-t border-gray-800 pt-8 mb-8 ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.6s" }}>
          <h3 className="text-lg font-semibold text-center mb-8">Hackathon Tracks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "AI & Machine Learning",
              "Web3 & Blockchain",
              "Healthcare Tech",
              "Sustainability",
              "FinTech Innovation",
              "Education Technology",
              "IoT & Hardware",
              "Open Innovation"
            ].map((track, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded-lg text-center hover:bg-gray-700 transition-colors">
                <span className="text-gray-300 text-sm">{track}</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Stats Section
        <div className={`bg-gray-800 rounded-xl p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "0.8s" }}>
          {[
            { number: "500+", label: "Participants" },
            { number: "₹10L+", label: "Prize Pool" },
            { number: "48", label: "Hours" },
            { number: "8", label: "Tracks" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Bottom section */}
        <div className={`border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center ${isVisible ? 'animate-slide-up opacity-100' : 'translate-y-10 opacity-0'}`} style={{ animationDelay: "1s" }}>
          <div className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
            Made with <Heart size={14} className="text-red-500 mx-1" /> for the developer community
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Code of Conduct</a>
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;