import { todayISO, priorityRank } from "./utils.js";

export function render({ tasks, filter, search, sort }, els, handlers) {
  const list = els.taskList;
  list.innerHTML = "";

  const q = search.trim().toLowerCase();
  let view = tasks;

  // filter
  if (filter === "active") view = view.filter(t => !t.completed);
  if (filter === "completed") view = view.filter(t => t.completed);

  // search
  if (q) view = view.filter(t => t.title.toLowerCase().includes(q));

  // sort
  view = [...view];
  if (sort === "newest") view.sort((a,b) => b.createdAt - a.createdAt);
  if (sort === "due") view.sort((a,b) => (a.dueDate || "9999-99-99").localeCompare(b.dueDate || "9999-99-99"));
  if (sort === "priority") view.sort((a,b) => priorityRank(b.priority) - priorityRank(a.priority));

  // empty state
  els.emptyState.style.display = view.length ? "none" : "block";

  // stats
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  els.stats.textContent = `Total: ${total} • Completed: ${done} • Active: ${total - done}`;

  // render items
  for (const t of view) {
    const li = document.createElement("li");
    li.className = "task";

    const overdue = t.dueDate && !t.completed && t.dueDate < todayISO();

    li.innerHTML = `
      <input type="checkbox" ${t.completed ? "checked" : ""} aria-label="Complete task" />
      <div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <strong style="text-decoration:${t.completed ? "line-through" : "none"}">${escapeHtml(t.title)}</strong>
          <span class="badge ${t.priority.toLowerCase()}">${t.priority}</span>
          ${overdue ? `<span class="badge overdue">Overdue</span>` : ""}
        </div>
        <div class="meta">
          ${t.dueDate ? `Due: ${t.dueDate}` : "No due date"} • Created: ${new Date(t.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div class="actions">
        <button class="link-btn" data-action="edit">Edit</button>
        <button class="link-btn danger" data-action="delete">Delete</button>
      </div>
    `;

    // events
    li.querySelector("input").addEventListener("change", () => handlers.toggle(t.id));
    li.querySelector('[data-action="delete"]').addEventListener("click", () => handlers.remove(t.id));
    li.querySelector('[data-action="edit"]').addEventListener("click", () => handlers.edit(t.id));

    list.appendChild(li);
  }
}

function escapeHtml(str) {
  return str.replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
}