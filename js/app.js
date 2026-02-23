import { loadTasks, saveTasks, loadTheme, saveTheme } from "./storage.js";
import { uid } from "./utils.js";
import { render } from "./ui.js";

const els = {
  taskForm: document.getElementById("taskForm"),
  titleInput: document.getElementById("titleInput"),
  priorityInput: document.getElementById("priorityInput"),
  dueInput: document.getElementById("dueInput"),
  searchInput: document.getElementById("searchInput"),
  sortInput: document.getElementById("sortInput"),
  taskList: document.getElementById("taskList"),
  emptyState: document.getElementById("emptyState"),
  stats: document.getElementById("stats"),
  themeToggle: document.getElementById("themeToggle"),
  chips: Array.from(document.querySelectorAll(".chip")),
};

let state = {
  tasks: loadTasks(),
  filter: "all",
  search: "",
  sort: "newest",
};

initTheme();
rerender();

// Add task
els.taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = els.titleInput.value.trim();
  if (!title) return;

  const task = {
    id: uid(),
    title,
    completed: false,
    priority: els.priorityInput.value,
    dueDate: els.dueInput.value || "",
    createdAt: Date.now(),
  };

  state.tasks.unshift(task);
  saveTasks(state.tasks);

  els.taskForm.reset();
  els.priorityInput.value = "Medium";
  rerender();
});

// Search
els.searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  rerender();
});

// Sort
els.sortInput.addEventListener("change", (e) => {
  state.sort = e.target.value;
  rerender();
});

// Filters
els.chips.forEach(btn => {
  btn.addEventListener("click", () => {
    els.chips.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    rerender();
  });
});

// Theme
els.themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
});

// Handlers passed to UI
const handlers = {
  toggle(id) {
    const t = state.tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    saveTasks(state.tasks);
    rerender();
  },
  remove(id) {
    state.tasks = state.tasks.filter(x => x.id !== id);
    saveTasks(state.tasks);
    rerender();
  },
  edit(id) {
    const t = state.tasks.find(x => x.id === id);
    if (!t) return;

    const newTitle = prompt("Edit task title:", t.title);
    if (newTitle === null) return;

    const title = newTitle.trim();
    if (!title) return;

    t.title = title;
    saveTasks(state.tasks);
    rerender();
  }
};

function rerender() {
  render(state, els, handlers);
}

// --- theme helpers ---
function initTheme() {
  const theme = loadTheme();
  setTheme(theme);
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  // simple light theme (optional)
  if (theme === "light") {
    document.documentElement.style.setProperty("--bg", "#f6f8fa");
    document.documentElement.style.setProperty("--panel", "#ffffff");
    document.documentElement.style.setProperty("--text", "#0b1220");
    document.documentElement.style.setProperty("--muted", "#57606a");
    document.documentElement.style.setProperty("--border", "#d0d7de");
    document.documentElement.style.setProperty("--chip", "#f6f8fa");
  } else {
    document.documentElement.style.removeProperty("--bg");
    document.documentElement.style.removeProperty("--panel");
    document.documentElement.style.removeProperty("--text");
    document.documentElement.style.removeProperty("--muted");
    document.documentElement.style.removeProperty("--border");
    document.documentElement.style.removeProperty("--chip");
  }

  els.themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  saveTheme(theme);
}