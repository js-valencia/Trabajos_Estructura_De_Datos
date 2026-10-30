const readline = require('node:readline');
const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');


// Colores ANSI para la consola (sin librerías externas)
const c = {
  reset: '\x1b[0m',
  negrita: '\x1b[1m',
  tenue: '\x1b[2m',
  verde: '\x1b[32m',
  rojo: '\x1b[31m',
  amarillo: '\x1b[33m',
  cian: '\x1b[36m',
};
const pintar = (color, texto) => `${color}${texto}${c.reset}`;
const ok = (msg) => console.log(pintar(c.verde, `  ✔ ${msg}`));
const aviso = (msg) => console.log(pintar(c.amarillo, `  ⚠ ${msg}`));
const error = (msg) => console.log(pintar(c.rojo, `  ✖ ${msg}`));
 
// Historial de navegación del proyecto ABP
const historial = new ListaDobleNavegacion();
 
historial.insertar({ id: 101, accion: 'Cargar Vista A' });
historial.insertar({ id: 102, accion: 'Filtrar Datos B' });
historial.insertar({ id: 103, accion: 'Exportar Reporte C' });

function mostrarActual(lista) {
  const actual = lista.obtenerActual();
  console.log(
    actual
      ? `${pintar(c.cian, 'Vista actual:')} [${actual.id}] ${pintar(c.negrita, actual.accion)} ` +
        pintar(c.tenue, `(total: ${lista.longitud})`)
      : pintar(c.amarillo, 'La lista está vacía.')
  );
}

function mostrarLista(lista) {
  console.log(pintar(c.negrita, '\nHistorial de navegación'));
  if (lista.longitud === 0) {
    console.log('  (vacío)');
    return;
  }
  lista.recorrer((vista, esActual, posicion) => {
    const linea = `${posicion}. [${vista.id}] ${vista.accion}`;
    console.log(esActual ? pintar(c.verde, `  ▶ ${linea}   ◀ aquí estás`) : `    ${linea}`);
  });
}

function demostracion() {
  console.log('=== Demostración de navegación bidireccional ===\n');
  mostrarActual(historial);
 
  console.log('\n--- Avanzar ---');
  console.log(historial.avanzar());
  console.log(historial.avanzar());
  console.log('Al final de la lista:', historial.avanzar());
 
  console.log('\n--- Retroceder ---');
  console.log(historial.retroceder());
  console.log(historial.retroceder());
  console.log('Al inicio de la lista:', historial.retroceder());
 
  console.log('\n--- Eliminar el elemento actual ---');
  historial.avanzar(); // cursor en 102
  console.log('Eliminando:', historial.obtenerActual());
  console.log('Eliminado:', historial.eliminarActual());
  mostrarActual(historial);
}

function modoInteractivo() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let siguienteId = 200;
  let esperandoNombre = false; // true cuando se está pidiendo el nombre de una vista nueva
 
  const menu = [
    '\n=== Navegador interactivo ===',
    ' a -> avanzar',
    ' r -> retroceder',
    ' e -> eliminar la vista actual',
    ' n -> agregar una nueva vista al final',
    ' v -> ver la vista actual',
    ' i -> ir al inicio',
    ' f -> ir al final',
    ' l -> listar todo el historial',
    ' s -> salir',
  ].join('\n');
 
  console.log(menu);
  mostrarActual(historial);
  rl.setPrompt('> ');
  rl.prompt();
 
  rl.on('line', (linea) => {
        if (esperandoNombre) {
      esperandoNombre = false;
      const nombre = linea.trim();
      if (nombre) {
        historial.insertar({ id: siguienteId, accion: nombre });
        siguienteId++;
        ok(`Vista agregada al final (total: ${historial.longitud}).`);
      } else {
        error('El nombre no puede estar vacío.');
      }
      rl.setPrompt('> ');
      rl.prompt();
      return;
    }
    switch (linea.trim().toLowerCase()) {
      case 'a':
        if (historial.avanzar() === null) console.log('Ya estás en la última vista.');
        mostrarActual(historial);
        break;
      case 'r':
        if (historial.retroceder() === null) console.log('Ya estás en la primera vista.');
        mostrarActual(historial);
        break;
      case 'e':
        console.log(historial.eliminarActual() ? 'Vista eliminada.' : 'No hay nada que eliminar.');
        mostrarActual(historial);
        break;
      case 'n':
        console.log('Escribe el nombre de la nueva vista:');
        esperandoNombre = true;
        rl.setPrompt('nombre> ');
        break;
      case 'v':
        mostrarActual(historial);
        break;
      case 'i':
        if (historial.irAlInicio() === null) aviso('No hay vistas todavía.');
        mostrarActual(historial);
        break;
      case 'f':
        if (historial.irAlFinal() === null) aviso('No hay vistas todavía.');
        mostrarActual(historial);
        break;
      case 'l':
        mostrarLista(historial);
        break;
      case 's':
        rl.close();
        return;
      default:
        console.log('Opción no válida.');
    }
    rl.prompt();
  });
 
  rl.on('close', () => console.log('\nHasta luego.'));
}
 
if (process.argv.includes('--interactivo')) {
  modoInteractivo();
} else {
  demostracion();
}
 
module.exports = historial;