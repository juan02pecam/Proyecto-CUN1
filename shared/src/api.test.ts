import {test} from 'node:test';import assert from 'node:assert/strict';import {createApiClient} from './api.js';
test('uses a configurable device-friendly base URL',()=>{const client=createApiClient('http://192.168.1.20:4000');assert.equal(typeof client.getSummary,'function');});
