/* global chrome */

// React and library imports
import React, { useState, useEffect, useRef } from "react";
import { Trash2, ChevronDown, ChevronUp, Sun, Moon, RotateCcw, Check, PlusCircle, Pencil, Settings, Filter, Eye, EyeOff, X, Briefcase, User } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isToday, isTomorrow, parse } from "date-fns";

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

  // Helper to check if a task is due soon (today or tomorrow)
  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const parsed = typeof dueDate === "string" ? parse(dueDate, "MM/dd/yyyy", new Date()) : dueDate;
    return isToday(parsed) || isTomorrow(parsed);
  };

  // Main render
  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white w-[400px] overflow-y-auto">
      {/* Header: Profile switch, logo, dark mode toggle */}
      <div className="relative flex items-center justify-between h-10 mb-5 w-full">
        {/* Profile switch buttons */}
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

        {/* Logo in the center */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/header.png"
            alt="TaskPilot Logo"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Dark mode toggle */}
        <div className="z-10 mr-10">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Task input area */}
      <div className="relative flex flex-col gap-1.5 mb-2">
        {/* Task text input */}
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

        {/* Priority, Due Date, and Add Task buttons */}
        <div className="flex justify-between gap-3 w-full">
          {/* Priority dropdown */}
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
          {/* Due date picker */}
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
          {/* Add task button */}
          <button
            onClick={addTask}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1 py-2 px-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:scale-[1.03] transition-transform duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>

      {/* Filter and calendar toggle */}
      <div className="border-t border-black pt-2 mb-4 dark:border-white">
        <div className="flex justify-between items-center mb-4 gap-4">
          {/* Priority filter dropdown */}
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
          {/* Calendar show/hide button */}
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

      {/* Calendar display */}
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

      {/* Active tasks list */}
      <div className="space-y-2 mb-4">
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
                  "flex flex-col p-3 rounded-md border relative transition-all duration-300",
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
                      <div className="flex gap-2 mt-0">
                        {/* Priority Editor */}
                        <select
                          value={editingPriority}
                          onChange={e => setEditingPriority(e.target.value)}
                          className="pl-2 pr-2 py-1 rounded-lg shadow-sm border text-xs text-white border-gray-300 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                            <div className="relative w-full">
                              <button
                                type="button"
                                className="flex items-center px-2 py-1 rounded-lg border text-xs bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 border-gray-300 dark:border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                <span className="ml-1">
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
                {/* Task meta: due date, priority, actions */}
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
                  {/* Complete and delete buttons */}
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
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show/hide completed tasks button */}
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="flex items-center gap-1 text-sm font-medium text-white px-1.5 py-1.3 rounded bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm hover:brightness-110 transition"
      >
        {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showCompleted ? <EyeOff size={14} /> : <Eye size={14} />}
        {showCompleted ? "Hide" : "Show"} Completed Tasks ({completedTasks.length})
      </button>

      {/* Completed tasks list (collapsible) */}
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