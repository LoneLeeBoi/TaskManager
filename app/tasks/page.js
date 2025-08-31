"use client";

import { useEffect, useState } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    let url = "/api/tasks";
    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (filter) params.append("status", filter);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filter]);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", status: "pending" });
    fetchTasks();
  };

  // Update task status
  const updateTask = async (id, status) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="mb-6 p-4 border rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 mr-2 rounded w-full mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 mr-2 rounded w-full mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <select
          className="border p-2 mr-2 rounded w-full mb-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Task
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-600">{task.description}</p>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  task.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex gap-2">
              {task.status !== "completed" && (
                <button
                  onClick={() => updateTask(task.id, "completed")}
                  className="text-green-600 hover:underline"
                >
                  Mark Done
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
