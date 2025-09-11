import { useState } from "react";

type Task = {
  id: number;
  teamName: string;
  title: string;
  description: string;
  score: number;
};

const teams = [
  "CodeWarriors",
  "DebugSquad",
  "HackMasters",
  "ByteHunters",
  "AlgoNinjas",
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      teamName: "CodeWarriors",
      title: "Frontend Setup",
      description: "Setup Vite + React + Tailwind for the project.",
      score: 85,
    },
    {
      id: 2,
      teamName: "DebugSquad",
      title: "API Integration",
      description: "Connect backend APIs with frontend components.",
      score: 90,
    },
    {
      id: 3,
      teamName: "HackMasters",
      title: "UI Design",
      description: "Design homepage and team section for the hackathon site.",
      score: 78,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [team, setTeam] = useState(teams[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState<number | "">("");

  const handleAddTask = () => {
    if (!title || !description || score === "") {
      return alert("Please fill all fields including score!");
    }

    const newTask: Task = {
      id: tasks.length + 1,
      teamName: team,
      title,
      description,
      score: Number(score),
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
    setTeam(teams[0]);
    setScore("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-black dark:to-black px-6 py-12 transition-colors duration-300">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center text-orange-600 dark:text-orange-400 mb-8">
        HackOverflow 2K25 - Tasks
      </h1>

      {/* Create New Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl shadow-md hover:bg-orange-600 transition"
        >
          {showForm ? "Cancel" : "Create New Task"}
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-orange-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            Create New Task
          </h2>
          <div className="space-y-4">
            {/* Team Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Select Team
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            {/* Score Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Score
              </label>
              <input
                type="number"
                value={score}
                onChange={(e) =>
                  setScore(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Enter score"
                className="w-full px-4 py-2 border border-orange-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Post Button */}
            <button
              onClick={handleAddTask}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Post Task
            </button>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-6">
          Previous Tasks
        </h2>
        {tasks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-900 border border-orange-200 dark:border-gray-700 rounded-xl shadow-md p-5 hover:shadow-lg hover:bg-orange-50 dark:hover:bg-orange-600/20 transition"
              >
                <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  {task.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  <span className="font-medium">Team:</span> {task.teamName}
                </p>
                <p className="text-gray-700 dark:text-gray-200 mb-3">
                  {task.description}
                </p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Score: {task.score}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No tasks available
          </p>
        )}
      </div>
    </div>
  );
}