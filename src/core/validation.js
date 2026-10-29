import { indexPins, validateWire } from "./connections.js";
import { getComponentDefinition } from "./component-registry.js";

export function validateProject(project) {
  const errors = [];
  if (!project || typeof project !== "object") return ["Project must be an object."];
  if (project.schemaVersion !== 1) errors.push("Unsupported schema version.");
  if (!Array.isArray(project.components) || !Array.isArray(project.wires)) return [...errors, "Components and wires must be arrays."];
  const componentIds = new Set();
  for (const component of project.components) {
    if (!component?.id || !component?.type) { errors.push("Every component needs an ID and type."); continue; }
    if (componentIds.has(component.id)) errors.push(`Duplicate component ID: ${component.id}`);
    componentIds.add(component.id);
    if (!getComponentDefinition(component.type)) errors.push(`Unknown component type: ${component.type}`);
    if (!Array.isArray(component.pins) || component.pins.length === 0) errors.push(`Component ${component.id} must have pins.`);
    for (const pin of component.pins ?? []) if (!pin?.id || !pin?.key) errors.push(`Component ${component.id} has an invalid pin.`);
  }
  try { indexPins(project); } catch (error) { errors.push(error.message); }
  const wireIds = new Set();
  for (const wire of project.wires) {
    if (wireIds.has(wire?.id)) errors.push(`Duplicate wire ID: ${wire.id}`);
    wireIds.add(wire?.id);
    const result = validateWire(project, wire);
    if (!result.valid) errors.push(result.reason);
  }
  return [...new Set(errors)];
}
