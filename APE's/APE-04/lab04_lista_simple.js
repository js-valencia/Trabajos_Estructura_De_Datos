// Tarea 1: Implementación del TDA Lista Enlazada

class Nodo {
    constructor(dato) {
        this.dato = dato; // Carga útil (la coordenada)
        this.siguiente = null; // Puntero al siguiente nodo (referencia)
    }
}

class ListaSatelital {
    constructor() {
        this.cabeza = null; // Primer elemento de la lista
        this.tamaño = 0; // Contador para S(n)
    }
    
    // Método para insertar al inicio: Complejidad O(1)
    prepend(dato) {
        const nuevoNodo = new Nodo(dato);
        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
        } else {
            nuevoNodo.siguiente = this.cabeza;
            this.cabeza = nuevoNodo;
        }
        this.tamaño++;
    }


}

module.exports = { ListaSatelital };