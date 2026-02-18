export function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayISO() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

export function priorityRank(p) {
  if (p === "High") return 3;
  if (p === "Medium") return 2;
  return 1;
}