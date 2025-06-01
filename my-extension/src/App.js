import React, { useState, useEffect, useRef } from "react";
import { Trash2, ChevronDown, ChevronUp, Sun, Moon, RotateCcw, Check, PlusCircle,Pencil,Settings,Filter, Eye, EyeOff, X,Briefcase, User,} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { Calendar as CalendarIcon } from "lucide-react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("");
  const [profile, setProfile] = useState("Work");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showCompleted, setShowCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const textareaRef = useRef(null);

  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const formatLocalDate = (dateString) => {
  return dateString;
};
  
  const addTask = () => {
  if (!input.trim()) return;

  const formattedDueDate = dueDate ? format(dueDate, "MM/dd/yyyy") : null;

  const newTask = {
    id: Date.now(),
    text: input.trim(),
    priority,
    profile,
    dueDate: formattedDueDate,
    completed: false,
  };

  setTasks([newTask, ...tasks]);
  setInput("");
  setDueDate(null);

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
      <div className="relative flex items-center justify-between h-10 mb-5 w-full">
      <div className="flex flex-col space-y-2 z-10">
        {["Work", "Personal"].map((prof) => {
          const Icon = prof === "Work" ? Briefcase : User;
          return (
            <button
              key={prof}
              onClick={() => setProfile(prof)}
              className={clsx(
                "flex items-center space-x-1 px-2 py-1 rounded-full font-medium text-xs text-white bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-200 shadow",
                profile === prof
                  ? "ring-2 ring-black ring-offset-0 dark:ring-white dark:ring-offset-gray-800"
                  : "opacity-80 hover:opacity-100"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{prof}</span>
            </button>
          );
        })}
      </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src="/header.png"
          alt="TaskPilot Logo"
          className="h-14 w-auto object-contain"
        />
      </div>

        <div className="z-10 mr-10">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col gap-1.5 mb-2">
        <Pencil className="absolute left-3 top-3 text-white-400 pointer-events-none" size={16} />
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
          className="w-full pl-9 pr-4 py-2 resize-none overflow-hidden rounded-lg shadow-sm border text-sm
            bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-900 dark:to-indigo-900
            bg-opacity-70 dark:bg-opacity-50
            border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Write a task..."
        />

        <div className="flex justify-between gap-3 w-full">
          <div className="relative flex-1 min-w-[120px]">
          <Settings
          className="absolute left-3 top-2.5 text-white pointer-events-none z-10 bg-transparent"
          size={18}
        />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full pl-8 pr-0 py-2 rounded-lg shadow-sm border text-sm text-white border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
          >
            <option value="" disabled hidden>
              Priority
            </option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>
           <div className="relative flex-1 min-w-[100px] flex justify-center items-center">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              customInput={
                <div className="relative w-full">
                  <button
                  type="button"
                  className={`w-full flex items-center justify-center p-2 rounded-lg shadow-sm border text-sm transition-colors
                    bg-gradient-to-r from-blue-500 to-indigo-600 border-gray-600 text-white
                    focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                >
                  {dueDate ? (
                    <X
                      size={18}
                      className="text-white"
                      aria-label="Clear date"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDueDate(null);
                      }}
                    />
                  ) : (
                    <CalendarIcon size={18} className="text-white" />
                  )}
                </button>
                </div>
              }
              calendarClassName="custom-datepicker-calendar dark:bg-gray-800 dark:text-white"
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <button
            onClick={addTask}
            className="flex-1 sm:flex-none sm:w-auto min-w-[100px] flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </div>
      <div className="border-t border-black pt-2 mb-4 dark:border-white">
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="relative inline-block">
          <Filter
            className="absolute left-3 top-2.5 text-gray-200 pointer-events-none z-10 bg-transparent"
            size={18}
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="pl-10 pr-2 py-2 rounded-lg shadow-sm border text-sm text-white border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-auto"
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
      </div>
      
      {showCalendar && (
        <div
          className="mb-4 relative p-2 rounded-lg border dark:border-gray-700 bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-900 dark:to-indigo-900">
          <Calendar
            tileContent={tileContent}
            className="w-full rounded-lg bg-transparent dark:bg-transparent"
            tileClassName="group"
            prev2Label={null}
            next2Label={null}
          />
        </div>
      )}

      <div className="space-y-2 mb-4">
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

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center gap-1 text-sm font-medium text-white px-1.5 py-1.3 rounded bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm hover:brightness-110 transition"
        >
          {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showCompleted ? <EyeOff size={14} /> : <Eye size={14} />}
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
  );
};

export default App;