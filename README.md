# TaskPilot Chrome Extension

TaskPilot is a modern, interactive **To-Do List Chrome Extension** built with React and Tailwind CSS. It helps you organize your tasks, manage priorities, and stay productive with a beautiful and intuitive interface.

---

## 🚀 Features

### 📝 Add & Edit Tasks
- Quickly add new tasks with a description, priority, and due date.
- Edit any task inline, including its text, priority, and due date.

### 🗂️ Profiles
- Switch between **Work** and **Personal** profiles to keep your tasks organized.

### 🔴 Priority Levels
- Assign **High**, **Medium**, or **Low** priority to each task.
- Priority is color-coded for quick visual scanning.

### 📅 Due Dates & Calendar
- Assign a due date to any task.
- View all tasks on a monthly calendar with color-coded dots and tooltips.

### 🔍 Filtering & Search
- Filter tasks by priority.
- (Optional: Add a search bar for real-time text filtering.)

### ✅ Complete & Restore Tasks
- Mark tasks as complete with a single click.
- View, hide, or restore completed tasks.

### 🌗 Dark Mode
- Toggle between light and dark themes for comfortable viewing at any time.

### 📌 Due Soon Highlight
- Tasks due today or tomorrow are highlighted with a red border and an animated "Due Soon" badge.

### 🗑️ Delete Tasks
- Remove tasks instantly.
- (Optional: Add an "Undo" feature for accidental deletes.)

### 🎨 Beautiful Animations
- Smooth transitions and animated badges using Framer Motion.

### 💾 Persistent Storage
- All tasks and settings are saved automatically using Chrome's local storage.

---

## 🛠️ How It Works

- **Add a Task:**  
  Enter your task, select a priority and due date, and click the "+" button.

- **Edit a Task:**  
  Click on any task (or its priority/due date) to edit. Change the text, priority, or due date, then save or cancel.

- **Complete a Task:**  
  Click the checkmark to mark as complete. Completed tasks can be shown/hidden and restored.

- **Switch Profiles:**  
  Use the Work/Personal buttons to toggle between task lists.

- **Calendar View:**  
  Click "Calendar" to see all tasks for the month, with tooltips showing task details on each day.

- **Dark Mode:**  
  Use the sun/moon button to toggle dark mode.

- **Due Soon:**  
  Tasks due today or tomorrow are visually highlighted for urgency.

---

## 🧑‍💻 Tech Stack

- **React** (with hooks)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- **date-fns** (date utilities)
- **Chrome Storage API** (persistent data)
- **Lucide Icons** (modern icon set)

---

## 📦 Installation & Usage

1. Clone or download this repository.
2. Run `npm install` to install dependencies.
3. Run `npm start` to launch locally for development.
4. For Chrome Extension:
   - Run `npm run build`
   - Load the `build` folder as an unpacked extension in Chrome.

---

## ✨ Future Ideas

- Task search bar
- Color tags/labels
- Task pinning
- Undo delete
- Notifications for due soon/overdue tasks

---

Enjoy using **TaskPilot** to stay organized and productive!
