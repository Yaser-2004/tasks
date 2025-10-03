import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tasks"); // "profile" | "tasks"
  const [profile, setProfile] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // for mobile sidebar

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL = `${import.meta.env.VITE_PUBLIC_BASEURL}/api`;

  // 🔹 Fetch profile
  useEffect(() => {
    if (activeTab === "profile" && token) {
      axios
        .get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  // 🔹 Fetch tasks
  useEffect(() => {
    if (activeTab === "tasks" && token) {
      axios
        .get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setTasks(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  // 🔹 Open modal for new task
  const openNewTaskModal = () => {
    setEditingTask(null);
    setTaskForm({ title: "", description: "" });
    setIsTaskModalOpen(true);
  };

  // 🔹 Open modal for edit
  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description });
    setIsTaskModalOpen(true);
  };

  // 🔹 Save task (create or update)
  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const res = await axios.put(
          `${API_URL}/tasks/${editingTask._id}`,
          { ...taskForm },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasks.map((t) => (t._id === editingTask._id ? res.data : t)));
      } else {
        const res = await axios.post(
          `${API_URL}/tasks`,
          { ...taskForm, createdAt: new Date().toISOString() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
      }
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Toggle complete
  const handleToggleComplete = async (task) => {
    try {
      const res = await axios.put(
        `${API_URL}/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Filtering & Sorting
  let filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter === "finished") {
    filteredTasks = filteredTasks.filter((t) => t.completed === true);
  } else if (statusFilter === "not-finished") {
    filteredTasks = filteredTasks.filter((t) => t.completed === false);
  }

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1; // completed goes last
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (responsive) */}
      <div
        className={`fixed lg:static top-0 left-0 min-h-full w-64 bg-gradient-to-b from-indigo-700 to-purple-800 text-white p-6 space-y-6 transform transition-transform duration-300 z-50 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h1 className={`text-2xl font-bold ${isSidebarOpen ? 'mt-16' : null}`}>My Dashboard</h1>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-2 rounded-lg ${activeTab === "tasks" ? "bg-white/20" : ""}`}
            onClick={() => {
              setActiveTab("tasks");
              setIsSidebarOpen(false); // auto-close on mobile
            }}
          >
            Tasks
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg ${activeTab === "profile" ? "bg-white/20" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setIsSidebarOpen(false); // auto-close on mobile
            }}
          >
            Profile
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Mobile top bar */}
        <div className="lg:hidden relative z-100 flex justify-between items-center mb-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md bg-indigo-600 text-white focus:outline-none"
          >
            ☰
          </button>
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <p>
                    <span className="font-semibold">Name:</span> {profile.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {profile.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                  className="hover:cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 sm:flex-none p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={openNewTaskModal}
                  className="hover:cursor-pointer px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Add Task
                </button>
              </div>
            </div>

            <select
              className="mb-6 border-b p-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="finished">Finished</option>
              <option value="not-finished">Not Finished</option>
            </select>

            {/* Task Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedTasks.map((task) => (
                <div
                  key={task._id}
                  className={`relative p-5 rounded-lg shadow-md border transition 
                  ${
                    task.completed
                      ? "bg-green-200 border-green-400"
                      : "bg-white border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {/* Check button */}
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`hover:cursor-pointer absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center 
                    ${
                      task.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-green-400 hover:text-white"
                    }`}
                  >
                    ✓
                  </button>

                  <h3 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => openEditTaskModal(task)}
                      className="hover:cursor-pointer px-3 py-1 text-sm rounded bg-yellow-400 text-white hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="hover:cursor-pointer px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editingTask ? "Edit Task" : "New Task"}
            </h2>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                placeholder="Task Description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hover:cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {editingTask ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
