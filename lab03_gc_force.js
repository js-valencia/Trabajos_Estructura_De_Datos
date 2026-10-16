const { performance } = require('perf_hooks');

// Referencia global: el GC no puede eliminar lo que esté aquí.
const historialSatelitalGlobal = [];

console.log("[Auditoría] Iniciando simulación de Memory Leak con GC...");

function procesarCoordenada() {
    // Simulamos un paquete de datos entrante.
    const paquete = {
        timestamp: Date.now(),
        lat: Math.random() * 90,
        lng: Math.random() * 180,

        // Carga útil pesada para acelerar el llenado de la memoria.
        payload: new Array(100000).fill('datos_topograficos_basura')
    };

    // Almacenamos los datos indefinidamente.
    historialSatelitalGlobal.push(paquete);
}

// Monitoreo de la memoria Heap cada 100 iteraciones.
for (let i = 1; i <= 500; i++) {
    procesarCoordenada();

    if (i % 100 === 0) {

        // Forzamos la ejecución del Garbage Collector.
        if (global.gc) {
            global.gc();
        }

        const memoryUsed = Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024
        );

        console.log(`Iteración ${i} | RAM post-GC: ${memoryUsed} MB`);
    }
}

console.log(
    `[Auditoría] Finalizado. El arreglo retiene ${historialSatelitalGlobal.length} registros en el Heap.`
);