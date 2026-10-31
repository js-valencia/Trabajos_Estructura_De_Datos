const { ListaDoblementeEnlazada } = require('./ListaDoble');

/**
 * Pila (Stack) orientada a Sostenibilidad Computacional y Programación Funcional.
 * Operaciones fundamentales Push y Pop en O(1) estricto de forma inmutable.
 */
const PilaTransaccional = {
  /**
   * Crea un estado inicial de la pila.
   */
  crear: () => Object.freeze({
    lista: ListaDoblementeEnlazada.crear()
  }),

  /**
   * Apila un comando de telemetría en el tope.
   * Complejidad Temporal: O(1)
   * @returns {Object} Nuevo estado de la pila
   */
  push: (estadoPila, comando) => Object.freeze({
    lista: ListaDoblementeEnlazada.insertarFinal(estadoPila.lista, comando)
  }),

  /**
   * Desapila el comando en el tope (Undo).
   * Complejidad Temporal: O(1)
   * @returns {{ estado: Object, datos: any }} Nuevo estado y el dato desapilado
   */
  pop: (estadoPila) => {
    const { estado: nuevaLista, datos } = ListaDoblementeEnlazada.eliminarFinal(estadoPila.lista);
    return {
      estado: Object.freeze({ lista: nuevaLista }),
      datos
    };
  },

  /**
   * Retorna la cantidad de elementos almacenados.
   */
  obtenerTamano: (estadoPila) => estadoPila.lista.longitud
};

// Exportación compatible
module.exports = PilaTransaccional;
module.exports.PilaTransaccional = PilaTransaccional;