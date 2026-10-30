const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');
 
// Historial de navegación del proyecto ABP
const historial = new ListaDobleNavegacion();
 
historial.insertar({ id: 101, accion: 'Cargar Vista A' });
historial.insertar({ id: 102, accion: 'Filtrar Datos B' });
historial.insertar({ id: 103, accion: 'Exportar Reporte C' });
 
console.log('Longitud inicial:', historial.longitud);
console.log('Vista actual:', historial.obtenerActual());
 
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
console.log('Nuevo actual:', historial.obtenerActual());
console.log('Longitud final:', historial.longitud);
 
module.exports = historial;