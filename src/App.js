/* global chrome */

// React and library imports
import React, { useState, useEffect, useRef } from "react";
import { Trash2, ChevronDown, ChevronUp, RotateCcw, Check, PlusCircle, Pencil, Eye, EyeOff, X } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isToday, isTomorrow, parse } from "date-fns";
import ThemeToggle from "./ThemeToggle";
import Radio from "./Radio";
import PriorityDropdown from "./PriorityDropdown";

// Main App component
const App = () => {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("");
  const [profile, setProfile] = useState("Work");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showCompleted, setShowCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPriority, setEditingPriority] = useState("");
  const [editingDueDate, setEditingDueDate] = useState(null);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [inputError, setInputError] = useState(false);
  const textareaRef = useRef(null);

  // Expose React globally for Chrome extension compatibility
  if (typeof window !== "undefined") {
    window.React = React;
  }

  // Load tasks and dark mode from Chrome storage on mount
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["tasks", "darkMode"], (result) => {
        if (result.tasks) setTasks(result.tasks);
        if (typeof result.darkMode === "boolean") setDarkMode(result.darkMode);
      });
    }
  }, []);

  // Toggle dark mode class and persist to Chrome storage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ darkMode });
    }
  }, [darkMode]);

  // Persist tasks to Chrome storage when they change
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ tasks });
    }
  }, [tasks]);

  // Format date for display (can be customized)
  const formatLocalDate = (dateString) => {
    return dateString;
  };

  // Add a new task
  const addTask = () => {
    if (!input.trim()) {
      setInputError(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }
    setInputError(false);
    const formattedDueDate = dueDate ? format(dueDate, "MM/dd/yyyy") : null;

    const newTask = {
      id: Date.now(),
      text: input.trim(),
      priority,
      profile,
      dueDate: formattedDueDate,
      completed: false,
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    setInput("");
    setDueDate(null);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  // Delete a task by id
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Toggle completion status of a task
  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Save edited task
  const saveEdit = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
            ...task,
            text: editingText.trim() || task.text,
            priority: editingPriority,
            dueDate: editingDueDate ? format(editingDueDate, "MM/dd/yyyy") : null,
          }
        : task
    ));
    setEditingTaskId(null);
    setEditingText("");
    setEditingPriority("");
    setEditingDueDate(null);
  };

  // Filter tasks for current profile and priority (not completed)
  const filteredTasks = tasks.filter(
    (task) =>
      task.profile === profile &&
      !task.completed &&
      (filterPriority === "All" || task.priority === filterPriority)
  );

  // Filter completed tasks for current profile
  const completedTasks = tasks.filter(
    (task) => task.profile === profile && task.completed
  );

  // Emoji icons for priority levels
  const priorityIcon = {
    High: "🔴",
    Medium: "🟡",
    Low: "🟢",
  };

  // Render dots and tooltip for tasks on calendar days
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
          <div 
            className="tooltip"
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip-content');
              if (tooltip) {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Find the calendar container - try both selectors
                const calendarContainer = e.currentTarget.closest('.calendar-container') || 
                                        e.currentTarget.closest('.react-calendar');
                const calendarRect = calendarContainer ? calendarContainer.getBoundingClientRect() : null;
                
                // Reset positioning and classes
                tooltip.style.left = '50%';
                tooltip.style.right = 'auto';
                tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
                tooltip.style.top = '-10px';
                tooltip.classList.remove('tooltip-below');
                tooltip.classList.add('tooltip-above');
                
                // Force a reflow to get accurate dimensions
                void tooltip.offsetHeight;
                const tooltipRect = tooltip.getBoundingClientRect();
                
                // Calculate boundaries (use calendar boundaries with padding if available, otherwise viewport)
                const padding = 15;
                const leftBoundary = calendarRect ? calendarRect.left + padding : padding;
                const rightBoundary = calendarRect ? calendarRect.right - padding : viewportWidth - padding;
                const topBoundary = calendarRect ? calendarRect.top + padding : padding;
                const bottomBoundary = calendarRect ? calendarRect.bottom - padding : viewportHeight - padding;
                
                // Check horizontal overflow against calendar boundaries
                const tooltipLeft = rect.left + rect.width / 2 - tooltipRect.width / 2;
                const tooltipRight = tooltipLeft + tooltipRect.width;
                
                if (tooltipLeft < leftBoundary) {
                  // Overflow on left - align to left boundary
                  const offset = leftBoundary - rect.left;
                  tooltip.style.left = `${Math.max(0, offset)}px`;
                  tooltip.style.transform = 'translateY(-100%)';
                } else if (tooltipRight > rightBoundary) {
                  // Overflow on right - align to right boundary
                  const offset = rect.right - rightBoundary;
                  tooltip.style.left = 'auto';
                  tooltip.style.right = `${Math.max(0, offset)}px`;
                  tooltip.style.transform = 'translateY(-100%)';
                }
                
                // Check vertical overflow against calendar boundaries
                const tooltipTop = rect.top - tooltipRect.height - 10;
                const tooltipBottom = rect.bottom + tooltipRect.height + 10;
                
                if (tooltipTop < topBoundary && tooltipBottom <= bottomBoundary) {
                  // Would overflow at top but fits below, show below instead
                  tooltip.style.top = 'calc(100% + 10px)';
                  tooltip.style.transform = tooltip.style.transform.replace('translateY(-100%)', 'translateY(0)');
                  tooltip.classList.remove('tooltip-above');
                  tooltip.classList.add('tooltip-below');
                } else if (tooltipTop < topBoundary && tooltipBottom > bottomBoundary) {
                  // Doesn't fit above or below - show below anyway (fixed height)
                  tooltip.style.top = 'calc(100% + 10px)';
                  tooltip.style.transform = tooltip.style.transform.replace('translateY(-100%)', 'translateY(0)');
                  tooltip.classList.remove('tooltip-above');
                  tooltip.classList.add('tooltip-below');
                }
              }
            }}
          >
            <div className="flex flex-wrap gap-[1px] justify-center items-center mt-1">
              {dayTasks.slice(0, 3).map((task) => (
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
              {dayTasks.length > 3 && (
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold ml-1">
                  +{dayTasks.length - 3}
                </span>
              )}
            </div>
            <div className="tooltip-content">
              <div className="text-xs font-semibold text-gray-200 mb-2 border-b border-gray-600 pb-1">
                {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''} due
              </div>
              {dayTasks.slice(0, 5).map((task) => {
                // Function to break text into lines of max 25 characters each
                const formatTaskText = (text) => {
                  if (text.length <= 25) return text;
                  
                  const words = text.split(' ');
                  const lines = [];
                  let currentLine = '';
                  
                  for (const word of words) {
                    if (lines.length >= 4) break; 
                    
                    if ((currentLine + ' ' + word).trim().length <= 25) {
                      currentLine = (currentLine + ' ' + word).trim();
                    } else {
                      if (currentLine) {
                        lines.push(currentLine);
                        currentLine = word.length <= 25 ? word : word.slice(0, 22) + '...';
                      } else {
                        lines.push(word.length <= 25 ? word : word.slice(0, 22) + '...');
                      }
                    }
                  }
                  
                  if (currentLine && lines.length < 3) {
                    lines.push(currentLine);
                  }
                  
                  // If we have more text and we're at the line limit, add ellipsis to last line
                  if (lines.length === 3 && text.length > lines.join(' ').length) {
                    const lastLine = lines[2];
                    if (lastLine.length > 22) {
                      lines[2] = lastLine.slice(0, 22) + '...';
                    } else {
                      lines[2] = lastLine + '...';
                    }
                  }
                  
                  return lines;
                };
                
                const textLines = formatTaskText(task.text);
                
                return (
                  <div
                    key={task.id}
                    className={`tooltip-task ${task.priority.toLowerCase()}`}
                  >
                    <div className="font-medium max-w-[200px] block">
                      {Array.isArray(textLines) ? (
                        textLines.map((line, index) => (
                          <div key={index} className="leading-tight">
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="leading-tight">{textLines}</div>
                      )}
                    </div>
                    <span className="text-xs opacity-75">
                      {task.priority}
                    </span>
                  </div>
                );
              })}
              {dayTasks.length > 5 && (
                <div className="text-xs text-gray-400 mt-2 text-center border-t border-gray-600 pt-2">
                  +{dayTasks.length - 5} more task{dayTasks.length - 5 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // Helper to check if a task is due soon (today or tomorrow)
  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const parsed = typeof dueDate === "string" ? parse(dueDate, "MM/dd/yyyy", new Date()) : dueDate;
    return isToday(parsed) || isTomorrow(parsed);
  };

  // Main render
  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-[400px] overflow-y-auto font-poppins">
      {/* Header: Profile switch, logo, dark mode toggle */}
      <div className="relative flex items-center justify-between h-10 mb-5 w-full">
        {/* Profile switch radio buttons */}
        <div className="flex flex-col space-y-2 z-10">
          <Radio profile={profile} setProfile={setProfile} />
        </div>

        {/* Logo in the center */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/header.png"
            alt="TaskPilot Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Dark mode toggle and Add Task button */}
        <div className="flex flex-col space-y-1 z-10">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button
            onClick={() => setShowTaskInput((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={showTaskInput ? "Close Task Input" : "Open Task Input"}
          >
            {showTaskInput ? <X size={12} /> : <ChevronDown size={12} />} Add Task
          </button>
        </div>
      </div>

      {/* Task Statistics - Compact (only show if 2+ tasks) */}
      {(filteredTasks.length + completedTasks.length) >= 2 && (
        <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {filteredTasks.length} pending
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {completedTasks.length} completed
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {filteredTasks.length + completedTasks.length === 0 
                ? "0%" 
                : `${Math.round((completedTasks.length / (filteredTasks.length + completedTasks.length)) * 100)}%`
              }
            </div>
          </div>
          {/* Progress Bar - Thinner */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: filteredTasks.length + completedTasks.length === 0 
                  ? "0%" 
                  : `${(completedTasks.length / (filteredTasks.length + completedTasks.length)) * 100}%`
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Task input area (conditionally rendered) */}
      {showTaskInput && (
        <div className="relative flex flex-col gap-1.5 mb-2 task-input-area">
          {/* Task text input */}
          <Pencil className="absolute left-3 top-3 text-white-400 pointer-events-none" size={16} />
          <motion.textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (inputError) setInputError(false);
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" && !e.shiftKey) || (e.key === "Enter" && e.ctrlKey)) {
                e.preventDefault();
                const wasError = !input.trim();
                addTask();
                if (!wasError) setShowTaskInput(false);
              }
            }}
            rows={1}
            className={`w-full pl-9 pr-4 py-2 resize-none overflow-hidden rounded-lg shadow-sm border text-sm
              bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-900 dark:to-indigo-900
              bg-opacity-70 dark:bg-opacity-50
              ${inputError ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500'} focus:outline-none text-gray-900 dark:text-white`}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Write a task..."
            animate={inputError ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : false}
            transition={{ duration: 0.5 }}
          />

          {/* Priority, Due Date, and Add Task buttons */}
          <div className="flex items-center gap-3 w-full">
            {/* Priority dropdown */}
            <div className="flex-1 min-w-[120px]">
              <PriorityDropdown 
                priority={priority} 
                setPriority={setPriority} 
                variant="task" 
              />
            </div>
            {/* Due date picker */}
            <div className="relative flex-shrink-0 w-[60px] flex justify-center items-center">
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                customInput={
                  <div className="relative w-full">
                    <motion.button
                      type="button"
                      className={`w-full flex items-center justify-center p-2 rounded-full shadow-lg border-2 text-sm transition-all duration-300 transform
                        ${dueDate 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white shadow-blue-200' 
                          : 'bg-gradient-to-r from-blue-400 to-indigo-500 border-blue-300 text-white shadow-blue-200'
                        } hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        boxShadow: dueDate 
                          ? "0 0 20px rgba(59, 130, 246, 0.3)" 
                          : "0 0 15px rgba(96, 165, 250, 0.3)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {dueDate ? (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
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
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CalendarIcon size={18} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                }
                calendarClassName="custom-datepicker-calendar dark:bg-gray-800 dark:text-white"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            {/* Add task button */}
            <div className="flex-1 min-w-[90px] max-w-[140px]">
              <motion.button
                onClick={() => {
                  const wasError = !input.trim();
                  addTask();
                  if (!wasError) setShowTaskInput(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 30px rgba(59, 130, 246, 0.4)",
                  background: "linear-gradient(45deg, #3b82f6, #4f46e5, #6366f1)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  background: [
                    "linear-gradient(45deg, #3b82f6, #4f46e5, #6366f1)",
                    "linear-gradient(45deg, #4f46e5, #6366f1, #3b82f6)",
                    "linear-gradient(45deg, #6366f1, #3b82f6, #4f46e5)",
                    "linear-gradient(45deg, #3b82f6, #4f46e5, #6366f1)"
                  ]
                }}
                transition={{ 
                  background: { duration: 3, repeat: Infinity },
                  default: { duration: 0.2 }
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <PlusCircle size={20} />
                </motion.div>
                <span className="font-semibold">Add</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and calendar toggle - Compact */}
        <div className="flex justify-between items-center mb-3 gap-3">
          {/* Priority filter dropdown */}
          <PriorityDropdown 
            filterPriority={filterPriority} 
            setFilterPriority={setFilterPriority} 
          />
          {/* Calendar show/hide button */}
          <motion.button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all duration-300 transform 
              ${showCalendar 
                ? 'border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 shadow-md' 
                : 'border-purple-300 bg-white text-purple-600 dark:border-purple-600 dark:bg-gray-800 dark:text-purple-400 shadow-sm'
              } hover:scale-105 hover:shadow-md focus:outline-none`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={showCalendar ? "Hide Calendar" : "Show Calendar"}
          >
            <motion.div
              animate={{ rotate: showCalendar ? 180 : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              {showCalendar ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </motion.div>
            <span className="relative">
              Calendar
              {showCalendar && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-purple-400 rounded-full"
                />
              )}
            </span>
          </motion.button>
        </div>

      {/* Calendar display - Compact & Themed */}
      {showCalendar && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-3 relative p-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 shadow-lg calendar-container"
        >
          <Calendar
            tileContent={tileContent}
            className="w-full rounded-lg bg-transparent dark:bg-transparent custom-calendar"
            tileClassName="group"
            prev2Label={null}
            next2Label={null}
            selectRange={false}
            showNeighboringMonth={true}
            tileDisabled={() => true}
            onClickDay={(value, event) => {
              event.preventDefault();
              event.stopPropagation();
              return false;
            }}
          />
        </motion.div>
      )}

      {/* Active tasks list - Compact */}
      <div className="space-y-1.5 mb-3">
        <AnimatePresence>
          {filteredTasks.map((task) => {
            const dueSoon = isDueSoon(task.dueDate);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={clsx(
                  "flex flex-col p-2.5 rounded-md border relative transition-all duration-300",
                  "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                  dueSoon && "border-2 border-red-500 dark:border-red-400 shadow-lg"
                )}
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditingText(task.text);
                  setEditingPriority(task.priority);
                  setEditingDueDate(task.dueDate ? new Date(task.dueDate) : null);
                }}
                style={{ cursor: editingTaskId === task.id ? "default" : "pointer" }}
              >
                {/* Due Soon Animated Badge */}
                {dueSoon && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                    className="absolute top-2 right-3 z-10"
                  >
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white shadow animate-pulse select-none">
                      Due Soon
                    </span>
                  </motion.div>
                )}
                {/* Task text and edit controls */}
                <div
                  className={
                    editingTaskId === task.id
                      ? "pr-1 w-full"
                      : "max-h-24 overflow-y-auto pr-1 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:scrollbar-track-transparent"
                  }
                >
                  {editingTaskId === task.id ? (
                    <div
                      className={clsx(
                        "p-[2px] rounded",
                        "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400", 
                        "dark:from-blue-700 dark:via-indigo-800 dark:to-purple-900"
                      )}
                      onClick={e => e.stopPropagation()}
                    >
                      <textarea
                        autoFocus
                        value={editingText}
                        onChange={e => {
                          setEditingText(e.target.value);
                          if (e.target) {
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit(task.id);
                          }
                          if (e.key === "Escape") {
                            setEditingTaskId(null);
                            setEditingText("");
                          }
                        }}
                        className="w-full rounded px-2 py-1 border-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:scrollbar-track-transparent resize-none overflow-auto focus:outline-none"
                        rows={4}
                        style={{ minHeight: "6rem" }}
                      />
                      {/* Priority and Due Date Editors */}
                      <div className="flex gap-2 mt-0 w-full items-center">
                        {/* Priority Editor */}
                        <select
                          value={editingPriority}
                          onChange={e => setEditingPriority(e.target.value)}
                          className="pl-2 pr-2 py-1 rounded-lg shadow-sm border text-xs text-white border-gray-300 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-[80px] max-w-[90px]"
                        >
                          <option value="High">🔴 High</option>
                          <option value="Medium">🟡 Medium</option>
                          <option value="Low">🟢 Low</option>
                        </select>
                        {/* Due Date Editor */}
                        <DatePicker
                          selected={editingDueDate}
                          onChange={date => setEditingDueDate(date)}
                          customInput={
                            <div className="relative min-w-[110px] max-w-[120px]">
                              <button
                                type="button"
                                className="flex items-center px-2 py-1 rounded-lg border text-xs bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 border-gray-300 dark:border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                              >
                                {editingDueDate ? (
                                  <X
                                    size={14}
                                    className="text-white"
                                    aria-label="Clear date"
                                    onClick={e => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      setEditingDueDate(null);
                                    }}
                                  />
                                ) : (
                                  <CalendarIcon size={14} className="text-white" />
                                )}
                                <span className="ml-1 truncate">
                                  {editingDueDate ? format(editingDueDate, "MM/dd/yyyy") : "Due Date"}
                                </span>
                              </button>
                            </div>
                          }
                          calendarClassName="custom-datepicker-calendar dark:bg-gray-800 dark:text-white"
                          dateFormat="MM/dd/yyyy"
                          popperPlacement="bottom"
                        />
                        {/* Save Button */}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            saveEdit(task.id);
                          }}
                          className="ml-2 px-2 py-1 rounded bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white text-xs font-semibold hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                          tabIndex={0}
                          type="button"
                        >
                          Save
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setEditingTaskId(null);
                            setEditingText("");
                          }}
                          className="px-2 py-1 rounded bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white text-xs font-semibold hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                          tabIndex={0}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="font-medium whitespace-pre-wrap break-words w-full block">
                      {task.text}
                    </span>
                  )}
                </div>
                {/* Task meta: due date, priority, actions - Compact */}
                {editingTaskId !== task.id && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 justify-between w-full">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {task.dueDate && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          📅 {formatLocalDate(task.dueDate)}
                        </span>
                      )}
                      <span
                        className={clsx(
                          "text-xs px-1.5 py-0.5 rounded-full font-semibold",
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
                    {/* Complete and delete buttons - Smaller */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className="flex items-center justify-center px-1.5 py-1 rounded-full border border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full"
                      >
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full border border-red-700 dark:border-red-400 bg-red-100 text-red-700 dark:bg-red-700 dark:text-white">
                          <Trash2 size={12} />
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* No tasks placeholder - Compact */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="text-gray-500 dark:text-gray-400 text-base font-medium mb-1">
              No tasks found for {profile}
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              Click "Add Task" to create your first task
            </div>
          </div>
        )}
      </div>

      {/* Show/hide completed tasks button - Compact */}
      {completedTasks.length > 0 && (
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center gap-1 text-xs font-medium text-white px-2 py-1 rounded bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm hover:brightness-110 transition"
        >
          {showCompleted ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {showCompleted ? <EyeOff size={12} /> : <Eye size={12} />}
          {showCompleted ? "Hide" : "Show"} Completed ({completedTasks.length})
        </button>
      )}

      {/* Completed tasks list (collapsible) */}
      <AnimatePresence>
        {showCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1.5 overflow-hidden"
          >
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                className={clsx(
                  "p-2.5 rounded-md border",
                  "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                )}
              >
                <div className="flex flex-col gap-1 w-full max-w-full">
                  {/* Completed task text (strikethrough) */}
                  <div className="max-h-24 overflow-y-auto pr-1 w-full scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <span className="font-medium whitespace-pre-wrap break-words w-full block line-through">
                      {task.text}
                    </span>
                  </div>
                  {/* Completed task meta and actions */}
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
                    {/* Restore and delete buttons for completed tasks */}
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