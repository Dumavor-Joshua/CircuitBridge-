import test from "node:test";import assert from "node:assert/strict";import {validateWire,addWire} from "../src/core/connections.js";
const p={components:[{id:"r",pins:[{id:"r-a"},{id:"r-b"}]},{id:"v",pins:[{id:"v-p"},{id:"v-n"}]}],wires:[]};
test("accepts valid pin endpoints",()=>assert.equal(validateWire(p,{id:"w",fromPinId:"r-a",toPinId:"v-p"}).valid,true));
test("rejects missing pins and self connections",()=>{assert.equal(validateWire(p,{id:"w",fromPinId:"missing",toPinId:"v-p"}).valid,false);assert.equal(validateWire(p,{id:"w2",fromPinId:"r-a",toPinId:"r-a"}).valid,false);});
test("rejects duplicate wire IDs",()=>{addWire(p,{id:"w3",fromPinId:"r-a",toPinId:"v-p"});assert.throws(()=>addWire(p,{id:"w3",fromPinId:"r-b",toPinId:"v-n"}),/Duplicate/);});