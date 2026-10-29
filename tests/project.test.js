import test from "node:test";
import assert from "node:assert/strict";
import { createProject, createComponentInstance, parseProject, serializeProject, isProjectDocument } from "../src/core/project.js";
import { getComponentDefinition } from "../src/core/component-registry.js";
import { validateProject } from "../src/core/validation.js";

test("creates a valid empty project", () => { const project = createProject({ name: "Test", id: "p1" }); assert.equal(project.name, "Test"); assert.deepEqual(project.components, []); assert.equal(isProjectDocument(project), true); });
test("round trips JSON", () => { const project = createProject({ id: "p2" }); assert.deepEqual(parseProject(serializeProject(project)), project); });
test("rejects invalid document", () => assert.throws(() => serializeProject({}), /Invalid/));
test("component instances receive unique stable pin IDs", () => { const definition = getComponentDefinition("resistor"); const first = createComponentInstance(definition, { id: "r1" }); const second = createComponentInstance(definition, { id: "r2" }); assert.equal(first.pins.length, 2); assert.notEqual(first.pins[0].id, first.pins[1].id); assert.notEqual(first.pins[0].id, second.pins[0].id); assert.equal(first.pins[0].key, "a"); });
test("validates a component instance and rejects duplicate pin IDs", () => { const project = createProject({ id: "p3" }); project.components.push(createComponentInstance(getComponentDefinition("led"), { id: "led1" })); assert.deepEqual(validateProject(project), []); project.components[0].pins[1].id = project.components[0].pins[0].id; assert.ok(validateProject(project).some(error => error.includes("Duplicate pin ID"))); });
