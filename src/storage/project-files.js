import {parseProject,serializeProject} from "../core/project.js";
export function saveProject(key,project,storage=globalThis.localStorage){if(!storage)return false;storage.setItem(key,serializeProject(project));return true;}
export function loadProject(key,storage=globalThis.localStorage){if(!storage)return null;const raw=storage.getItem(key);if(!raw)return null;try{return parseProject(raw);}catch{return null;}}
export function exportProject(project){return new Blob([serializeProject(project)],{type:"application/json"});}