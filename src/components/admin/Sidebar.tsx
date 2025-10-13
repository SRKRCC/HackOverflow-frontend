import { motion, AnimatePresence } from "framer-motion";
import { Home, Images, LogOut, Users,Megaphone, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

interface SidebarProps {
    openSidebar: boolean;
    setOpenSidebar: (open: boolean) => void;
}

const Sidebar = ({ openSidebar, setOpenSidebar }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(false);
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

        // Initial check
        updateTheme();

        // Listen for theme changes
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

    const handleLogout = () => {
        // For now, just redirect to home
        navigate("/");
    };

    const links = [
        { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
        { path: "/admin/team-details", label: "Team Details", icon: <Users size={20} /> },
        { path: "/admin/team-photos", label: "Photos", icon: <Images size={20} /> },
        { path: "/admin/leaderboard", label: "Leaderboard", icon: <Users size={20} /> },
        { path: "/admin/announcements", label: "Announcements", icon: <Megaphone size={20} /> },
        // { path: "/admin/tasks", label: "Tasks", icon: <CheckCircle2 size={20} /> },
        { path: "/admin/teamtaskmanagment", label: "Team Task Management", icon: <CheckCircle2 size={20} /> }
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
  }

    return (
        <motion.div
            animate={{
                width: isMobile
                    ? 60  // mobile - always show icons only
                    : openSidebar ? 250 : 60  // desktop
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed z-50 top-0 left-0 h-full bg-sidebar border-r rounded-r-xl border-sidebar shadow-lg flex flex-col"
            onMouseEnter={() => {
                if (!isMobile && !('ontouchstart' in window)) {
                    setOpenSidebar(true);
                }
            }}
            onMouseLeave={() => {
                if (!isMobile && !('ontouchstart' in window)) {
                    setOpenSidebar(false);
                }
            }}
        >

            <div className="p-2 mt-5 ml-2">
                {/* Mobile: Always collapsed - just icons */}
            </div>

            <nav className="flex flex-col mt-2">
                {links.map(({ path, label, icon }) => (
                    <Link onClick={() => isMobile && setOpenSidebar(false)} key={path} to={path} className={`flex items-center gap-3 p-2 m-1 rounded-lg transition-colors ${location.pathname === path ? "bg-sidebar-accent text-primary" : "text-primary hover:bg-sidebar-accent"}`}>
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
                                            <span key={i}>{char === " " ? "\u00A0" : char}</span>
                                        </motion.span>
                                    ))}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </nav>

            {/* Bottom Section - Theme Toggle & Logout */}
            <div className="mt-auto mb-4 flex flex-col gap-2">
                <div className="flex items-center p-2 m-1 rounded-lg transition-colors text-primary hover:bg-sidebar-accent" onClick={handleTheme}>
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
                <button
                    onClick={handleLogout}
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
    );
};

export default Sidebar;
