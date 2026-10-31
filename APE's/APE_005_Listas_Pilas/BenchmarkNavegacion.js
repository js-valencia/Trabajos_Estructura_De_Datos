const PilaTransaccional = require('./PilaTransaccional');

function obtenerMemoriaMB() {
  return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
}

// [CAMBIO] N se puede pasar por consola: node --expose-gc BenchmarkNavegacion.js 50000
const N = Number(process.argv[2]) || 500000;

console.log(`=== BENCHMARK DE RENDIMIENTO (N = ${N}) ===\n`);

// 1. EVALUACIÓN CON ARREGLO TRADICIONAL (unshift / shift)
if (global.gc) global.gc();
const memInicialArray = process.memoryUsage().heapUsed;

console.time('Tiempo Array Nativo (unshift/shift)');
const arregloNativo = [];
for (let i = 0; i < N; i++) {
  arregloNativo.unshift({ id: i, log: 'Evento Satelital' }); // O(n)
}
const memPicoArray = process.memoryUsage().heapUsed; // [AGREGADO] heap con todos los datos cargados
for (let i = 0; i < N; i++) {
  arregloNativo.shift(); // O(n)
}
console.timeEnd('Tiempo Array Nativo (unshift/shift)');

const memFinalArray = process.memoryUsage().heapUsed;
const deltaMemArray = ((memFinalArray - memInicialArray) / 1024 / 1024).toFixed(2);
console.log(`Heap con datos cargados (Array): ${((memPicoArray - memInicialArray) / 1024 / 1024).toFixed(2)} MB`);
console.log(`Impacto de Memoria Heap Array: ${deltaMemArray} MB\n`);

// 2. EVALUACIÓN CON PILA DE PUNTEROS DINÁMICOS
if (global.gc) global.gc();
const memInicialPila = process.memoryUsage().heapUsed;

console.time('Tiempo Pila Transaccional O(1)');
const pilaSatelital = new PilaTransaccional();
for (let i = 0; i < N; i++) {
  pilaSatelital.push({ id: i, log: 'Evento Satelital' }); // O(1)
}
const memPicoPila = process.memoryUsage().heapUsed; // [AGREGADO]
for (let i = 0; i < N; i++) {
  pilaSatelital.pop(); // O(1)
}
console.timeEnd('Tiempo Pila Transaccional O(1)');

const memFinalPila = process.memoryUsage().heapUsed;
const deltaMemPila = ((memFinalPila - memInicialPila) / 1024 / 1024).toFixed(2);
console.log(`Heap con datos cargados (Pila): ${((memPicoPila - memInicialPila) / 1024 / 1024).toFixed(2)} MB`);
console.log(`Impacto de Memoria Heap Pila: ${deltaMemPila} MB\n`);

// 3. [AGREGADO] CONTROL JUSTO: Array nativo usado como pila real (push / pop al final)
if (global.gc) global.gc();
const memInicialArrayLIFO = process.memoryUsage().heapUsed;

console.time('Tiempo Array Nativo (push/pop)');
const arregloLIFO = [];
for (let i = 0; i < N; i++) {
  arregloLIFO.push({ id: i, log: 'Evento Satelital' }); // O(1) amortizado
}
const memPicoArrayLIFO = process.memoryUsage().heapUsed;
for (let i = 0; i < N; i++) {
  arregloLIFO.pop(); // O(1)
}
console.timeEnd('Tiempo Array Nativo (push/pop)');

console.log(`Heap con datos cargados (Array push/pop): ${((memPicoArrayLIFO - memInicialArrayLIFO) / 1024 / 1024).toFixed(2)} MB\n`);