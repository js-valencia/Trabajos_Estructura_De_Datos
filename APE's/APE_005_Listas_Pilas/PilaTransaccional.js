const { ListaDoblementeEnlazada } = require('./ListaDoble');

/**
 * Pila (Stack) orientada a Sostenibilidad Computacional.
 * Operaciones fundamentales Push y Pop en O(1) estricto.
 */
class PilaTransaccional {
 constructor() {
 this.lista = new ListaDoblementeEnlazada();
 }

 /**
 * Apila un comando de telemetría en el tope.
 * Complejidad Temporal: O(1)
 */
 push(comando) {
 this.lista.insertarFinal(comando);
 }

 /**
 * Desapila y retorna el comando en el tope (Undo).
 * Complejidad Temporal: O(1)
 */
 pop() {
 return this.lista.eliminarFinal();
 }

 /**
 * Retorna la cantidad de elementos almacenados.
 */
 obtenerTamano() {
 return this.lista.longitud;
 }
}

module.exports = PilaTransaccional;
