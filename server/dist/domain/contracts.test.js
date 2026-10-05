import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDomainEvent } from './contracts.js';
test('creates a typed domain event with identity and timestamp', () => { const e = createDomainEvent('DonorRegistered', 'd1', { name: 'Ana' }); assert.equal(e.type, 'DonorRegistered'); assert.equal(e.aggregateId, 'd1'); assert.ok(e.id); assert.ok(e.occurredAt); });
