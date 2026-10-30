const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ListaDobleNavegacion = require('../src/models/ListaDobleNavegacion');

describe('Pruebas adicionales - Saltos directos y recorrido (Avance 4 ABP)', () => {
  let lista;

  beforeEach(() => {
    lista = new ListaDobleNavegacion();
    lista.insertar({ id: 101, accion: 'Cargar Vista A' });
    lista.insertar({ id: 102, accion: 'Filtrar Datos B' });
    lista.insertar({ id: 103, accion: 'Exportar Reporte C' });
  });

  test('6. irAlFinal: El cursor salta directamente al último nodo', () => {
    assert.equal(lista.irAlFinal().id, 103);
    assert.equal(lista.obtenerActual().id, 103);
    assert.equal(lista.avanzar(), null); // Ya está en el límite superior
  });

  test('7. irAlInicio: El cursor regresa directamente al primer nodo', () => {
    lista.irAlFinal();
    assert.equal(lista.irAlInicio().id, 101);
    assert.equal(lista.retroceder(), null); // Ya está en el límite inferior
  });

  test('8. Saltos directos: Manejo seguro sobre estructuras vacías', () => {
    const listaVacia = new ListaDobleNavegacion();
    assert.equal(listaVacia.irAlInicio(), null);
    assert.equal(listaVacia.irAlFinal(), null);
  });
});