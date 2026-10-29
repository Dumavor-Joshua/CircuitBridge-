import { parseProject, serializeProject } from "../core/project.js";

function getStorage(storage) {
  if (storage !== undefined) return storage;
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

export function saveProject(key, project, storage) {
  try {
    const target = getStorage(storage);
    if (!target) return false;
    target.setItem(key, serializeProject(project));
    return true;
  } catch (error) {
    console.warn("CircuitBridge could not save this project in browser storage.", error);
    return false;
  }
}

export function loadProject(key, storage) {
  try {
    const target = getStorage(storage);
    if (!target) return null;
    const raw = target.getItem(key);
    if (!raw) return null;
    return parseProject(raw);
  } catch (error) {
    console.warn("CircuitBridge could not load the saved project; starting a new project.", error);
    return null;
  }
}

export function exportProject(project) {
  return new Blob([serializeProject(project)], { type: "application/json" });
}
