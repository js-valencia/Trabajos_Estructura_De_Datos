const { PilaTransaccional } = require('./PilaTransaccional');

class GestorOrdenamientoTransaccional {
    constructor(datosIniciales) {
        // Copia ordenada inicial de N registros
        this.registros = [...datosIniciales].sort((a, b) => a.watts - b.watts);
        this.pilaUndo = new PilaTransaccional();
    }

    /**
     * Inserta o actualiza un registro manteniendo el orden mediante desplazamiento
     * incremental y registrando cada movimiento en la Pila Transaccional.
     */
    actualizarConRegistroDelta(indiceObjetivo, nuevoWatts, loteId) {
        const valorPrevio = this.registros[indiceObjetivo].watts;
        this.pilaUndo.push(indiceObjetivo, valorPrevio, nuevoWatts, loteId);
        this.registros[indiceObjetivo].watts = nuevoWatts;

        // Reubicación local (Insertion step) registrando deltas de intercambio
        let i = indiceObjetivo;
        while (i > 0 && this.registros[i - 1].watts > this.registros[i].watts) {
        const temp = this.registros[i];
        this.pilaUndo.push(i, this.registros[i].watts, this.registros[i - 1].watts, loteId);
        this.pilaUndo.push(i - 1, this.registros[i - 1].watts, temp.watts, loteId);

        this.registros[i] = this.registros[i - 1];
        this.registros[i - 1] = temp;
        i--;
        }
    }

    /**
     * Estrategia A: Backtracking/Undo por lote en O(m) sin re-ordenamiento global.
     */
    deshacerLoteTransaccional(loteId) {
        let operacionesRevertidas = 0;
        while (!this.pilaUndo.estaVacia() && this.pilaUndo.peek().loteId === loteId) {
        const delta = this.pilaUndo.pop();
        this.registros[delta.indice].watts = delta.estadoAnterior;
        operacionesRevertidas++;
        }
        return operacionesRevertidas;
    }

    /**
     * Estrategia B: Re-procesamiento completo mediante ordenamiento O(N log N).
     */
    reprocesarOrdenamientoCompleto() {
        this.registros.sort((a, b) => a.watts - b.watts);
    }
}

module.exports = GestorOrdenamientoTransaccional;