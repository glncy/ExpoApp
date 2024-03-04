export const storage = window.localStorage;

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | null {
  try {
    const data = storage.getItem(key);
    if (!data) return null;
    return data;
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load<T>(key: string): T | null {
  try {
    const data = loadString(key);
    if (!data) return null;
    return JSON.parse(data ?? "") as T;
  } catch {
    return null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save<T>(key: string, value: T): boolean {
  try {
    const data = JSON.stringify(value);
    saveString(key, data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): boolean {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Burn it all to the ground.
 */
export function clear(): boolean {
  try {
    storage.clear();
    return true;
  } catch {
    return false;
  }
}
