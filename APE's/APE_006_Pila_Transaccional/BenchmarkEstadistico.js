const { performance } = require('perf_hooks');
const GestorOrdenamientoTransaccional = require('./GestorOrdenamientoTransaccional');

function calcularEstadisticas(muestras) {
    const k = muestras.length;
    const media = muestras.reduce((acc, val) => acc + val, 0) / k;
    const varianza = muestras.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / (k - 1);
    const desvEst = Math.sqrt(varianza);
    const cv = (desvEst / media) * 100;
    const tCritico = 2.045; // Valor t-Student para k - 1 = 29 grados de libertad (95%)
    const margenError = tCritico * (desvEst / Math.sqrt(k));

    return {
        media: media.toFixed(4),
        desvEst: desvEst.toFixed(4),
        cv: cv.toFixed(2),
        icInf: (media - margenError).toFixed(4),
        icSup: (media + margenError).toFixed(4),
        mediaNum: media
    };
}

const N = 100000;
const M_MUTACIONES = 250;
const K_REPLICAS = 30;

const datasetBase = Array.from({ length: N }, (_, idx) => ({
    id: idx,
    watts: Math.floor(Math.random() * 5000)
}));

const tiemposPila = [];
const tiemposReprocesamiento = [];

if (global.gc) global.gc();
const heapInicial = process.memoryUsage().heapUsed;

for (let r = 0; r < K_REPLICAS; r++) {
    // 1. Medición Estrategia A: Pila Transaccional O(m)
    const gestorA = new GestorOrdenamientoTransaccional(datasetBase);
    for (let m = 0; m < M_MUTACIONES; m++) {
        const idx = Math.floor(Math.random() * N);
        gestorA.actualizarConRegistroDelta(idx, Math.floor(Math.random() * 5000), 'LOTE_ERR_01');
    }
    const t0A = performance.now();
    gestorA.deshacerLoteTransaccional('LOTE_ERR_01');
    const t1A = performance.now();
    tiemposPila.push(t1A - t0A);

    // 2. Medición Estrategia B: Re-procesamiento completo O(N log N)
    const gestorB = new GestorOrdenamientoTransaccional(datasetBase);
    for (let m = 0; m < M_MUTACIONES; m++) {
        const idx = Math.floor(Math.random() * N);
        gestorB.registros[idx].watts = Math.floor(Math.random() * 5000);
    }
    const t0B = performance.now();
    gestorB.reprocesarOrdenamientoCompleto();
    const t1B = performance.now();
    tiemposReprocesamiento.push(t1B - t0B);
}

if (global.gc) global.gc();
const heapFinal = process.memoryUsage().heapUsed;
const deltaHeapMB = ((heapFinal - heapInicial) / (1024 * 1024)).toFixed(3);

const estPila = calcularEstadisticas(tiemposPila);
const estReproc = calcularEstadisticas(tiemposReprocesamiento);
const ahorro = ((1 - estPila.mediaNum / estReproc.mediaNum) * 100).toFixed(2);

console.log(`=== ANÁLISIS ESTADÍSTICO COMPARATIVO (N=${N}, m=${M_MUTACIONES}, k=${K_REPLICAS}) ===`);
console.table([
    {
        Estrategia: 'Pila Transaccional LIFO O(m)',
        'Media (ms)': estPila.media,
        'Desv. Est. s (ms)': estPila.desvEst,
        'CV (%)': estPila.cv,
        'IC 95% (ms)': `[${estPila.icInf}, ${estPila.icSup}]`
    },
    {
        Estrategia: 'Re-ordenamiento Completo O(N log N)',
        'Media (ms)': estReproc.media,
        'Desv. Est. s (ms)': estReproc.desvEst,
        'CV (%)': estReproc.cv,
        'IC 95% (ms)': `[${estReproc.icInf}, ${estReproc.icSup}]`
    }
]);
console.log(`Tasa de Ahorro Computacional (eta): ${ahorro}%`);
console.log(`Variación Neta de Memoria Heap (Delta M): ${deltaHeapMB} MB`);