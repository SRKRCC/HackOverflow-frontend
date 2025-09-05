import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ProblemStatement from "./components/ProblemStatement";
import Attendance from "./components/Attendance";
import TeamDetails from "./components/TeamDetails";
import Tasks from "./components/Tasks";
import Gallery from "./components/Gallery";
import HeroSection from "./components/HeroSection";

const Structure = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="w-full h-screen flex">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <div className="flex-1 h-full sm:ml-[60px] transition-all duration-300">
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/problem-statement" element={<ProblemStatement />} />
          <Route path="/team-details" element={<TeamDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </div>
  );
};

export default Structure;
