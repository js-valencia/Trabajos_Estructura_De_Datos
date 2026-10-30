const readline = require('node:readline');
const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');
 
// Historial de navegación del proyecto ABP
const historial = new ListaDobleNavegacion();
 
historial.insertar({ id: 101, accion: 'Cargar Vista A' });
historial.insertar({ id: 102, accion: 'Filtrar Datos B' });
historial.insertar({ id: 103, accion: 'Exportar Reporte C' });

function mostrarActual(lista) {
  const actual = lista.obtenerActual();
  console.log(
    actual
      ? `Vista actual: [${actual.id}] ${actual.accion} (total: ${lista.longitud})`
      : 'La lista está vacía.'
  );
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
 
  const menu = [
    '\n=== Navegador interactivo ===',
    ' a -> avanzar',
    ' r -> retroceder',
    ' e -> eliminar la vista actual',
    ' n -> agregar una nueva vista al final',
    ' v -> ver la vista actual',
    ' s -> salir',
  ].join('\n');
 
  console.log(menu);
  mostrarActual(historial);
  rl.setPrompt('> ');
  rl.prompt();
 
  rl.on('line', (linea) => {
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
        historial.insertar({ id: siguienteId, accion: `Vista nueva ${siguienteId}` });
        siguienteId++;
        console.log('Vista agregada al final.');
        mostrarActual(historial);
        break;
      case 'v':
        mostrarActual(historial);
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