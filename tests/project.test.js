import test from "node:test";import assert from "node:assert/strict";import {createProject,parseProject,serializeProject,isProjectDocument} from "../src/core/project.js";
test("creates a valid empty project",()=>{const p=createProject({name:"Test",id:"p1"});assert.equal(p.name,"Test");assert.deepEqual(p.components,[]);assert.equal(isProjectDocument(p),true);});
test("round trips JSON",()=>{const p=createProject({id:"p2"});assert.deepEqual(parseProject(serializeProject(p)),p);});
test("rejects invalid document",()=>assert.throws(()=>serializeProject({}),/Invalid/));