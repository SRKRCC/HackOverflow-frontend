import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/components/admin/Dashboard";

const AdminStructure = () => {
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
            <div className={`flex-1 h-full transition-all duration-300 ${isMobile ? 'ml-[60px]' : (openSidebar ? 'ml-[250px]' : 'ml-[60px]')
                }`}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Add more admin routes here */}
                </Routes>
            </div>
        </div>
    );
};

export default AdminStructure;
