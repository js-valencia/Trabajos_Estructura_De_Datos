const { PilaTransaccional } = require("./PilaTransaccional");

class GestorOrdenamientoTransaccional {
  constructor(datosIniciales) {
    // Se crean objetos independientes para no modificar el conjunto original.
    this.registros = datosIniciales
      .map(registro => ({ ...registro }))
      .sort((a, b) => a.watts - b.watts);

    this.pilaUndo = new PilaTransaccional();
    this.indicePorId = new Map();

    this.registros.forEach((registro, indice) => {
      this.indicePorId.set(registro.id, indice);
    });
  }

  intercambiarYRegistrar(i, j, loteId) {
    const registroI = this.registros[i];
    const registroJ = this.registros[j];

    // Se registran los dos cambios antes de modificar el arreglo.
    this.pilaUndo.push(i, registroI, registroJ, loteId, "posicion");
    this.pilaUndo.push(j, registroJ, registroI, loteId, "posicion");

    this.registros[i] = registroJ;
    this.registros[j] = registroI;

    this.indicePorId.set(registroJ.id, i);
    this.indicePorId.set(registroI.id, j);
  }

  /**
   * Actualiza un registro y lo reubica para conservar el orden ascendente.
   * La pila registra tanto el valor anterior como cada desplazamiento.
   */
  actualizarConRegistroDelta(indiceObjetivo, nuevoWatts, loteId) {
    if (!Number.isInteger(indiceObjetivo) ||
        indiceObjetivo < 0 ||
        indiceObjetivo >= this.registros.length) {
      throw new RangeError("El índice objetivo está fuera del rango.");
    }

    if (loteId === undefined || loteId === null) {
      throw new Error("Cada transacción debe tener un loteId.");
    }

    const registro = this.registros[indiceObjetivo];
    const valorAnterior = registro.watts;

    this.pilaUndo.push(
      indiceObjetivo, valorAnterior, nuevoWatts, loteId, "watts", registro
    );
    registro.watts = nuevoWatts;

    let i = indiceObjetivo;

    // Si disminuye su valor, se desplaza hacia la izquierda.
    while (i > 0 && this.registros[i - 1].watts > this.registros[i].watts) {
      this.intercambiarYRegistrar(i, i - 1, loteId);
      i--;
    }

    // Si aumenta su valor, se desplaza hacia la derecha.
    while (i < this.registros.length - 1 &&
           this.registros[i].watts > this.registros[i + 1].watts) {
      this.intercambiarYRegistrar(i, i + 1, loteId);
      i++;
    }
  }

  actualizarPorId(id, nuevoWatts, loteId) {
    const indice = this.indicePorId.get(id);
    if (indice === undefined) {
      throw new Error(`No existe un registro con id ${id}.`);
    }
    this.actualizarConRegistroDelta(indice, nuevoWatts, loteId);
  }

  /**
   * Revierte exclusivamente el lote que se encuentra en el tope.
   * No permite deshacer lotes antiguos saltándose transacciones posteriores.
   */
  deshacerLoteTransaccional(loteId) {
    if (this.pilaUndo.estaVacia()) return 0;

    if (this.pilaUndo.peek().loteId !== loteId) {
      throw new Error(
        "Violación LIFO: solo se puede deshacer el lote más reciente."
      );
    }

    let operacionesRevertidas = 0;

    while (!this.pilaUndo.estaVacia() &&
           this.pilaUndo.peek().loteId === loteId) {
      const delta = this.pilaUndo.pop();

      if (delta.tipo === "watts") {
        delta.registro.watts = delta.estadoAnterior;
      } else if (delta.tipo === "posicion") {
        this.registros[delta.indice] = delta.estadoAnterior;
        this.indicePorId.set(delta.estadoAnterior.id, delta.indice);
      }

      operacionesRevertidas++;
    }

    return operacionesRevertidas;
  }

  /**
   * Estrategia de recuperación completa:
   * restaura los watts originales por identificador y vuelve a ordenar.
   */
  reprocesarOrdenamientoCompleto(wattsOriginalesPorId) {
    for (const registro of this.registros) {
      registro.watts = wattsOriginalesPorId[registro.id];
    }

    this.registros.sort((a, b) => a.watts - b.watts);
    this.registros.forEach((registro, indice) => {
      this.indicePorId.set(registro.id, indice);
    });
  }

  estaOrdenado() {
    for (let i = 1; i < this.registros.length; i++) {
      if (this.registros[i - 1].watts > this.registros[i].watts) {
        return false;
      }
    }
    return true;
  }
}

module.exports = GestorOrdenamientoTransaccional;
