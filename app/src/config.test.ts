import {test} from 'node:test';import assert from 'node:assert/strict';import {getApiBaseUrl} from './config.js';
test('uses localhost API by default for web development',()=>assert.equal(getApiBaseUrl(),'http://localhost:4000'));
