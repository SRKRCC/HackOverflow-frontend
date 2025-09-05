import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, CheckSquare, FileText, Images, Users, Menu, X, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}

const Sidebar = ({ openSidebar, setOpenSidebar }: SidebarProps) => {
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const links = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/team/problem-statement", label: "Problem Statement", icon: <FileText size={20} /> },
    { path: "/team/team-details", label: "Team Details", icon: <Users size={20} /> },
    { path: "/team/tasks", label: "Tasks", icon: <CheckSquare size={20} /> },
    { path: "/team/gallery", label: "Gallery", icon: <Images size={20} /> },
    { path: "/team/attendance", label: "Attendance", icon: <CalendarCheck size={20} /> },
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
    <motion.div
      animate={{
        width: isMobile
          ? openSidebar ? 250 : 0   // mobile
          : openSidebar ? 250 : 60  // desktop
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed z-50 top-0 left-0 h-full bg-sidebar border-r rounded-r-xl border-sidebar shadow-lg flex flex-col">

      <button className="p-2 flex mt-5 items-center justify-center rounded-lg w-[40px] ml-2 hover:bg-sidebar-accent transition-colors" onClick={() => setOpenSidebar(!openSidebar)} >{openSidebar ? <X size={20} /> : <Menu size={20} />}</button>

      <nav className="flex flex-col mt-2">
        {links.map(({ path, label, icon }) => (
          <Link onClick={() => setOpenSidebar(false)} key={path} to={path} className={`flex ${openSidebar ? "" : "hidden sm:flex"} items-center gap-3 p-2 m-1 rounded-lg transition-colors ${ location.pathname === path ? "bg-sidebar-accent text-primary" : "text-primary hover:bg-sidebar-accent"}`}>
            <span className="ml-2 ">{icon}</span>
            <AnimatePresence>
              {openSidebar && (
                <motion.span
                  className="text-sm font-semibold  flex"
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
      
    </motion.div>
  );
};

export default Sidebar;
