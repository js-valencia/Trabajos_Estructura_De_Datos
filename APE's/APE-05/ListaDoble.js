/**
 * Representa un Nodo en una Lista Doblemente Enlazada.
 */
class NodoDoble {
  constructor(datos) {
    this.datos = datos; // Carga útil de telemetría satelital
    this.next = null;   // Referencia al siguiente nodo
    this.prev = null;   // Referencia al nodo anterior
  }
}

/**
 * Estructura de Datos Dinámica Doblemente Enlazada.
 */
class ListaDoblementeEnlazada {
  constructor() {
    this.head = null;
    this.tail = null;
    this.longitud = 0;
  }

  /**
   * Inserta un nuevo elemento al final de la lista.
   * Complejidad Temporal: O(1)
   */
  insertarFinal(datos) {
    const nuevoNodo = new NodoDoble(datos);
    if (!this.head) {
      this.head = nuevoNodo;
      this.tail = nuevoNodo;
    } else {
      this.tail.next = nuevoNodo;
      nuevoNodo.prev = this.tail;
      this.tail = nuevoNodo;
    }
    this.longitud++;
    return nuevoNodo;
  }

  /**
   * Elimina el último elemento de la lista.
   * Complejidad Temporal: O(1)
   */
  eliminarFinal() {
    if (!this.tail) return null;
    const nodoEliminado = this.tail;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }
    nodoEliminado.prev = null;
    this.longitud--;
    return nodoEliminado.datos;
  }
}

module.exports = { NodoDoble, ListaDoblementeEnlazada };
