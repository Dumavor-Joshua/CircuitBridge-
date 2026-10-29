import { createProject, createComponentInstance, createId, touchProject, serializeProject, parseProject } from "./core/project.js";
import { listComponentDefinitions } from "./core/component-registry.js";
import { addWire } from "./core/connections.js";
import { validateProject } from "./core/validation.js";
import { saveProject, loadProject } from "./storage/project-files.js";

const workspace = document.querySelector("#workspace");
const message = document.querySelector("#project-message");
const status = document.querySelector("#app-status");
const newButton = document.querySelector("#new-project-button");
const addSelect = document.querySelector("#component-type");
const addButton = document.querySelector("#add-component-button");
const exportButton = document.querySelector("#export-project-button");
const importInput = document.querySelector("#import-project-input");
const key = "circuitbridge.active-project";
const definitions = listComponentDefinitions();
let project = loadProject(key) ?? createProject();
let selectedPinId = null;

function announce(text) { if (status) status.textContent = text; }
function persist() { touchProject(project); const saved = saveProject(key, project); if (message) message.textContent = `Project: ${project.name} · ${project.components.length} component(s) · ${project.wires.length} wire(s)${saved ? "" : " · Browser storage unavailable; use Export to keep your changes."}`; return saved; }
function makeButton(text, className, onClick) { const button = document.createElement("button"); button.type = "button"; button.className = className; button.textContent = text; button.addEventListener("click", onClick); return button; }

function illustrationFor(type) {
  const art = {
    resistor: '<svg viewBox="0 0 180 76" role="img" aria-label="Resistor illustration"><path d="M12 38H48M132 38H168" stroke="#b6c5d9" stroke-width="3" stroke-linecap="round"/><rect x="48" y="23" width="84" height="30" rx="5" fill="#d7b98a" stroke="#f4dfb7" stroke-width="2"/><path d="M66 24V52M81 24V52M108 24V52M120 24V52" stroke="#9b4e32" stroke-width="5"/></svg>',
    led: '<svg viewBox="0 0 180 76" role="img" aria-label="LED illustration"><path d="M65 43V67M115 43V67" stroke="#b6c5d9" stroke-width="3"/><path d="M52 42A38 38 0 0 1 128 42Z" fill="#d84b5d" stroke="#ff9aa5" stroke-width="2"/><path d="M58 42H122" stroke="#ffb7be" stroke-width="2"/><path d="M127 12l12 -8M132 23l16 -2" stroke="#ffd56a" stroke-width="3" stroke-linecap="round"/></svg>',
    "voltage-source": '<svg viewBox="0 0 180 76" role="img" aria-label="Voltage source illustration"><path d="M12 38H57M123 38H168" stroke="#b6c5d9" stroke-width="3"/><circle cx="90" cy="38" r="28" fill="#244b77" stroke="#8ac7ff" stroke-width="2.5"/><path d="M80 29H100M90 19V39M81 49H99" stroke="#eaf6ff" stroke-width="3" stroke-linecap="round"/></svg>',
    switch: '<svg viewBox="0 0 180 76" role="img" aria-label="Switch illustration"><path d="M12 50H56M124 50H168" stroke="#b6c5d9" stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="50" r="5" fill="#c5d3e5"/><circle cx="124" cy="50" r="5" fill="#c5d3e5"/><path d="M56 50L112 20" stroke="#e8edf7" stroke-width="5" stroke-linecap="round"/><path d="M111 20l8 1" stroke="#66e3c4" stroke-width="3" stroke-linecap="round"/></svg>'
  };
  const wrapper = document.createElement("div");
  wrapper.className = "component-art";
  wrapper.innerHTML = art[type] ?? '<svg viewBox="0 0 180 76" role="img" aria-label="Electronic component illustration"><rect x="52" y="18" width="76" height="40" rx="7" fill="#244b77" stroke="#8ac7ff" stroke-width="2"/></svg>';
  return wrapper;
}

function render() {
  if (!workspace) return;
  workspace.replaceChildren();
  const toolbar = document.createElement("div"); toolbar.className = "canvas-toolbar";
  const hint = document.createElement("p"); hint.className = "canvas-hint"; hint.textContent = selectedPinId ? "Choose a second pin to connect the wire." : "Add a component, then select two pins to wire them together."; toolbar.append(hint); workspace.append(toolbar);
  const board = document.createElement("div"); board.className = "component-board";
  if (!project.components.length) { const empty = document.createElement("div"); empty.className = "canvas-placeholder"; empty.innerHTML = "<h3>Your circuit starts here</h3><p>Add a component above to begin building.</p>"; board.append(empty); }
  for (const component of project.components) {
    const card = document.createElement("article"); card.className = "circuit-component"; card.dataset.componentId = component.id;
    const title = document.createElement("h3"); title.textContent = component.label;
    const type = document.createElement("p"); type.className = "component-type"; type.textContent = component.type;
    const pins = document.createElement("div"); pins.className = "component-pins";
    for (const pin of component.pins) { const pinButton = makeButton(`${pin.label} · ${pin.id.slice(-5)}`, `pin-button${selectedPinId === pin.id ? " is-selected" : ""}`, () => choosePin(pin.id)); pins.append(pinButton); }
    const remove = makeButton("Remove", "button button-subtle", () => removeComponent(component.id));
    card.append(title, illustrationFor(component.type), type, pins, remove); board.append(card);
  }
  workspace.append(board);
  const wirePanel = document.createElement("section"); wirePanel.className = "wire-panel";
  const wireTitle = document.createElement("h3"); wireTitle.textContent = `Connections (${project.wires.length})`; wirePanel.append(wireTitle);
  if (!project.wires.length) { const empty = document.createElement("p"); empty.className = "component-type"; empty.textContent = "No wires yet."; wirePanel.append(empty); }
  for (const wire of project.wires) { const row = document.createElement("div"); row.className = "wire-row"; const label = document.createElement("span"); label.textContent = `${pinLabel(wire.fromPinId)} ↔ ${pinLabel(wire.toPinId)}`; row.append(label, makeButton("Remove wire", "button button-subtle", () => { project.wires = project.wires.filter(item => item.id !== wire.id); persist(); render(); announce("Wire removed."); })); wirePanel.append(row); }
  workspace.append(wirePanel);
  const errors = validateProject(project); if (errors.length) announce(`Project needs attention: ${errors[0]}`);
}
function pinLabel(id) { for (const component of project.components) { const pin = component.pins.find(item => item.id === id); if (pin) return `${component.label} · ${pin.label}`; } return "Unknown pin"; }
function choosePin(pinId) {
  if (!selectedPinId) { selectedPinId = pinId; render(); announce("First pin selected. Choose a second pin."); return; }
  if (selectedPinId === pinId) { selectedPinId = null; render(); announce("Pin selection cleared."); return; }
  try { addWire(project, { id: createId("wire"), fromPinId: selectedPinId, toPinId: pinId }); selectedPinId = null; persist(); render(); announce("Wire added."); }
  catch (error) { selectedPinId = null; render(); announce(error.message); }
}
function removeComponent(id) { const component = project.components.find(item => item.id === id); if (!component) return; const pinIds = new Set(component.pins.map(pin => pin.id)); project.components = project.components.filter(item => item.id !== id); project.wires = project.wires.filter(wire => !pinIds.has(wire.fromPinId) && !pinIds.has(wire.toPinId)); selectedPinId = null; persist(); render(); announce(`${component.label} removed; connected wires were also removed.`); }
function addComponent() { const definition = definitions.find(item => item.type === addSelect?.value); if (!definition) return announce("Choose a component type first."); const instance = createComponentInstance(definition, { x: 80 + project.components.length * 24, y: 80 + project.components.length * 24 }); project.components.push(instance); persist(); render(); announce(`${definition.label} added. Select pins to create a wire.`); }
function fillSelect() { if (!addSelect) return; for (const definition of definitions) { const option = document.createElement("option"); option.value = definition.type; option.textContent = definition.label; addSelect.append(option); } }
newButton?.addEventListener("click", () => { project = createProject(); selectedPinId = null; persist(); render(); announce("New project created."); });
addButton?.addEventListener("click", addComponent);
exportButton?.addEventListener("click", () => { try { const blob = new Blob([serializeProject(project)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "circuit"}.circuitbridge.json`; link.click(); URL.revokeObjectURL(url); announce("Project exported as JSON."); } catch (error) { announce(error.message); } });
importInput?.addEventListener("change", async () => { const file = importInput.files?.[0]; if (!file) return; try { const parsed = parseProject(await file.text()); const errors = validateProject(parsed); if (errors.length) throw new Error(errors[0]); project = parsed; selectedPinId = null; persist(); render(); announce("Project imported successfully."); } catch (error) { announce(`Import failed: ${error.message}`); } finally { importInput.value = ""; } });
fillSelect(); render(); persist();