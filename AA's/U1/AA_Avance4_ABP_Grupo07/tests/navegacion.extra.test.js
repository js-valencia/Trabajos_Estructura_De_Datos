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
    lista.insertar({ id: 104, accion: 'Cargar Vista D' });
  });

  test('6. irAlFinal: El cursor salta directamente al último nodo', () => {
    assert.equal(lista.irAlFinal().id, 104);
    assert.equal(lista.obtenerActual().id, 104);
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

  test('9. irAPosicion: salta a posiciones válidas desde ambos extremos', () => {
    assert.equal(lista.irAPosicion(2).id, 102);
    assert.equal(lista.obtenerActual().id, 102);
    assert.equal(lista.irAPosicion(4).id, 104);
    assert.equal(lista.irAPosicion(1).id, 101);
    assert.equal(lista.irAPosicion(3).id, 103);
  });

  test('10. irAPosicion: posiciones inválidas devuelven null y no mueven el cursor', () => {
    lista.irAPosicion(2);
    assert.equal(lista.irAPosicion(0), null);
    assert.equal(lista.irAPosicion(5), null);
    assert.equal(lista.irAPosicion(1.5), null);
    assert.equal(lista.irAPosicion('2'), null);
    assert.equal(lista.obtenerActual().id, 102);
    assert.equal(new ListaDobleNavegacion().irAPosicion(1), null);
  });

  test('11. buscarPorAccion: encuentra coincidencias sin mayúsculas y no mueve el cursor', () => {
    const res = lista.buscarPorAccion('cargar');
    assert.deepEqual(res.map((r) => r.posicion), [1, 4]);
    assert.equal(res[1].dato.id, 104);
    assert.equal(lista.obtenerActual().id, 101);
    assert.deepEqual(lista.buscarPorAccion('zzz'), []);
    assert.deepEqual(lista.buscarPorAccion('   '), []);
  });

  test('12. insertarDespuesDelActual: inserta en el medio con enlaces correctos', () => {
    lista.insertarDespuesDelActual({ id: 200, accion: 'Nueva' });
    assert.equal(lista.longitud, 5);
    assert.equal(lista.obtenerActual().id, 101);
    assert.equal(lista.avanzar().id, 200);
    assert.equal(lista.avanzar().id, 102);
    assert.equal(lista.retroceder().id, 200);
    assert.equal(lista.retroceder().id, 101);
  });

  test('13. insertarDespuesDelActual: actualiza la cola y funciona en lista vacía', () => {
    lista.irAlFinal();
    lista.insertarDespuesDelActual({ id: 300, accion: 'Final' });
    assert.equal(lista.cola.dato.id, 300);
    assert.equal(lista.irAlFinal().id, 300);
    assert.equal(lista.retroceder().id, 104);

    const vacia = new ListaDobleNavegacion();
    vacia.insertarDespuesDelActual({ id: 1, accion: 'Única' });
    assert.equal(vacia.longitud, 1);
    assert.equal(vacia.obtenerActual().id, 1);
  });
  
  test('14. recorrerInverso: recorre de cola a cabeza con posiciones correctas', () => {
    lista.irAPosicion(2);
    const vistos = [];
    lista.recorrerInverso((dato, esActual, pos) => vistos.push([dato.id, esActual, pos]));
    assert.deepEqual(vistos, [
      [104, false, 4],
      [103, false, 3],
      [102, true, 2],
      [101, false, 1],
    ]);
    let llamadas = 0;
    new ListaDobleNavegacion().recorrerInverso(() => llamadas++);
    assert.equal(llamadas, 0);
  });
});