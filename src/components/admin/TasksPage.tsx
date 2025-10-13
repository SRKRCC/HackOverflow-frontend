// import { useState, useEffect } from 'react';
// import { useAdminStore } from '../../lib/stores/admin';
// import { useAuth } from '../../lib/hooks';
// import { ApiService } from '../../lib/api/service';

// const TasksPage = () => {
//   const { isAuthenticated, user } = useAuth();
//   const { 
//     tasks, 
//     loading, 
//     error,
//     fetchTasks, 
//     createTask, 
//     updateTask, 
//     deleteTask 
//   } = useAdminStore();

//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [teams, setTeams] = useState<any[]>([]);
//   const [loadingTeams, setLoadingTeams] = useState(false);
//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     difficulty: 'medium' as 'easy' | 'medium' | 'hard',
//     round_num: 1,
//     points: 0,
//     teamId: ''
//   });

//   useEffect(() => {
//     if (isAuthenticated && user?.role === 'admin') {
//       fetchTasks();
//       loadTeams();
//     }
//   }, [isAuthenticated, user, fetchTasks]);

//   const loadTeams = async () => {
//     try {
//       setLoadingTeams(true);
//       const teamsData = await ApiService.admin.getAllTeams();
//       setTeams(teamsData);
//     } catch (error) {
//       console.error('Failed to load teams:', error);
//     } finally {
//       setLoadingTeams(false);
//     }
//   };

//   const handleCreateTask = async () => {
//     try {
//       await createTask(newTask);
//       setNewTask({ title: '', description: '', difficulty: 'medium', round_num: 1, points: 0, teamId: '' });
//       setShowCreateForm(false);
//     } catch (error) {
//       console.error('Failed to create task:', error);
//     }
//   };

//   const handleTaskUpdate = async (taskId: number, updates: any) => {
//     try {
//       await updateTask(taskId, updates);
//     } catch (error) {
//       console.error('Failed to update task:', error);
//     }
//   };

//   const handleDeleteTask = async (taskId: number) => {
//     if (confirm('Are you sure you want to delete this task?')) {
//       try {
//         await deleteTask(taskId);
//       } catch (error) {
//         console.error('Failed to delete task:', error);
//       }
//     }
//   };

//   const handleCompleteTask = async (taskId: number, reviewNotes?: string) => {
//     try {
//       await ApiService.admin.completeTask(taskId, reviewNotes);
//       // Refresh tasks to show updated status
//       await fetchTasks();
//     } catch (error) {
//       console.error('Failed to complete task:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Task Management</h1>
//         <button 
//           onClick={() => setShowCreateForm(!showCreateForm)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           {showCreateForm ? 'Cancel' : 'Add New Task'}
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

//       {showCreateForm && (
//         <div className="bg-white p-6 rounded-lg shadow border mb-6">
//           <h2 className="text-xl font-bold mb-4">Create New Task</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Title</label>
//               <input
//                 type="text"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 placeholder="Task title"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Points</label>
//               <input
//                 type="number"
//                 value={newTask.points}
//                 onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) })}
//                 className="w-full p-2 border rounded"
//                 min="1"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Round Number</label>
//               <input
//                 type="number"
//                 value={newTask.round_num}
//                 onChange={(e) => setNewTask({ ...newTask, round_num: parseInt(e.target.value) })}
//                 className="w-full p-2 border rounded"
//                 min="1"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Difficulty</label>
//               <select
//                 value={newTask.difficulty}
//                 onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-2">Assign to Team</label>
//               <select
//                 value={newTask.teamId}
//                 onChange={(e) => setNewTask({ ...newTask, teamId: e.target.value })}
//                 className="w-full p-2 border rounded"
//                 required
//               >
//                 <option value="">Select a team...</option>
//                 {teams.map((team) => (
//                   <option key={team.id} value={team.scc_id}>
//                     {team.scc_id} - {team.title}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="mt-4">
//             <label className="block text-sm font-medium mb-2">Description</label>
//             <textarea
//               value={newTask.description}
//               onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//               className="w-full p-2 border rounded"
//               rows={3}
//               placeholder="Task description"
//             />
//           </div>
//           <div className="mt-4 flex gap-2">
//             <button
//               onClick={handleCreateTask}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               disabled={!newTask.title || !newTask.description || !newTask.teamId}
//             >
//               Create Task
//             </button>
//             <button
//               onClick={() => setShowCreateForm(false)}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="grid gap-4">
//         {tasks.length > 0 ? (
//           tasks.map((task) => (
//             <div key={task.id} className="bg-white p-4 rounded-lg shadow border">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-lg font-semibold">{task.title}</h3>
//                 <div className="flex items-center gap-2">
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     task.completed ? 'bg-green-100 text-green-800' :
//                     task.in_review ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {task.status}
//                   </span>
//                   <button
//                     onClick={() => handleDeleteTask(task.id)}
//                     className="text-red-500 hover:text-red-700 text-sm"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-2">{task.description}</p>
//               <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
//                 <span>Round {task.round_num} • {task.points} points • {task.difficulty}</span>
//                 <span>Created: {new Date(task.timestamp).toLocaleDateString()}</span>
//               </div>
//               {task.team && (
//                 <div className="text-sm text-blue-600 mb-3">
//                   Assigned to: <span className="font-medium">{task.team.title}</span>
//                 </div>
//               )}
//               {task.teamNotes && (
//                 <div className="bg-blue-50 p-2 rounded text-sm mb-2">
//                   <strong>Team Notes:</strong> {task.teamNotes}
//                 </div>
//               )}
//               {task.reviewNotes && (
//                 <div className="bg-green-50 p-2 rounded text-sm mb-3">
//                   <strong>Admin Review:</strong> {task.reviewNotes}
//                 </div>
//               )}
//               {task.status === 'InReview' && (
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={() => handleCompleteTask(task.id, 'Task reviewed and approved')}
//                     className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
//                   >
//                     Complete Task
//                   </button>
//                   <button 
//                     onClick={() => handleTaskUpdate(task.id, { in_review: false })}
//                     className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
//                   >
//                     Remove from Review
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             No tasks available. Create your first task!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TasksPage;