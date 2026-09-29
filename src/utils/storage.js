/**
 * Dynamic namespaced storage helper for multi-user support.
 * Concept: users/{userId}/{key}
 */

export function getUserKey(userId, key) {
  return `users/${userId}/${key}`;
}

export function loadUserData(userId, key, defaultValue = []) {
  if (!userId) return defaultValue;
  const data = localStorage.getItem(getUserKey(userId, key));
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error loading user data for key: ${key}`, e);
    }
  }
  return defaultValue;
}

export function saveUserData(userId, key, data) {
  if (!userId) return;
  localStorage.setItem(getUserKey(userId, key), JSON.stringify(data));
}
