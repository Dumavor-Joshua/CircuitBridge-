const SCHEMA_VERSION=1;
export function createId(prefix="id"){return `${prefix}_${globalThis.crypto?.randomUUID?.()??`${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`}`;}
export function createProject({name="Untitled circuit",id=createId("project")}={}){return {schemaVersion:SCHEMA_VERSION,id,name:String(name).trim()||"Untitled circuit",components:[],wires:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};}
export function isProjectDocument(v){return Boolean(v&&typeof v==="object"&&v.schemaVersion===SCHEMA_VERSION&&typeof v.id==="string"&&typeof v.name==="string"&&Array.isArray(v.components)&&Array.isArray(v.wires));}
export function serializeProject(p){if(!isProjectDocument(p))throw new TypeError("Invalid CircuitBridge project document.");return JSON.stringify(p,null,2);}
export function parseProject(s){const p=JSON.parse(s);if(!isProjectDocument(p))throw new TypeError("Unsupported or invalid project file.");return p;}
export {SCHEMA_VERSION};