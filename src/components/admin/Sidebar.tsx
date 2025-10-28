import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Images,
  LogOut,
  Users,
  Megaphone,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { ApiService } from "@/lib/api";

interface SidebarProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}

const Sidebar = ({ openSidebar, setOpenSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() =>
    localStorage.getItem("theme") === "dark" ? "Dark" : "Light"
  );

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setCurrentTheme(isDark ? "Dark" : "Light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Logout confirmation handler
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // ✅ Confirm logout
  const handleLogout = async () => {
    try {
      // Call backend logout API if you have one
      await ApiService.admin.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Clear localStorage and cookies
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    setShowLogoutConfirm(false);
    navigate("/");
  };

  
  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/team-details", label: "Team Details", icon: <Users size={20} /> },
    { path: "/admin/team-photos", label: "Photos", icon: <Images size={20} /> },
    { path: "/admin/leaderboard", label: "Leaderboard", icon: <Users size={20} /> },
    { path: "/admin/announcements", label: "Announcements", icon: <Megaphone size={20} /> },
    { path: "/admin/teamtaskmanagment", label: "Team Task Management", icon: <CheckCircle2 size={20} /> },
  ];

  const letterAnimation = {
    hidden: { opacity: 0, x: -5 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.01 },
    }),
    exit: { opacity: 0, x: -5, transition: { duration: 0.1 } },
  };

  const handleTheme = () => {
    if (currentTheme !== "Dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <motion.div
        animate={{
          width: isMobile ? 60 : openSidebar ? 250 : 60,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed z-50 top-0 left-0 h-full bg-sidebar border-r rounded-r-xl border-sidebar shadow-lg flex flex-col"
        onMouseEnter={() => {
          if (!isMobile && !("ontouchstart" in window)) setOpenSidebar(true);
        }}
        onMouseLeave={() => {
          if (!isMobile && !("ontouchstart" in window)) setOpenSidebar(false);
        }}
      >
        <div className="p-2 mt-5 ml-2"></div>

        <nav className="flex flex-col mt-2">
          {links.map(({ path, label, icon }) => (
            <Link
              onClick={() => isMobile && setOpenSidebar(false)}
              key={path}
              to={path}
              className={`flex items-center gap-3 p-2 m-1 rounded-lg transition-colors ${
                location.pathname === path
                  ? "bg-sidebar-accent text-primary"
                  : "text-primary hover:bg-sidebar-accent"
              }`}
            >
              <span className="ml-2">{icon}</span>
              <AnimatePresence>
                {openSidebar && !isMobile && (
                  <motion.span
                    className="text-sm font-semibold flex"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {label.split("").map((char, i) => (
                      <motion.span key={i} custom={i} variants={letterAnimation}>
                        <span>{char === " " ? "\u00A0" : char}</span>
                      </motion.span>
                    ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto mb-4 flex flex-col gap-2">
          <div
            className="flex items-center p-2 m-1 rounded-lg transition-colors text-primary hover:bg-sidebar-accent cursor-pointer"
            onClick={handleTheme}
          >
            <ThemeToggle />
            <AnimatePresence>
              {openSidebar && !isMobile && (
                <motion.span
                  className="text-sm font-semibold ml-3"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {currentTheme}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 p-2 m-1 rounded-lg transition-colors text-primary hover:bg-sidebar-accent"
          >
            <span className="ml-2">
              <LogOut size={20} />
            </span>
            <AnimatePresence>
              {openSidebar && !isMobile && (
                <motion.span
                  className="text-sm font-semibold"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* ✅ Confirmation Popup */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-sm w-[90%] text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Confirm Logout
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
