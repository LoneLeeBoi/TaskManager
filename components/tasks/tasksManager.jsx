"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle } from "lucide-react"; // ✅ More icons

export default function TaskManager() {
  // ✅ Load tasks immediately from localStorage (lazy init)
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ Keep tasks synced with localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...newTask } : t)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { id: Date.now(), ...newTask }]);
    }
    setNewTask({ title: "", description: "", status: "pending" });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask(task);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleMarkDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: "completed" } : t)));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-100 mb-10 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Task Manager</h1>
        <Link
          href="/"
          className="text-sm font-bold bg-gray-200 p-2 rounded hover:bg-gray-300 hover:text-gray-700"
        >
          Go back home
        </Link>
      </div>

      {/* Search + Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search with icon */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 flex items-center gap-1 rounded-lg border text-sm capitalize ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <CheckCircle
                className={`w-4 h-4 ${filter === status ? "opacity-100" : "opacity-40"}`}
              />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-lg bg-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          {editingTask ? (
            <>
              <Edit className="w-5 h-5 text-gray-600" /> Edit Task
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-blue-600" /> Add New Task
            </>
          )}
        </h2>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full mb-2 px-3 py-2 bg-gray-100 rounded-lg"
          required
        />
        <textarea
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full mb-2 px-3 py-2 bg-gray-100 rounded-lg"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="w-full mb-3 px-3 py-2 border bg-gray-100 rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {editingTask ? (
            <>
              <Edit className="w-4 h-4" /> Update Task
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add Task
            </>
          )}
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-green-400">Active Tasks</h1>
        </div>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-4 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div>
                <h3
                  className={`font-semibold text-lg ${
                    task.status === "completed" ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p
                  className={`text-sm ${
                    task.status === "completed" ? "line-through text-gray-400" : "text-gray-600"
                  }`}
                >
                  {task.description}
                </p>
                <span
                  className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                    task.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex gap-2">
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleMarkDone(task.id)}
                    className="px-3 py-1 flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4" /> Done
                  </button>
                )}
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 flex items-center gap-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
