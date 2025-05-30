import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, Sun, Moon, RotateCcw, Check } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [profile, setProfile] = useState("Work");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showCompleted, setShowCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      priority,
      profile,
      dueDate,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setInput("");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.profile === profile &&
      !task.completed &&
      (filterPriority === "All" || task.priority === filterPriority)
  );

  const completedTasks = tasks.filter(
    (task) => task.profile === profile && task.completed
  );

  const priorityIcon = {
    High: "🔴",
    Medium: "🟡",
    Low: "🟢",
  };

  const tileContent = ({ date, view }) => {
  if (view === "month") {
    const dayTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        !task.completed &&
        new Date(task.dueDate).toDateString() === date.toDateString() &&
        task.profile === profile
    );

      if (dayTasks.length > 0) {
        return (
          <div className="tooltip">
            <div className="flex flex-wrap gap-[2px] justify-center items-center">
              {dayTasks.map((task) => (
                <span
                  key={task.id}
                  className="dot"
                  style={{
                    backgroundColor:
                      task.priority === "High"
                        ? "#ef4444"
                        : task.priority === "Medium"
                        ? "#facc15"
                        : "#22c55e",
                  }}
                ></span>
              ))}
            </div>
            <div className="tooltip-content">
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`tooltip-task ${task.priority.toLowerCase()}`}
                >
                  {task.text} ({task.priority})
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        {["Work", "Personal"].map((prof) => (
          <button
            key={prof}
            onClick={() => setProfile(prof)}
            className={clsx(
              "px-4 py-1 rounded-full font-medium",
              profile === prof
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
            )}
          >
            {prof}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="px-4 py-2 rounded-md border dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-1 rounded-md border dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-blue-600 text-sm"
        >
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>
      </div>

      {showCalendar && (
        <div className="mb-4 relative">
          <Calendar
            tileContent={tileContent}
            className="w-full rounded-lg border dark:border-gray-700 p-2 bg-white dark:bg-gray-800"
            tileClassName="group"
            prev2Label={null} 
            next2Label={null}
          />
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={clsx(
                "flex items-center justify-between p-3 rounded-md border",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{task.text}</span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span
                  className={clsx(
                    "text-xs mt-1 px-2 py-0.5 rounded-full w-fit font-semibold",
                    task.priority === "High" &&
                      "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white",
                    task.priority === "Medium" &&
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white",
                    task.priority === "Low" &&
                      "bg-green-100 text-green-800 dark:bg-green-600 dark:text-white"
                  )}
                >
                  {priorityIcon[task.priority]} {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="flex items-center justify-center px-2 py-1 rounded-full border border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 border-t pt-4 dark:border-gray-700">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showCompleted ? "Hide" : "Show"} Completed Tasks ({completedTasks.length})
        </button>

        <AnimatePresence>
          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className="flex justify-between items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500"
                >
                  <span className="line-through">{task.text}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <RotateCcw size={14} />
                      <span className="text-xs font-semibold">Restore</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;