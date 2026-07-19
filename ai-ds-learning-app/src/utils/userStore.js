// Central place for reading/writing the logged-in user's data so that
// progress, learning history and profile photo are always scoped to
// THAT user, never shared across different accounts on the same browser.

export const API_BASE = "http://127.0.0.1:5000";

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function saveCurrentUser(user) {
  if (!user) return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("user");
}

// ---- Per-user local fallback (used only if the backend is unreachable) ----
// Namespaced by email so two different accounts used in the same browser
// never bleed into each other's progress.
const visitedKey = (email) => `visitedTopics_${email}`;
const quizKey = (email) => `quizScore_${email}`;

function getLocalVisited(email) {
  if (!email) return [];
  try {
    return JSON.parse(localStorage.getItem(visitedKey(email)) || "[]");
  } catch {
    return [];
  }
}

function setLocalVisited(email, visited) {
  if (!email) return;
  localStorage.setItem(visitedKey(email), JSON.stringify(visited));
}

function getLocalQuizScore(email) {
  if (!email) return null;
  try {
    return JSON.parse(localStorage.getItem(quizKey(email)) || "null");
  } catch {
    return null;
  }
}

function setLocalQuizScore(email, score) {
  if (!email) return;
  localStorage.setItem(quizKey(email), JSON.stringify(score));
}

// Pull this user's latest name/photo/progress from the database so
// Dashboard/Progress/Profile always show what actually belongs to the
// person who is logged in right now, not stale/shared browser data.
export async function refreshUserFromServer(user) {
  if (!user?.email) return user;

  try {
    const res = await fetch(`${API_BASE}/profile?email=${encodeURIComponent(user.email)}`);
    if (!res.ok) throw new Error("profile fetch failed");
    const data = await res.json();
    const merged = { ...user, ...data };
    saveCurrentUser(merged);
    return merged;
  } catch {
    // Backend not reachable right now — fall back to this browser's
    // per-user cache instead of another user's leftover data.
    return {
      ...user,
      visitedTopics: user.visitedTopics ?? getLocalVisited(user.email),
      quizScore: user.quizScore ?? getLocalQuizScore(user.email),
    };
  }
}

export async function markTopicVisited(user, topicId) {
  if (!user?.email || !topicId) return user;

  const current = user.visitedTopics || getLocalVisited(user.email);
  if (current.includes(topicId)) return user;
  const optimistic = [...current, topicId];
  setLocalVisited(user.email, optimistic);

  try {
    const res = await fetch(`${API_BASE}/progress/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, topicId }),
    });
    if (!res.ok) throw new Error("visit save failed");
    const data = await res.json();
    const serverVisited = Array.isArray(data.visitedTopics) ? data.visitedTopics : optimistic;
    setLocalVisited(user.email, serverVisited);
    const merged = { ...user, visitedTopics: serverVisited };
    saveCurrentUser(merged);
    return merged;
  } catch {
    const merged = { ...user, visitedTopics: optimistic };
    saveCurrentUser(merged);
    return merged;
  }
}

export async function saveQuizScore(user, level, score, total) {
  if (!user?.email || !level) return user;

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const entry = { score, total, percent, date: new Date().toISOString() };

  const optimisticScores = { ...(user.quizScore || {}), [level]: entry };
  setLocalQuizScore(user.email, optimisticScores);

  try {
    const res = await fetch(`${API_BASE}/progress/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, level, score, total }),
    });
    if (!res.ok) throw new Error("quiz save failed");
    const data = await res.json();
    const serverScores = data.quizScore || optimisticScores;
    setLocalQuizScore(user.email, serverScores);
    const merged = { ...user, quizScore: serverScores };
    saveCurrentUser(merged);
    return merged;
  } catch {
    const merged = { ...user, quizScore: optimisticScores };
    saveCurrentUser(merged);
    return merged;
  }
}

// Easy is always open. Medium/Hard only unlock once the PREVIOUS level
// has been passed (score % >= PASS_PERCENT) by THIS user specifically —
// read straight off their own quizScore record, never another user's.
export const LEVEL_ORDER = ["easy", "medium", "hard"];
export const PASS_PERCENT = 80;

export function isLevelUnlocked(user, level) {
  const idx = LEVEL_ORDER.indexOf(level);
  if (idx <= 0) return true;
  const prevLevel = LEVEL_ORDER[idx - 1];
  const prevResult = user?.quizScore?.[prevLevel];
  return !!prevResult && prevResult.percent >= PASS_PERCENT;
}

// Uploads a NEW photo for THIS user only (matched by email on the
// backend), so uploading a photo never affects any other account.
export async function uploadProfilePhoto(user, file) {
  if (!user?.email) throw new Error("You must be logged in.");
  if (!file) throw new Error("Choose an image first.");

  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("profileImage", file);

  const res = await fetch(`${API_BASE}/profile/photo`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Photo upload failed");
  }

  const data = await res.json();
  const merged = { ...user, profileImage: data.profileImage };
  saveCurrentUser(merged);
  return merged;
}
