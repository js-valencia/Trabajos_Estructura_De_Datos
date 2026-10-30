const NodoDoble = require('./NodoDoble');

/**
 * Estructura de datos dinámica para la gestión de navegación bidireccional.
 * Desarrollado y optimizado colaborativamente - Grupo 07
 */
class ListaDobleNavegacion {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.actual = null; // Puntero/Cursor de navegación activa
        this.longitud = 0;
    }

    /**
    * Inserta un nuevo registro al final de la lista. Complejidad: O(1)
    * @param {Object} dato - Registro a almacenar.
    * @returns {NodoDoble} El nodo creado.
    */
    insertar(dato) {
        const nuevoNodo = new NodoDoble(dato);

        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
            this.cola = nuevoNodo;
            this.actual = nuevoNodo;
        } else {
            this.cola.siguiente = nuevoNodo;
            nuevoNodo.anterior = this.cola;
            this.cola = nuevoNodo;
        }

        this.longitud++;
        return nuevoNodo;
    }

    /**
    * Desplaza el cursor activo hacia el siguiente nodo. Complejidad: O(1)
    * @returns {Object|null} El dato del nuevo nodo activo o null si alcanza el final.
    */
    avanzar() {
        // Aporte Técnico Grupo 07: Complejidad O(1). La transición es directa usando el puntero 'siguiente'
        if (this.actual && this.actual.siguiente) {
            this.actual = this.actual.siguiente;
            return this.actual.dato;
        }
        return null;
    }

    /**
    * Desplaza el cursor activo hacia el nodo anterior. Complejidad: O(1)
    * @returns {Object|null} El dato del nuevo nodo activo o null si alcanza el inicio.
    */
    retroceder() {
        // Aporte Técnico Grupo 07: Complejidad O(1). Navegación reversa inmediata gracias al puntero 'anterior'
        if (this.actual && this.actual.anterior) {
            this.actual = this.actual.anterior;
            return this.actual.dato;
        }
        return null;
    }

    /**
    * Retorna el elemento actualmente seleccionado por el cursor.
    * @returns {Object|null}
    */
    obtenerActual() {
        return this.actual ? this.actual.dato : null;
    } 

    /**
    * Elimina el elemento en la posición actual y reconecta los enlaces.
    * Libera las referencias internas para apoyar la gestión de memoria. Complejidad: O(1)
    * @returns {boolean} Confirmación de eliminación.
    */
    eliminarActual() {
        if (!this.actual) return false;

        const nodoAEliminar = this.actual;

        // Reconexión del enlace anterior
        if (nodoAEliminar.anterior) {
            nodoAEliminar.anterior.siguiente = nodoAEliminar.siguiente;
        } else {
            this.cabeza = nodoAEliminar.siguiente;
        }

        // Reconexión del enlace siguiente
        if (nodoAEliminar.siguiente) {
            nodoAEliminar.siguiente.anterior = nodoAEliminar.anterior;
            this.actual = nodoAEliminar.siguiente;
        } else {
            this.cola = nodoAEliminar.anterior;
            this.actual = nodoAEliminar.anterior;
        }

        // Aporte Técnico Grupo 07: Garbage Collection Helper exhaustivo.
        // Se desvincula también el dato interno para asegurar la liberación en el Memory Heap.
        nodoAEliminar.siguiente = null;
        nodoAEliminar.anterior = null;
        nodoAEliminar.dato = null; 

        this.longitud--;
        return true;
    }

    /**
    * Mueve el cursor al primer nodo usando el puntero cabeza. Complejidad: O(1)
    * @returns {Object|null} El dato del primer nodo o null si la lista está vacía.
    */
    irAlInicio() {
        if (!this.cabeza) return null;
        this.actual = this.cabeza;
        return this.actual.dato;
    }

    /**
     * Mueve el cursor al último nodo usando el puntero cola. Complejidad: O(1)
     * @returns {Object|null} El dato del último nodo o null si la lista está vacía.
     */
    irAlFinal() {
        if (!this.cola) return null;
        this.actual = this.cola;
        return this.actual.dato;
    }

    /**
     * Recorre la lista de cabeza a cola sin modificarla ni imprimir nada. Complejidad: O(n)
     * @param {function(Object, boolean, number): void} callback Recibe (dato, esActual, posicion).
     */
    recorrer(callback) {
        let nodo = this.cabeza;
        let posicion = 1;
        while (nodo) {
            callback(nodo.dato, nodo === this.actual, posicion);
            nodo = nodo.siguiente;
            posicion++;
        }
    }

    /**
     * Mueve el cursor a una posición específica basándose en el índice. Optimización bidireccional.
     */
    irAPosicion(posicion) {
        if (!Number.isInteger(posicion) || posicion < 1 || posicion > this.longitud) return null;

        let nodo;
        if (posicion <= this.longitud / 2) {
            nodo = this.cabeza;
            for (let i = 1; i < posicion; i++) nodo = nodo.siguiente;
        } else {
            nodo = this.cola;
            for (let i = this.longitud; i > posicion; i--) nodo = nodo.anterior;
        }

        this.actual = nodo;
        return nodo.dato;
    }

    /**
     * Filtra y busca elementos que contengan una cadena de texto en su propiedad acción.
     */
    buscarPorAccion(texto) {
        const resultados = [];
        const termino = String(texto ?? '').trim().toLowerCase();
        if (!termino) return resultados;

        this.recorrer((dato, esActual, posicion) => {
            if (dato && String(dato.accion).toLowerCase().includes(termino)) {
                resultados.push({ posicion, dato });
            }
        });
        return resultados;
    }

    /**
     * Inserta un elemento inmediatamente posterior a la posición actual del cursor.
     */
    insertarDespuesDelActual(dato) {
        if (!this.actual) return this.insertar(dato);

        const nuevoNodo = new NodoDoble(dato);
        const siguiente = this.actual.siguiente;

        nuevoNodo.anterior = this.actual;
        nuevoNodo.siguiente = siguiente;
        this.actual.siguiente = nuevoNodo;

        if (siguiente) {
            siguiente.anterior = nuevoNodo;
        } else {
            this.cola = nuevoNodo;
        }

        this.longitud++;
        return nuevoNodo;
    }

    /**
     * Recorre la lista de cola a cabeza de forma inversa.
     */
    recorrerInverso(callback) {
        let nodo = this.cola;
        let posicion = this.longitud;
        while (nodo) {
            callback(nodo.dato, nodo === this.actual, posicion);
            nodo = nodo.anterior;
            posicion--;
        }
    }

    // Nuevas Funcionalidades (Grupo 07)
    // ======================================================================

    /**
     * Vacía por completo la estructura liberando de manera iterativa todos los nodos.
     */
    limpiarHistorial() {
        let actual = this.cabeza;
        while (actual) {
            let siguiente = actual.siguiente;
            actual.siguiente = null;
            actual.anterior = null;
            actual.dato = null; // Rompe referencias explícitamente para el Garbage Collector
            actual = siguiente;
        }
        this.cabeza = null;
        this.cola = null;
        this.actual = null;
        this.longitud = 0;
    }
} 

module.exports = ListaDobleNavegacion;
