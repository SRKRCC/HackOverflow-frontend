// src/AnnouncementsTeam.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

type Announcement = {
  id: number;
  title: string;
  description: string;
  startDate: string; // format YYYY-MM-DD
  startTime: string; // HH:MM
  endDate?: string;  // optional
  endTime?: string;  // optional
};

const AnnouncementsTeam: React.FC = () => {
  const [announcements] = useState<Announcement[]>([
    { id: 1, title: "Hackathon Kickoff", description: "Join us for the opening ceremony of HackOverflow.", startDate: "2025-10-18", startTime: "09:00", endDate: "2025-10-18", endTime: "11:00" },
    { id: 2, title: "Holiday Notice", description: "Office will remain closed on Thanksgiving Day.", startDate: "2025-11-23", startTime: "10:00", endDate: "2025-11-23", endTime: "17:00" },
    { id: 3, title: "Upcoming Workshop", description: "Hands-on React Workshop for beginners.", startDate: "2025-12-20", startTime: "10:00", endDate: "2025-12-20", endTime: "16:00" },
  ]);

  // helper to format 24-hour time to 12-hour with AM/PM
  const formatTime = (time: string) => {
    const [hourStr, min] = time.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${min} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-orange-500 mt-10 animate-fade-in text-center">
        📢 Announcements
      </h1>

      <div className="flex flex-wrap justify-evenly max-w-6xl mx-auto mt-12">
        {announcements.length > 0 ? (
          announcements.map((announcement, idx) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="p-6 sm:w-[45%] rounded-2xl shadow-lg border border-orange-500 mt-5 transition-all duration-500 hover:scale-[1.02] bg-card text-black dark:text-white"
            >
              <h2 className="text-2xl font-bold text-orange-600 mb-4">{announcement.title}</h2>
              <p className="text-xl mb-4">{announcement.description}</p>

              <div className="flex justify-between text-lg mb-2">
                <p><span className="font-bold">Start Date:</span> {announcement.startDate}</p>
                <p><span className="font-bold">Start Time:</span> {formatTime(announcement.startTime)}</p>
              </div>

              {announcement.endDate && announcement.endTime && (
                <div className="flex justify-between text-lg mb-2">
                  <p><span className="font-bold">End Date:</span> {announcement.endDate}</p>
                  <p><span className="font-bold">End Time:</span> {formatTime(announcement.endTime)}</p>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-4xl font-bold text-center mb-8 text-orange-500 animate-bubbly mt-20">
            No Announcements Found
          </p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsTeam;
