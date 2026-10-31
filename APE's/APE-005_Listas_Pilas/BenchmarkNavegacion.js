const PilaTransaccional = require('./PilaTransaccional');

// 1. Funciones de utilidad
const bytesAMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);
const obtenerHeapUsed = () => process.memoryUsage().heapUsed;
const forEachN = (n, fn) => { for (let i = 0; i < n; i++) fn(i); };

// 2. Ejecutor de benchmark de orden superior
const medirRendimiento = (etiqueta, fnInsertar, fnEliminar, n) => {
  if (global.gc) global.gc();

  const memInicial = obtenerHeapUsed();

  console.time(etiqueta);
  const estructura = fnInsertar(n);
  const memPico = obtenerHeapUsed();

  fnEliminar(estructura, n);
  console.timeEnd(etiqueta);

  const memFinal = obtenerHeapUsed();

  return {
    picoMB: bytesAMB(memPico - memInicial),
    deltaMB: bytesAMB(memFinal - memInicial)
  };
};

// 3. Estrategias de prueba
const estrategias = [
  {
    nombre: 'Tiempo Array Nativo (unshift/shift)',
    insertar: (n) => {
      const arr = [];
      forEachN(n, (i) => arr.unshift({ id: i, log: 'Evento Satelital' }));
      return arr;
    },
    eliminar: (arr, n) => forEachN(n, () => arr.shift()),
    imprimirResultados: (picoMB, deltaMB) => {
      console.log(`Heap con datos cargados (Array): ${picoMB} MB`);
      console.log(`Impacto de Memoria Heap Array: ${deltaMB} MB\n`);
    }
  },
  {
    nombre: 'Tiempo Pila Transaccional O(1)',
    insertar: (n) => {
      const pila = new PilaTransaccional();
      forEachN(n, (i) => pila.push({ id: i, log: 'Evento Satelital' }));
      return pila;
    },
    eliminar: (pila, n) => forEachN(n, () => pila.pop()),
    imprimirResultados: (picoMB, deltaMB) => {
      console.log(`Heap con datos cargados (Pila): ${picoMB} MB`);
      console.log(`Impacto de Memoria Heap Pila: ${deltaMB} MB\n`);
    }
  },
  {
    nombre: 'Tiempo Array Nativo (push/pop)',
    insertar: (n) => {
      const arr = [];
      forEachN(n, (i) => arr.push({ id: i, log: 'Evento Satelital' }));
      return arr;
    },
    eliminar: (arr, n) => forEachN(n, () => arr.pop()),
    imprimirResultados: (picoMB) => {
      console.log(`Heap con datos cargados (Array push/pop): ${picoMB} MB\n`);
    }
  }
];

// 4. Orquestación principal
const N = Number(process.argv[2]) || 500000;

console.log(`=== BENCHMARK DE RENDIMIENTO (N = ${N}) ===\n`);

estrategias.forEach(({ nombre, insertar, eliminar, imprimirResultados }) => {
  const { picoMB, deltaMB } = medirRendimiento(nombre, insertar, eliminar, N);
  imprimirResultados(picoMB, deltaMB);
});