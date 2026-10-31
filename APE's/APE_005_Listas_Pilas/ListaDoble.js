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
    this.actual = null; // [AGREGADO] cursor para la navegación bidireccional
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
    // [AGREGADO] si el cursor estaba en el nodo eliminado, lo movemos al nuevo final
    if (this.actual === nodoEliminado) this.actual = this.tail;
    nodoEliminado.prev = null;
    this.longitud--;
    return nodoEliminado.datos;
  }

  // ---------- [AGREGADO] Navegación bidireccional ----------

  /** Coloca el cursor en el primer nodo. O(1) */
  irAlInicio() {
    this.actual = this.head;
    return this.actual ? this.actual.datos : null;
  }

  /** Coloca el cursor en el último nodo. O(1) */
  irAlFinal() {
    this.actual = this.tail;
    return this.actual ? this.actual.datos : null;
  }

  /**
   * Avanza el cursor al siguiente nodo (adelante).
   * Retorna los datos del nuevo nodo o null si ya está en el final.
   * Complejidad Temporal: O(1)
   */
  next() {
    if (!this.actual || !this.actual.next) return null;
    this.actual = this.actual.next;
    return this.actual.datos;
  }

  /**
   * Retrocede el cursor al nodo anterior (atrás).
   * Retorna los datos del nuevo nodo o null si ya está en el inicio.
   * Complejidad Temporal: O(1)
   */
  prev() {
    if (!this.actual || !this.actual.prev) return null;
    this.actual = this.actual.prev;
    return this.actual.datos;
  }
}

module.exports = { NodoDoble, ListaDoblementeEnlazada };