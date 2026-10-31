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
  cian: '\x1b[36m', // Se corrigió c.cyan por c.cian
};

const pintar = (color, texto) => `${color}${texto}${c.reset}`;
const ok = (msg) => console.log(pintar(c.verde, `   ✔ ${msg}`));
const aviso = (msg) => console.log(pintar(c.amarillo, `   ⚠ ${msg}`));
const error = (msg) => console.log(pintar(c.rojo, `   ✖ ${msg}`));

// Carga inicial de datos de prueba
function cargarDatosIniciales(lista) {
  lista.limpiarHistorial();
  lista.insertar({ id: 101, accion: 'Inicio - Terminal Reina del Cisne' });
  lista.insertar({ id: 102, accion: 'Buscar ruta Loja → Cuenca' });
  lista.insertar({ id: 103, accion: 'Ver horarios Loja → Catamayo' });
  lista.insertar({ id: 104, accion: 'Comparar conexiones Loja → Zamora' });
}

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
    console.log('   (vacío)');
    return;
  }
  lista.recorrer((vista, esActual, posicion) => {
    const linea = `${posicion}. [${vista.id}] ${vista.accion}`;
    console.log(esActual ? pintar(c.verde, `   ▶ ${linea}   ◀ aquí estás`) : `     ${linea}`);
  });
}

function mostrarListaInversa(lista) {
  console.log(pintar(c.negrita, '\nHistorial de navegación (orden inverso)'));
  if (lista.longitud === 0) {
    console.log('   (vacío)');
    return;
  }
  lista.recorrerInverso((vista, esActual, posicion) => {
    const linea = `${posicion}. [${vista.id}] ${vista.accion}`;
    console.log(esActual ? pintar(c.verde, `   ▶ ${linea}   ◀ aquí estás`) : `     ${linea}`);
  });
}

function demostracionNuevas(historial) {
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

function demostracion(historial) {
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

function modoInteractivo(historial) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let siguienteId = 101;
  historial.recorrer((vista) => {
    siguienteId = Math.max(siguienteId, vista.id + 1);
  });

  let pendiente = null;

  const menu = [
    '\n=== Navegador interactivo ===',
    ' a -> avanzar                          r -> retroceder',
    ' e -> eliminar la vista actual         v -> ver la vista actual',
    ' i -> ir al inicio                     f -> ir al final',
    ' l -> listar todo el historial         o -> listar en orden inverso',
    ' n -> agregar nueva vista al final     m -> insertar después de la actual',
    ' g -> ir a posición concreta           b -> buscar por texto',
    ' x -> vaciar el historial              s -> salir',
  ].join('\n');

  console.log(menu);
  mostrarActual(historial);
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', (linea) => {
    const input = linea.trim();

    if (pendiente) {
      const tipo = pendiente;
      pendiente = null;

      if (tipo === 'posicion') {
        const num = Number(input);
        if (isNaN(num) || input === '') {
          error('Por favor ingresa un número válido.');
        } else {
          const resultado = historial.irAPosicion(num);
          if (resultado === null) {
            error(`Posición inválida (usa un número entre 1 y ${historial.longitud}).`);
          } else {
            mostrarActual(historial);
          }
        }
      } else if (tipo === 'buscar') {
        if (!input) {
          aviso('Búsqueda cancelada (texto vacío).');
        } else {
          const encontrados = historial.buscarPorAccion(input);
          if (encontrados.length === 0) {
            aviso('Sin coincidencias.');
          } else {
            console.log(pintar(c.negrita, '\nCoincidencias encontradas:'));
            encontrados.forEach(({ posicion, dato }) =>
              console.log(`  ${posicion}. [${dato.id}] ${dato.accion}`)
            );
          }
        }
      } else if (tipo === 'insertarDespues') {
        if (input) {
          historial.insertarDespuesDelActual({ id: siguienteId++, accion: input });
          ok(`Vista insertada después de la actual (total: ${historial.longitud}).`);
        } else {
          error('El nombre no puede estar vacío.');
        }
      } else if (tipo === 'agregarFinal') {
        if (input) {
          historial.insertar({ id: siguienteId++, accion: input });
          ok(`Vista agregada al final (total: ${historial.longitud}).`);
        } else {
          error('El nombre no puede estar vacío.');
        }
      } else if (tipo === 'confirmarLimpiar') {
        if (input.toLowerCase() === 's') {
          historial.limpiarHistorial();
          ok('Historial vaciado por completo.');
          mostrarActual(historial);
        } else {
          aviso('Operación cancelada.');
        }
      }

      rl.setPrompt('> ');
      rl.prompt();
      return;
    }

    switch (input.toLowerCase()) {
      case 'a':
        if (historial.avanzar() === null) aviso('Ya estás en la última vista.');
        mostrarActual(historial);
        break;
      case 'r':
        if (historial.retroceder() === null) aviso('Ya estás en la primera vista.');
        mostrarActual(historial);
        break;
      case 'e':
        if (historial.eliminarActual()) {
          ok('Vista eliminada.');
        } else {
          aviso('No hay nada que eliminar.');
        }
        mostrarActual(historial);
        break;
      case 'n':
        pendiente = 'agregarFinal';
        rl.setPrompt('Nombre de la nueva vista: ');
        rl.prompt();
        return;
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
        if (historial.longitud === 0) {
          aviso('La lista está vacía.');
          break;
        }
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
        if (historial.longitud === 0) {
          aviso('La lista está vacía, usa "n" para agregar al inicio.');
          break;
        }
        pendiente = 'insertarDespues';
        rl.setPrompt('Nombre de la vista: ');
        rl.prompt();
        return;
      case 'o':
        mostrarListaInversa(historial);
        break;
      case 'x':
        if (historial.longitud === 0) {
          aviso('El historial ya está vacío.');
          break;
        }
        pendiente = 'confirmarLimpiar';
        rl.setPrompt('¿Estás seguro de vaciar todo el historial? (s/n): ');
        rl.prompt();
        return;
      case 's':
        rl.close();
        return;
      default:
        error('Opción no válida. Escribe una opción del menú.');
    }
    rl.prompt();
  });

  rl.on('close', () => console.log('\nHasta luego.'));
}

if (require.main === module) {
  const historial = new ListaDobleNavegacion();
  cargarDatosIniciales(historial);

  if (process.argv.includes('--interactivo')) {
    modoInteractivo(historial);
  } else {
    demostracion(historial);
    cargarDatosIniciales(historial); // Recargar datos limpios antes de la siguiente demo
    demostracionNuevas(historial);
  }
}