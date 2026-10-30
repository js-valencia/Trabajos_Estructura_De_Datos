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
 
historial.insertar({ id: 101, accion: 'Inicio - Terminal Reina del Cisne' });
historial.insertar({ id: 102, accion: 'Buscar ruta Loja → Cuenca' });
historial.insertar({ id: 103, accion: 'Ver horarios Loja → Catamayo' });
historial.insertar({ id: 104, accion: 'Comparar conexiones Loja → Zamora' });

function mostrarActual(lista) {
  const actual = lista.obtenerActual();
  console.log(
    actual
      ? `${pintar(c.cyan, 'Vista actual:')} [${actual.id}] ${pintar(c.negrita, actual.accion)} ` +
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

function mostrarListaInversa(lista) {
  console.log(pintar(c.negrita, '\nHistorial de navegación (orden inverso)'));
  if (lista.longitud === 0) {
    console.log('  (vacío)');
    return;
  }
  lista.recorrerInverso((vista, esActual, posicion) => {
    const linea = `${posicion}. [${vista.id}] ${vista.accion}`;
    console.log(esActual ? pintar(c.verde, `  ▶ ${linea}   ◀ aquí estás`) : `    ${linea}`);
  });
}

function demostracionNuevas() {
  console.log('\n=== Nuevas funcionalidades ===');

  console.log('\n--- Ir a una posición (irAPosicion) ---');
  console.log('Posición 1:', historial.irAPosicion(1));
  console.log('Posición 99 (inválida):', historial.irAPosicion(99));

  console.log('\n--- Buscar por acción (buscarPorAccion) ---');
  console.log(historial.buscarPorAccion('loja'));

  console.log('\n--- Insertar después del actual (insertarDespuesDelActual) ---');
  historial.insertarDespuesDelActual({ id: 200, accion: 'Ver tarifas Loja → Machala' });
  mostrarLista(historial);

  console.log('\n--- Recorrido inverso (recorrerInverso) ---');
  mostrarListaInversa(historial);

  console.log('\n--- Vaciar por completo la estructura (limpiarHistorial) ---');
  historial.limpiarHistorial();
  mostrarActual(historial);
}

function demostracion() {
  console.log('=== Demostración de navegación bidireccional ===\n');
  mostrarActual(historial);
 
  console.log('\n--- Avanzar ---');
  console.log(historial.avanzar());
  console.log(historial.avanzar());
  console.log(historial.avanzar());
  console.log('Al final de la lista:', historial.avanzar());
 
  console.log('\n--- Retroceder ---');
  console.log(historial.retroceder());
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
  let siguienteId = 101;
  historial.recorrer((vista) => {
    siguienteId = Math.max(siguienteId, vista.id + 1);
  });
  let esperandoNombre = false;
  let pendiente = null;
 
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
    ' g -> ir a una posición concreta',
    ' b -> buscar vistas por texto',
    ' m -> insertar una vista después de la actual',
    ' o -> listar el historial en orden inverso',
    ' x -> vaciar el historial completo (limpiarHistorial)', 
    ' s -> salir',
  ].join('\n');
 
  console.log(menu);
  mostrarActual(historial);
  rl.setPrompt('> ');
  rl.prompt();
 
  rl.on('line', (linea) => {
    if (pendiente) {
      const tipo = pendiente;
      pendiente = null;
      const texto = linea.trim();
      if (tipo === 'posicion') {
        const resultado = historial.irAPosicion(Number(texto));
        if (resultado === null) error(`Posición inválida (usa un número entre 1 y ${historial.longitud}).`);
        mostrarActual(historial);
      } else if (tipo === 'buscar') {
        const encontrados = historial.buscarPorAccion(texto);
        if (encontrados.length === 0) {
          aviso('Sin coincidencias.');
        } else {
          encontrados.forEach(({ posicion, dato }) => console.log(`  ${posicion}. [${dato.id}] ${dato.accion}`));
        }
      } else if (tipo === 'insertarDespues') {
        if (texto) {
          historial.insertarDespuesDelActual({ id: siguienteId, accion: texto });
          siguienteId++;
          ok(`Vista insertada después de la actual (total: ${historial.longitud}).`);
        } else {
          error('El nombre no puede estar vacío.');
        }
      }
      rl.setPrompt('> ');
      rl.prompt();
      return;
    }
    if (esperandoNombre) {
      esperandoNombre = false;
      const nombre = linea.trim();
      if (nombre) {
        historial.insertar({ id: siguienteId, accion: nombre });
        siguienteId++;
        ok(`Vista agregó al final (total: ${historial.longitud}).`);
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
        console.log('Ingresa el nombre de la nueva vista:');
        esperandoNombre = true;
        rl.setPrompt('Nombre de la vista: ');
        rl.prompt();
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
      case 'g':
        pendiente = 'posicion';
        rl.setPrompt(`Posición (1-${historial.longitud}): `);
        rl.prompt();
        return;
      case 'b':
        pendiente = 'buscar';
        rl.setPrompt('Texto a buscar: ');
        rl.prompt();
        return;
      case 'm':
        pendiente = 'insertarDespues';
        rl.setPrompt('Nombre de la vista: ');
        rl.prompt();
        return;
      case 'o':
        mostrarListaInversa(historial);
        break;
      case 'x': 
        historial.limpiarHistorial();
        ok('Historial vaciado por completo. Referencias y memoria liberadas.');
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

if (require.main === module) {
  if (process.argv.includes('--interactivo')) {
    modoInteractivo();
  } else {
    demostracion();
    demostracionNuevas();
  }
}
