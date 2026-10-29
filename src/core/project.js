const SCHEMA_VERSION = 1;

// Project properties contain plain JSON-compatible data. Avoid structuredClone
// so Add Component works in older mobile browsers as well.
function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createId(prefix = "id") {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${random}`;
}

export function createProject({ name = "Untitled circuit", id = createId("project") } = {}) {
  const now = new Date().toISOString();
  return { schemaVersion: SCHEMA_VERSION, id, name: String(name).trim() || "Untitled circuit", components: [], wires: [], createdAt: now, updatedAt: now };
}

export function createComponentInstance(definition, { id = createId("component"), x = 80, y = 80 } = {}) {
  if (!definition?.type || !Array.isArray(definition.pins) || definition.pins.length < 1) throw new TypeError("A component definition with pins is required.");
  return { id, type: definition.type, label: definition.label || definition.type, x: Number.isFinite(x) ? x : 80, y: Number.isFinite(y) ? y : 80, properties: cloneData(definition.properties ?? {}), pins: definition.pins.map(pin => ({ id: createId("pin"), key: pin.id, label: pin.label || pin.id })) };
}

export function touchProject(project) { project.updatedAt = new Date().toISOString(); return project; }

export function isProjectDocument(value) { return Boolean(value && typeof value === "object" && value.schemaVersion === SCHEMA_VERSION && typeof value.id === "string" && typeof value.name === "string" && Array.isArray(value.components) && Array.isArray(value.wires)); }
export function serializeProject(project) { if (!isProjectDocument(project)) throw new TypeError("Invalid CircuitBridge project document."); return JSON.stringify(project, null, 2); }
export function parseProject(serialized) { const project = JSON.parse(serialized); if (!isProjectDocument(project)) throw new TypeError("Unsupported or invalid project file."); return project; }
export { SCHEMA_VERSION };