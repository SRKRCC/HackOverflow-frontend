// src/Announcements.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

type Announcement = {
  id: number;
  title: string;
  description: string;
  startDate: string; 
  startTime: string; 
  endDate: string;   
  endTime: string;   
};

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Hackathon Kickoff",
      description: "Join us for the opening ceremony of HackOverflow.",
      startDate: "2025-10-18",
      startTime: "09:00",
      endDate: "2025-10-18",
      endTime: "11:00",
    },
    {
      id: 2,
      title: "Holiday Notice",
      description: "Office will remain closed on Thanksgiving Day.",
      startDate: "2025-11-23",
      startTime: "10:00",
      endDate: "2025-11-23",
      endTime: "17:00",
    },
  ]);

  const [formData, setFormData] = useState<Partial<Announcement>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // helper to convert 24-hour to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    const [hourStr, min] = time.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${min} ${ampm}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      alert("All fields are required.");
      return;
    }

    const newAnnouncement: Announcement = {
      id: editingId || Date.now(),
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
    } as Announcement;

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? newAnnouncement : a))
      );
      setEditingId(null);
    } else {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }

    setFormData({});
    setShowForm(false);
  };

  const handleEdit = (id: number) => {
    const announcement = announcements.find((a) => a.id === id);
    if (announcement) {
      setFormData(announcement);
      setEditingId(id);
      setShowForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-orange-500 mt-10 animate-fade-in text-center">
        📢 Announcements
      </h1>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => { setFormData({}); setEditingId(null); setShowForm(true); }}
          className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          + Create Announcement
        </button>
      </div>

      {showForm && (
        <div className="flex justify-center mt-6">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white text-black shadow-md rounded-2xl p-6 mb-8 border border-orange-500"
          >
            <h2 className="text-3xl font-bold text-orange-600 mb-4 text-center">
              {editingId ? "Update Announcement" : "New Announcement"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-3 border border-orange-500 rounded-md text-lg"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="w-full p-2 mb-3 border border-orange-500 rounded-md text-xl leading-relaxed"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-semibold">Start Date:</label>
                <input
                  type="date"
                  className="w-full p-2 border border-orange-500 rounded-md"
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-semibold">Start Time:</label>
                <input
                  type="time"
                  className="w-full p-2 border border-orange-500 rounded-md"
                  value={formData.startTime || ""}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-semibold">End Date:</label>
                <input
                  type="date"
                  className="w-full p-2 border border-orange-500 rounded-md"
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-semibold">End Time:</label>
                <input
                  type="time"
                  className="w-full p-2 border border-orange-500 rounded-md"
                  value={formData.endTime || ""}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setFormData({}); setShowForm(false); setEditingId(null); }}
                className="px-4 py-2 border border-orange-500 text-black hover:bg-orange-500 hover:text-white rounded-md transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-wrap justify-evenly max-w-6xl mx-auto mt-6">
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

              <div className="flex justify-between text-lg mb-4">
                <p><span className="font-bold">End Date:</span> {announcement.endDate}</p>
                <p><span className="font-bold">End Time:</span> {formatTime(announcement.endTime)}</p>
              </div>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleEdit(announcement.id)}
                  className="px-4 py-2 bg-white text-orange-600 font-semibold border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition"
                >
                  Edit
                </button>
              </div>
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

export default Announcements;
