import { resistorDefinition } from "../components/resistor.js";
import { ledDefinition } from "../components/led.js";
import { voltageSourceDefinition } from "../components/voltage-source.js";
import { switchDefinition } from "../components/switch.js";

// Component definitions are plain JSON-compatible data. JSON cloning keeps
// the editor compatible with older mobile browsers that lack structuredClone.
function cloneDefinition(definition) {
  return JSON.parse(JSON.stringify(definition));
}

const registry = new Map(
  [resistorDefinition, ledDefinition, voltageSourceDefinition, switchDefinition]
    .map(definition => [definition.type, definition])
);

export function getComponentDefinition(type) {
  const definition = registry.get(type);
  return definition ? cloneDefinition(definition) : null;
}

export function listComponentDefinitions() {
  return [...registry.values()].map(cloneDefinition);
}

export function registerComponentDefinition(definition) {
  if (!definition?.type || !Array.isArray(definition.pins)) {
    throw new TypeError("Definition needs a type and pins.");
  }
  if (registry.has(definition.type)) {
    throw new Error(`Duplicate component type: ${definition.type}`);
  }
  registry.set(definition.type, cloneDefinition(definition));
}