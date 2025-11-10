import { useState, useEffect } from "react";
import Sidebar from "./components/team/Sidebar";
import { Route, Routes } from "react-router-dom";
import ProblemStatement from "./components/team/ProblemStatement";
import TeamDetails from "./components/team/TeamDetails";
import Tasks from "./components/team/Tasks";
import Gallery from "./components/team/Gallery";
import HeroSection from "./components/HeroSection";
import AnnouncementsTeam from "./components/team/Announcements"
import TaskStatusManager from "./components/team/Tasks";

const TeamStructure = () => {
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
          <Route path="/problem-statement" element={<ProblemStatement />} />
          <Route path="/team-details" element={<TeamDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/announcements" element={<AnnouncementsTeam />} />
           <Route path="/teamtasks" element={<TaskStatusManager/>} />
        </Routes>
      </div>
    </div>
  );
};

export default TeamStructure;
