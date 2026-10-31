// 1. Creador de Nodos (Función Pura Inmutable)
const crearNodo = (datos, next = null, prev = null) => 
  Object.freeze({ datos, next, prev });

// 2. Fábrica del Estado de la Lista
const crearEstadoLista = (head = null, tail = null, actual = null, longitud = 0) =>
  Object.freeze({ head, tail, actual, longitud });

// 3. Operaciones Funcionales Pure (Crean un nuevo estado sin mutar el anterior)
const ListaDoblementeEnlazada = {
  crear: () => crearEstadoLista(),

  insertarFinal: (estado, datos) => {
    const nuevoNodo = crearNodo(datos, null, estado.tail);

    if (!estado.head) {
      return crearEstadoLista(nuevoNodo, nuevoNodo, estado.actual, 1);
    }

    // Vinculamos el tail anterior al nuevo nodo
    const tailActualizado = Object.freeze({ ...estado.tail, next: nuevoNodo });
    
    // Si la cabeza era el único elemento, actualizamos la referencia
    const headActualizado = estado.head === estado.tail ? tailActualizado : estado.head;

    return crearEstadoLista(
      headActualizado,
      nuevoNodo,
      estado.actual,
      estado.longitud + 1
    );
  },

  eliminarFinal: (estado) => {
    if (!estado.tail) return { estado, datos: null };

    const datosEliminados = estado.tail.datos;

    if (estado.head === estado.tail) {
      return { estado: crearEstadoLista(), datos: datosEliminados };
    }

    const nuevoTail = Object.freeze({ ...estado.tail.prev, next: null });
    const nuevoActual = estado.actual === estado.tail ? nuevoTail : estado.actual;

    const nuevoEstado = crearEstadoLista(
      estado.head,
      nuevoTail,
      nuevoActual,
      estado.longitud - 1
    );

    return { estado: nuevoEstado, datos: datosEliminados };
  },

  // ---------- Navegación Bidireccional (Pure Cursor Moves) ----------

  irAlInicio: (estado) => ({
    estado: crearEstadoLista(estado.head, estado.tail, estado.head, estado.longitud),
    datos: estado.head ? estado.head.datos : null
  }),

  irAlFinal: (estado) => ({
    estado: crearEstadoLista(estado.head, estado.tail, estado.tail, estado.longitud),
    datos: estado.tail ? estado.tail.datos : null
  }),

  next: (estado) => {
    if (!estado.actual || !estado.actual.next) {
      return { estado, datos: null };
    }
    const nuevoActual = estado.actual.next;
    return {
      estado: crearEstadoLista(estado.head, estado.tail, nuevoActual, estado.longitud),
      datos: nuevoActual.datos
    };
  },

  prev: (estado) => {
    if (!estado.actual || !estado.actual.prev) {
      return { estado, datos: null };
    }
    const nuevoActual = estado.actual.prev;
    return {
      estado: crearEstadoLista(estado.head, estado.tail, nuevoActual, estado.longitud),
      datos: nuevoActual.datos
    };
  }
};

module.exports = { crearNodo, ListaDoblementeEnlazada };