/**
 * Representa una unidad atómica de cambio (Delta) dentro de la Pila Transaccional.
 * Almacena únicamente la variación de estado para evitar clonaciones de O(N).
 */
class NodoDelta {
    constructor(indice, estadoAnterior, estadoNuevo, loteId) {
        this.indice = indice;                 // Posición afectada en la estructura ordenada
        this.estadoAnterior = estadoAnterior; // Valor previo para restauración O(1)
        this.estadoNuevo = estadoNuevo;       // Valor aplicado en la transacción
        this.loteId = loteId;                 // Identificador de transacción (Backtracking)
        this.siguiente = null;                // Puntero al nodo inferior en la pila
    }
}

    /**
     * Pila LIFO (Last-In, First-Out) orientada a Sostenibilidad Computacional.
     * Permite revertir mutaciones sin re-procesar conjuntos de datos masivos.
     */
class PilaTransaccional {
    constructor() {
        this.tope = null;
        this.tamano = 0;
    }

    /**
     * Apila un registro delta en el tope de la pila.
     * Complejidad Temporal: O(1) | Complejidad Espacial: O(1)
     */
    push(indice, estadoAnterior, estadoNuevo, loteId) {
        const nuevoNodo = new NodoDelta(indice, estadoAnterior, estadoNuevo, loteId);
        nuevoNodo.siguiente = this.tope;
        this.tope = nuevoNodo;
        this.tamano++;
    }

    /**
     * Extrae y retorna el último delta registrado para su reversión inmediata.
     * Complejidad Temporal: O(1)
     */
    pop() {
        if (this.estaVacia()) return null;
        const nodoExtraido = this.tope;
        this.tope = this.tope.siguiente;
        nodoExtraido.siguiente = null; // Liberación explícita para el Garbage Collector
        this.tamano--;
        return nodoExtraido;
    }

    peek() {
        return this.tope;
    }

    estaVacia() {
        return this.tamano === 0;
    }
}

module.exports = { NodoDelta, PilaTransaccional };
