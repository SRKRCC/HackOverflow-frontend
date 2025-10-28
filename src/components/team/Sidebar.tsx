import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  CheckSquare,
  FileText,
  Images,
  Users,
  Home,
  LogOut,
  Megaphone,
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

  // Check screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Sync theme text with actual theme
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

  // Toggle theme
  const handleTheme = () => {
    if (currentTheme !== "Dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Logout logic with confirmation
  const handleLogout = async () => {
    try {
      // Call backend logout API
      await ApiService.team.logout();

      // Clear all local storage & session data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect user to home/login page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/", { replace: true });
    }
  };

  const links = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/team/problem-statement", label: "Problem Statement", icon: <FileText size={20} /> },
    { path: "/team/team-details", label: "Team Details", icon: <Users size={20} /> },
    { path: "/team/tasks", label: "Tasks", icon: <CheckSquare size={20} /> },
    { path: "/team/gallery", label: "Gallery", icon: <Images size={20} /> },
    { path: "/team/attendance", label: "Attendance", icon: <CalendarCheck size={20} /> },
    { path: "/team/announcements", label: "Announcements", icon: <Megaphone size={20} /> },
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

  return (
    <>
      {/* ---------- SIDEBAR ---------- */}
      <motion.div
        animate={{
          width: isMobile ? 60 : openSidebar ? 250 : 60,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed z-50 top-0 left-0 h-full bg-sidebar border-r rounded-r-xl border-sidebar shadow-lg flex flex-col"
        onMouseEnter={() => {
          if (!isMobile && !("ontouchstart" in window)) {
            setOpenSidebar(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile && !("ontouchstart" in window)) {
            setOpenSidebar(false);
          }
        }}
      >
        <div className="p-2 mt-5 ml-2"></div>

        <nav className="flex flex-col mt-2">
          {links.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => isMobile && setOpenSidebar(false)}
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

        {/* ---------- Bottom Section ---------- */}
        <div className="mt-auto mb-4 flex flex-col gap-2">
          {/* Theme toggle */}
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

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
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

      {/* ---------- CONFIRMATION POPUP ---------- */}
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
