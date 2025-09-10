import { ImageUp, X } from "lucide-react";
import { useState } from "react";

type Team = {
  id: number;
  name: string;
  photos: string[];
};
const teams: Team[] = [
  {
    id: 1,
    name: "Team Alpha",
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
    name: "Team Beta",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ],
  },
  {
    id: 3,
    name: "Team Gamma",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
    ],
  },
  {
    id: 4,
    name: "Team Delta",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      "https://images.unsplash.com/photo-1502767089025-6572583495b4?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    ],
  },
  {
    id: 5,
    name: "Team Epsilon",
    photos: [
      "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=400",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=400",
    ],
  },
  {
    id: 6,
    name: "Team Zeta",
    photos: [
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    ],
  },
  {
    id: 7,
    name: "Team Eta",
    photos: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400",
    ],
  },
  {
    id: 8,
    name: "Team Theta",
    photos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
    ],
  },
  {
    id: 9,
    name: "Team Iota",
    photos: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
    ],
  },
  {
    id: 10,
    name: "Team Kappa",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=400",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    ],
  },
  {
    id: 11,
    name: "Team Lambda",
    photos: [
      "https://images.unsplash.com/photo-1546456073-6712f79251bb?w=400",
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400",
    ],
  },
  {
    id: 12,
    name: "Team Mu",
    photos: [
      "https://images.unsplash.com/photo-1614289371518-722f2615943e?w=400",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    ],
  },
  {
    id: 13,
    name: "Team Nu",
    photos: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ],
  },
  {
    id: 14,
    name: "Team Xi",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    ],
  },
  {
    id: 15,
    name: "Team Omicron",
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newPhotos = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );

    setSelectedTeam((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 min-h-screen border-r border-border bg-sidebar-inner text-sidebar-foreground overflow-y-auto shadow-md scrollbar-hide">
        {/* Teams Title with gradient border + gradient text */}
        <div className="m-2 p-[2px] rounded-lg bg-gradient-to-r from-primary to-secondary">
          <div className="relative rounded-lg bg-sidebar px-6 py-3 flex items-center justify-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Teams
            </h2>
          </div>
        </div>

        {/* Team List */}
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              <button
                onClick={() => setSelectedTeam(team)}
                className={`w-full text-left px-4 py-3 transition-colors ${
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
          {/* Scrollable photos content */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {selectedTeam.photos.map((photo, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform animate-scale-in"
                onClick={() => setSelectedImg(photo)} // <-- add this
              >
                <img
                  src={photo}
                  alt={`${selectedTeam.name} Photo ${index + 1}`}
                  className="w-full h-60 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Floating Upload Button */}
          <label className="fixed bottom-11 right-11 p-4 rounded-full shadow-lg cursor-pointer bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:scale-110 transition-all duration-300">
            <ImageUp className="h-6 w-6 text-white" />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
      </main>

      {/* Enlarged Image Modal */}
      {selectedImg && (
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
          <button
            className="absolute top-3 right-3 bg-white dark:bg-neutral-800 text-red-500 border border-red-200 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-all duration-300"
            onClick={() => setSelectedImg(null)}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        </div>
      )}
    </div>
  );
}
