import React, { useState, useEffect } from "react";
import { saveTodos, loadTodos } from "./storage";
import { Check, X, Plus } from "lucide-react";

const categories = ["Work", "Personal", "Urgent"];
const priorities = ["Low", "Medium", "High"];

const badgeColor = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

const categoryColor = {
  Work: "bg-blue-100 text-blue-800",
  Personal: "bg-purple-100 text-purple-800",
  Urgent: "bg-pink-100 text-pink-800",
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    priority: priorities[1],
  });

  useEffect(() => {
    loadTodos().then(setTodos);
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = () => {
    if (!form.title.trim()) return;
    const newTodo = {
      id: Date.now(),
      ...form,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setForm({ ...form, title: "" });
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-96 h-[34rem] p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl overflow-auto">
      <h1 className="text-2xl font-bold mb-4">🗂️ To-Do List</h1>

      {/* Form */}
      <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-inner">
        <input
          type="text"
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New task..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="flex gap-2">
          <select
            className="flex-1 px-2 py-2 rounded-md border dark:bg-gray-900"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="flex-1 px-2 py-2 rounded-md border dark:bg-gray-900"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {priorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addTodo}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Todo List */}
      <ul className="mt-4 space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex justify-between items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition hover:shadow-md ${
              todo.completed ? "opacity-50 line-through" : ""
            }`}
          >
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{todo.title}</h2>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                <span
                  className={`px-2 py-1 rounded-full font-medium ${categoryColor[todo.category]}`}
                >
                  {todo.category}
                </span>
                <span
                  className={`px-2 py-1 rounded-full font-medium ${badgeColor[todo.priority]}`}
                >
                  {todo.priority} Priority
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                title="Toggle Complete"
                onClick={() => toggleTodo(todo.id)}
                className="text-green-500 hover:text-green-600"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                title="Delete"
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}