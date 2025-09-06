import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ProblemStatement from "./components/team/ProblemStatement";
import Attendance from "./components/team/Attendance";
import TeamDetails from "./components/team/TeamDetails";
import Tasks from "./components/team/Tasks";
import Gallery from "./components/team/Gallery";
import HeroSection from "./components/HeroSection";

const Structure = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="w-full min-h-auto flex">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <div className="flex-1 h-full sm:ml-[60px] transition-all duration-300">
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
