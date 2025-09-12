import React, { useState, useEffect } from "react";
import { Search, ImageUp, Trash2, X, Check } from "lucide-react";

type Team = {
  id: number;
  name: string;
  photos: string[];
};

const teams: Team[] = [
  {
    id: 1,
    name: "Alpha",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    ],
  },
  {
    id: 2,
    name: "Beta",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ],
  },
  {
    id: 3,
    name: "Gamma",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
    ],
  },
  {
    id: 4,
    name: "Delta",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      "https://images.unsplash.com/photo-1502767089025-6572583495b4?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    ],
  },
  {
    id: 5,
    name: "Epsilon",
    photos: [
      "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=400",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=400",
    ],
  },
  {
    id: 6,
    name: "Zeta",
    photos: [
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    ],
  },
  {
    id: 7,
    name: "Eta",
    photos: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400",
    ],
  },
  {
    id: 8,
    name: "Theta",
    photos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
    ],
  },
  {
    id: 9,
    name: "Iota",
    photos: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
    ],
  },
  {
    id: 10,
    name: "Kappa",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=400",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    ],
  },
  {
    id: 11,
    name: "Lambda",
    photos: [
      "https://images.unsplash.com/photo-1546456073-6712f79251bb?w=400",
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400",
    ],
  },
  {
    id: 12,
    name: "Mu",
    photos: [
      "https://images.unsplash.com/photo-1614289371518-722f2615943e?w=400",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    ],
  },
  {
    id: 13,
    name: "Nu",
    photos: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ],
  },
  {
    id: 14,
    name: "Xi",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    ],
  },
  {
    id: 15,
    name: "Omicron",
    photos: [
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=400",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
    ],
  },
];


export default function TeamPhotos() {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newPhotos = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );

    setSelectedTeam((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));

    e.currentTarget.value = "";
  };

  const handleDeletePhoto = () => {
    if (selectionMode) {
      setSelectedTeam((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => !selectedPhotos.includes(p)),
      }));
      setSelectionMode(false);
      setSelectedPhotos([]);
    } else if (selectedImg) {
      setSelectedTeam((prev) => ({
        ...prev,
        photos: prev.photos.filter((photo) => photo !== selectedImg),
      }));
      setSelectedImg(null);
    }
  };

  const togglePhotoSelection = (photo: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photo) ? prev.filter((p) => p !== photo) : [...prev, photo]
    );
  };

  // Exit selection mode automatically when no photos are selected
  useEffect(() => {
    if (selectionMode && selectedPhotos.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedPhotos, selectionMode]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 min-h-screen border-r border-border bg-sidebar-inner text-sidebar-foreground overflow-y-auto shadow-md scrollbar-hide">
        {/* Search Bar */}
        <div className="m-2 p-[2px] rounded-lg bg-gradient-to-r from-primary to-secondary">
          <div className="relative rounded-lg bg-sidebar px-3 py-2 flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // 🔍 trigger search action
                  console.log("Searching for:", searchTerm);
                }
              }}
              placeholder="Search teams..."
              className="w-full pr-10 pl-3 py-2 rounded-md bg-sidebar text-foreground placeholder-muted-foreground focus:outline-none"
            />
            <button
              onClick={() => {
                // 🔍 same as pressing Enter
                console.log("Searching for:", searchTerm);
              }}
              className="absolute right-2 p-1 rounded-md hover:bg-muted transition"
            >
              <Search className="h-5 w-5 text-primary" />
            </button>
          </div>


        </div>

        {/* Filtered Team List */}
        <ul>
          {filteredTeams.map((team) => (
            <li key={team.id}>
              <button
                onClick={() => setSelectedTeam(team)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors ${
                  selectedTeam.id === team.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {team.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto min-h-screen">
        <div className="relative flex-1">
          {selectionMode && (
            <button
              onClick={() => {
                setSelectionMode(false);
                setSelectedPhotos([]);
              }}
              className="absolute -top-2 left-2 mb-4 bg-black/60 text-white rounded-md px-3 py-1 shadow"
            >
              Cancel
            </button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {selectedTeam.photos.map((photo, index) => {
              const isSelected = selectedPhotos.includes(photo);

              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer hover:scale-105 transition-transform"
                  onClick={() =>
                    selectionMode
                      ? togglePhotoSelection(photo)
                      : setSelectedImg(photo)
                  }
                >
                  <img
                    src={photo}
                    alt={`${selectedTeam.name} Photo ${index + 1}`}
                    className="w-full h-60 object-cover rounded-lg"
                  />

                  {/* Checkbox overlay */}
                  {(selectionMode || !selectionMode) && (
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-sm border-2 flex items-center justify-center transition
                        ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : selectionMode
                            ? "bg-white/70 border-gray-400"
                            : "opacity-0 group-hover:opacity-100 bg-white/70 border-gray-400"
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
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Button */}
          {selectionMode ? (
            <button
              onClick={handleDeletePhoto}
              className="fixed bottom-11 right-11 p-4 rounded-full shadow-lg cursor-pointer bg-red-500 hover:bg-red-600 hover:scale-110 transition-all duration-300 z-50"
            >
              <Trash2 className="h-6 w-6 text-white" />
            </button>
          ) : (
            <label className="fixed bottom-11 right-11 p-4 rounded-full shadow-lg cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:scale-110 transition-all duration-300 z-50">
              <ImageUp className="h-6 w-6 text-white" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </main>

      {/* Enlarged Image Modal */}
      {selectedImg && !selectionMode && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImg}
              alt="Enlarged"
              className="max-w-[480px] max-h-[70vh] rounded-xl object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                className="bg-white dark:bg-neutral-800 text-red-500 border border-red-200 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-all duration-300"
                onClick={handleDeletePhoto}
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
              <button
                className="bg-white dark:bg-neutral-800 text-red-500 border border-red-200 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-all duration-300"
                onClick={() => setSelectedImg(null)}
                title="Close"
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


