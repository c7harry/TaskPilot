import React, { useState } from "react";
import { Plus, Trash2, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import DarkModeToggle from "./DarkModeToggle";

const priorities = ["Low", "Medium", "High"];
const profiles = ["Work", "Personal"];

export default function App() {
  const [profile, setProfile] = useState("Work");
  const [tasks, setTasks] = useState({ Work: [], Personal: [] });
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  const currentTasks = tasks[profile];

  const addTask = () => {
    if (!newTask.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      priority,
    };
    setTasks({
      ...tasks,
      [profile]: [...tasks[profile], newEntry],
    });
    setNewTask("");
    setPriority("Medium");
  };

  const toggleComplete = (id) => {
    setTasks({
      ...tasks,
      [profile]: tasks[profile].map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const deleteTask = (id) => {
    setTasks({
      ...tasks,
      [profile]: tasks[profile].filter((task) => task.id !== id),
    });
  };

  return (
    <div className="w-96 h-[34rem] bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-2xl p-5 flex flex-col gap-4 transition-all">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">🗂️ {profile} Tasks</h1>
        <DarkModeToggle />
      </div>

      {/* Profile Selector */}
      <div className="flex gap-2 justify-center">
        {profiles.map((p) => (
          <button
            key={p}
            onClick={() => setProfile(p)}
            className={clsx(
              "px-3 py-1 rounded-full text-sm font-medium transition",
              profile === p
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Task Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New task..."
          className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-sm p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-auto border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
        {currentTasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No tasks for {profile} profile.</p>
        ) : (
          currentTasks.map((task) => (
            <div
              key={task.id}
              className={clsx(
                "flex items-center justify-between p-3 rounded-md border text-sm",
                "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                task.completed && "opacity-60 line-through"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{task.text}</span>
                <span
                  className={clsx(
                    "text-xs w-fit px-2 py-0.5 rounded-full font-semibold",
                    task.priority === "High" && "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
                    task.priority === "Medium" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
                    task.priority === "Low" && "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                  )}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="accent-blue-600"
                />
                <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}