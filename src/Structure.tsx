import { useState, useEffect } from "react";
import Sidebar from "./components/team/Sidebar";
import { Route, Routes } from "react-router-dom";
import ProblemStatement from "./components/team/ProblemStatement";
import Attendance from "./components/team/Attendance";
import TeamDetails from "./components/team/TeamDetails";
import Tasks from "./components/team/Tasks";
import Gallery from "./components/team/Gallery";
import HeroSection from "./components/HeroSection";

const Structure = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="w-full min-h-auto flex">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <div className={`flex-1 h-full transition-all duration-300 ${
        isMobile ? 'ml-[60px]' : (openSidebar ? 'ml-[250px]' : 'ml-[60px]')
      }`}>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/team/problem-statement" element={<ProblemStatement />} />
          <Route path="/team/team-details" element={<TeamDetails />} />
          <Route path="/team/tasks" element={<Tasks />} />
          <Route path="/team/gallery" element={<Gallery />} />
          <Route path="/team/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </div>
  );
};

export default Structure;
