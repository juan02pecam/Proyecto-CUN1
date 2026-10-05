import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateInventorySummary, validateUnit } from './inventory.js';
test('rejects invalid blood unit values', () => assert.deepEqual(validateUnit({ code: '', bloodGroup: 'X', component: 'x' }), ['code', 'bloodGroup', 'component', 'expiresAt']));
test('excludes expired and inactive units from available inventory', () => { const units = [{ id: '1', code: 'A', bloodGroup: 'O+', component: 'Plasma', volume: 1, status: 'available', location: 'A', expiresAt: '2099-01-01' }, { id: '2', code: 'B', bloodGroup: 'O-', component: 'Plasma', volume: 1, status: 'expired', location: 'A', expiresAt: '2099-01-01' }]; assert.equal(calculateInventorySummary(units).total, 1); });
