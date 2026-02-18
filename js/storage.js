const KEY = "taskflow.tasks";
const THEME_KEY = "taskflow.theme";

export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) ?? "dark";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}