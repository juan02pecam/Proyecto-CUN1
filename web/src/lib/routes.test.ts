import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routeFor} from './routes.js';

test('maps every dashboard action to its destination route', () => {
  assert.deepEqual(routeFor('Resumen'), '/');
  assert.deepEqual(routeFor('Inventario'), '/inventario');
  assert.deepEqual(routeFor('Solicitudes'), '/solicitudes');
  assert.deepEqual(routeFor('Donantes'), '/donantes');
  assert.deepEqual(routeFor('Registrar unidad'), '/inventario/nueva');
  assert.deepEqual(routeFor('Ver inventario'), '/inventario');
  assert.deepEqual(routeFor('Ver todas'), '/solicitudes');
});
