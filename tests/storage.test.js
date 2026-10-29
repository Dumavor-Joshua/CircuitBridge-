import test from "node:test";
import assert from "node:assert/strict";
import { createProject } from "../src/core/project.js";
import { loadProject, saveProject } from "../src/storage/project-files.js";

test("saves and loads a project through a storage adapter", () => {
  const values = new Map();
  const storage = { setItem: (key, value) => values.set(key, value), getItem: key => values.get(key) ?? null };
  const project = createProject({ id: "storage-test", name: "Saved project" });
  assert.equal(saveProject("test", project, storage), true);
  assert.equal(loadProject("test", storage).name, "Saved project");
});

test("does not throw when browser storage writes fail", () => {
  const storage = { setItem() { throw new Error("blocked"); }, getItem() { throw new Error("blocked"); } };
  assert.equal(saveProject("test", createProject(), storage), false);
  assert.equal(loadProject("test", storage), null);
});
