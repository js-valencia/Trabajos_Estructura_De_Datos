const { mem } = require('./util');
const EventEmitter = require('events');
const emisorGlobal = new EventEmitter();
const CORREGIDO = process.argv[2] === 'corregido';
class GestorSesionUsuario {
  constructor(idUsuario) {
    this.idUsuario = idUsuario;
    this.bufferSesion = new Uint8Array(5 * 1024 * 1024);
    this.oyenteEvento = () => { this.actualizarActividad(); };
    emisorGlobal.on('pingSistema', this.oyenteEvento);
  }
  actualizarActividad() { console.log(`Sesión ${this.idUsuario} activa.`); }
  cerrarSesion() {
    if (CORREGIDO) emisorGlobal.off('pingSistema', this.oyenteEvento);
  }
}
function simularTrafico() {
  for (let i = 0; i < 50; i++) {
    let usuario = new GestorSesionUsuario(`USR_${i}`);
    usuario.cerrarSesion();
  }
}
simularTrafico();
global.gc();
console.log('Listeners registrados:', emisorGlobal.listenerCount('pingSistema'));
mem('Tras cerrar las 50 sesiones');
let lineas = 0;
const orig = console.log;
console.log = (...a) => { lineas++; };
emisorGlobal.emit('pingSistema');
console.log = orig;
console.log('Líneas impresas por emit():', lineas);
