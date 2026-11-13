/**
 * Nodo que almacena una variación (delta) de una transacción.
 * Cada nodo conserva la información necesaria para revertir un cambio.
 */
class NodoDelta {
  constructor(indice, estadoAnterior, estadoNuevo, loteId, tipo = "posicion", registro = null) {
    this.indice = indice;
    this.estadoAnterior = estadoAnterior;
    this.estadoNuevo = estadoNuevo;
    this.loteId = loteId;
    this.tipo = tipo;
    this.registro = registro;
    this.siguiente = null;
  }
}

/**
 * Pila enlazada LIFO para registrar deltas.
 * push() y pop() realizan un número constante de operaciones.
 */
class PilaTransaccional {
  constructor() {
    this.tope = null;
    this.tamano = 0;
  }

  push(indice, estadoAnterior, estadoNuevo, loteId, tipo = "posicion", registro = null) {
    const nuevoNodo = new NodoDelta(
      indice, estadoAnterior, estadoNuevo, loteId, tipo, registro
    );
    nuevoNodo.siguiente = this.tope;
    this.tope = nuevoNodo;
    this.tamano++;
  }

  pop() {
    if (this.estaVacia()) return null;

    const extraido = this.tope;
    this.tope = extraido.siguiente;
    extraido.siguiente = null;
    this.tamano--;
    return extraido;
  }

  peek() {
    return this.tope;
  }

  estaVacia() {
    return this.tope === null;
  }

  obtenerTamano() {
    return this.tamano;
  }
}

module.exports = { NodoDelta, PilaTransaccional };
