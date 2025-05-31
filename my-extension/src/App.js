import React, { useState, useEffect, useRef } from "react";
import { Trash2, ChevronDown, ChevronUp, Sun, Moon, RotateCcw, Check, PlusCircle,Pencil,Settings,Filter} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("");
  const [profile, setProfile] = useState("Work");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showCompleted, setShowCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const textareaRef = useRef(null);

  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const formatLocalDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
};
  
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
  
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
  }
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
      <div className="flex justify-between items-center mb-4 h-14 w-full">
        <div className="flex-grow flex justify-center items-center h-full">
          <img src="/header.png" alt="TaskPilot Logo" className="h-full w-auto object-contain" />
        </div>
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
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
            )}
          >
            {prof}
          </button>
        ))}
      </div>

      <div className="relative flex flex-col gap-3 mb-6">
        <Pencil className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={16} />
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addTask();
            }
          }}
          rows={1}
          className="w-full pl-9 pr-4 py-2 resize-none overflow-hidden rounded-lg shadow-sm border text-sm dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        <div className="flex gap-3 flex-col sm:flex-row relative">
          <div className="relative w-full">
          <Settings
            className="absolute left-3 top-2.5 text-gray-400 pointer-events-none z-10 bg-transparent"
            size={18}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg shadow-sm border text-sm dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
          >
            <option value="" disabled hidden>
              Priority
            </option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg shadow-sm border text-sm dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={addTask}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto">
          <Filter
            className="absolute left-3 top-2.5 text-gray-400 pointer-events-none z-10 bg-transparent"
            size={18}
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-3 py-2 rounded-lg shadow-sm border text-sm dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>

        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label={showCalendar ? "Hide Calendar" : "Show Calendar"}
        >
          {showCalendar ? (
            <>
              <ChevronUp size={16} />
              Calendar
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Calendar
            </>
          )}
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
                "flex flex-col p-3 rounded-md border",
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="max-h-24 overflow-y-auto pr-1 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:scrollbar-track-transparent">
                <span className="font-medium whitespace-pre-wrap break-words w-full block">
                  {task.text}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-between w-full">
                <div className="flex flex-wrap items-center gap-2">
                  {task.dueDate && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      📅 Due: {formatLocalDate(task.dueDate)}
                    </span>
                  )}
                  <span
                    className={clsx(
                      "text-xs px-2 py-1 rounded-full font-semibold",
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
                    className="focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border border-red-700 dark:border-red-400 bg-red-100 text-red-700 dark:bg-red-700 dark:text-white">
                      <Trash2 size={16} />
                    </span>
                  </button>
                </div>
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
                  className={clsx(
                    "p-3 rounded-md border",
                    "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                  )}
                >
                  <div className="flex flex-col gap-1 w-full max-w-full">
                    <div className="max-h-24 overflow-y-auto pr-1 w-full scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      <span className="font-medium whitespace-pre-wrap break-words w-full block line-through">
                        {task.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            📅 Due: {formatLocalDate(task.dueDate)}
                          </span>
                        )}
                        <span
                          className={clsx(
                            "text-xs px-2 py-1 rounded-full font-semibold",
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
                          className="flex items-center gap-1 px-2 py-1 rounded-full border border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border border-red-700 dark:border-red-400 bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
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