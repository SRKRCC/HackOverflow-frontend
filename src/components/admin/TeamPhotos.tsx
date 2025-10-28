import React, { useState, useEffect } from "react";
import {
  Search,
  ImageUp,
  Trash2,
  X,
  Check,
  Loader2,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { ApiService } from "@/lib/api";
import type { Team } from "@/lib/types";

export default function TeamGalleryManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load all teams
  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await ApiService.admin.getAllTeams();
      setTeams(data);
      if (data.length > 0) setSelectedTeam(data[0]);
    } catch (err) {
      console.error("Failed to load teams:", err);
      setStatus("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // Load images for selected team
  const loadTeamImages = async (teamId: number) => {
    try {
      setLoading(true);
      const data = await ApiService.admin.getTeamImages(teamId);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch images:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedTeam) return;
    setLoading(true);
    setStatus("Uploading images...");
    try {
      const fileArray = Array.from(e.target.files);
      const response = await ApiService.admin.uploadImagesForTeam(
        selectedTeam.teamId,
        fileArray
      );
      const uploadedUrls = response.uploaded || response.images || [];
      setImages((prev) => [...prev, ...uploadedUrls]);
      setStatus("Upload successful!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("Upload failed");
    } finally {
      setLoading(false);
      e.currentTarget.value = "";
    }
  };

  // Handle delete photo(s)
  const handleDeletePhoto = async () => {
    if (!selectedTeam) return;
    setLoading(true);
    setConfirmDelete(false);
    setStatus("Deleting image(s)...");

    try {
      if (selectionMode) {
        await Promise.all(
          selectedPhotos.map((photo) =>
            ApiService.admin.deleteTeamImage(selectedTeam.teamId, photo)
          )
        );
        setImages((prev) => prev.filter((p) => !selectedPhotos.includes(p)));
        setSelectedPhotos([]);
        setSelectionMode(false);
      } else if (selectedImg) {
        await ApiService.admin.deleteTeamImage(selectedTeam.teamId, selectedImg);
        setImages((prev) => prev.filter((photo) => photo !== selectedImg));
        setSelectedImg(null);
      }
      setStatus("Image(s) deleted successfully");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      setStatus("Failed to delete image(s)");
    } finally {
      setLoading(false);
    }
  };

  const togglePhotoSelection = (photo: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photo) ? prev.filter((p) => p !== photo) : [...prev, photo]
    );
  };

  const selectAll = () => {
    if (selectedPhotos.length === images.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(images);
      setSelectionMode(true);
    }
  };

  useEffect(() => {
    if (selectionMode && selectedPhotos.length === 0) setSelectionMode(false);
  }, [selectedPhotos, selectionMode]);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) loadTeamImages(selectedTeam.teamId);
    else setImages([]);
  }, [selectedTeam]);

  const filteredTeams = teams.filter((team) =>
    team.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background text-foreground relative">
      {/* Sidebar (Mobile friendly) */}
      <aside
        className={`fixed md:static md:translate-x-0 top-0 left-0 w-72 bg-sidebar-inner border-r border-border text-sidebar-foreground h-full transition-transform duration-300 z-40 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Teams</h2>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="m-3">
          <div className="relative rounded-lg bg-sidebar flex items-center border px-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teams..."
              className="w-full py-2 pr-10 bg-transparent outline-none"
            />
            <Search className="absolute right-3 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Team List */}
        <ul className="overflow-y-auto h-[calc(100%-6rem)] pb-20">
          {loading && teams.length === 0 ? (
            <li className="px-4 py-3 text-muted-foreground">Loading teams...</li>
          ) : filteredTeams.length === 0 ? (
            <li className="px-4 py-3 text-muted-foreground">No teams found</li>
          ) : (
            filteredTeams.map((team) => (
              <li key={team.teamId}>
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-md transition ${
                    selectedTeam?.teamId === team.teamId
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {team.title}
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {status && (
          <div className="mb-4 text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            {status}
          </div>
        )}

        {!selectedTeam ? (
          <div className="text-center text-muted-foreground mt-20">
            Select a team to view photos
          </div>
        ) : loading && images.length === 0 ? (
          <div className="flex justify-center items-center mt-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading images...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20">
            No images uploaded yet
          </div>
        ) : (
          <>
            {/* Selection Actions */}
            {selectionMode && (
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedPhotos([]);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={selectAll}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  {selectedPhotos.length === images.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((photo, idx) => {
                const isSelected = selectedPhotos.includes(photo);
                return (
                  <div
                    key={idx}
                    className={`relative overflow-hidden rounded-lg shadow-md group cursor-pointer ${
                      isSelected ? "ring-4 ring-primary" : ""
                    }`}
                    onClick={() =>
                      selectionMode
                        ? togglePhotoSelection(photo)
                        : setSelectedImg(photo)
                    }
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-60 object-cover transition-transform group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-sm border-2 flex items-center justify-center transition
                      ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white/70 border-gray-400 opacity-0 group-hover:opacity-100"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!selectionMode) {
                          setSelectionMode(true);
                          setSelectedPhotos([photo]);
                        } else {
                          togglePhotoSelection(photo);
                        }
                      }}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Floating Buttons */}
        {selectedTeam && (
          <>
            {selectionMode ? (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
                className="fixed bottom-10 right-10 p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-50 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Trash2 className="h-6 w-6" />
                )}
              </button>
            ) : (
              <label className="fixed bottom-10 right-10 p-4 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 z-50">
                {loading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <ImageUp className="h-6 w-6 text-white" />
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-2">
              Confirm Delete
            </h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete the selected image(s)?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePhoto}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {selectedImg && !selectionMode && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImg}
              alt="Enlarged"
              className="max-w-[90vw] max-h-[80vh] rounded-xl object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                className="bg-white text-red-500 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-all"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={20} />
              </button>
              <button
                className="bg-white text-gray-600 rounded-full p-2 shadow hover:bg-gray-800 hover:text-white transition-all"
                onClick={() => setSelectedImg(null)}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
