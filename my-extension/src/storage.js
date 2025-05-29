/* global chrome */

// Save todos to chrome.storage.local
export const saveTodos = async (todos) => {
  try {
    await chrome.storage.local.set({ todos });
    console.log("Todos saved successfully.");
  } catch (error) {
    console.error("Failed to save todos:", error);
  }
};

// Load todos from chrome.storage.local
export const loadTodos = async () => {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get("todos", (result) => {
        resolve(result.todos || []);
      });
    } catch (error) {
      console.error("Failed to load todos:", error);
      resolve([]);
    }
  });
};