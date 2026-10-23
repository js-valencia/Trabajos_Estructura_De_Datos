const historialSatelital = [];

const LIMITE_HISTORIAL = 50; // Límite máximo de registros.

function procesarCoordenadaOptimizada() {
    const paquete = {
        timestamp: Date.now(),
        lat: Math.random() * 90,
        lng: Math.random() * 180,

        // Carga útil de datos topográficos.
        payload: new Array(100000).fill('datos_topograficos_optimizados')
    };

    // Guardamos el nuevo paquete en el historial.
    historialSatelital.push(paquete);

    // Eliminamos el registro más antiguo si superamos el límite.
    if (historialSatelital.length > LIMITE_HISTORIAL) {
        historialSatelital.shift(); // Eliminación FIFO.
    }
}

// Procesamos 1000 coordenadas.
for (let i = 1; i <= 1000; i++) {
    procesarCoordenadaOptimizada();

    // Monitoreamos la memoria cada 200 iteraciones.
    if (i % 200 === 0) {
        // Forzamos el Garbage Collector si está disponible.
        if (global.gc) {
            global.gc();
        }

        const memoryUsed = Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024
        );

        console.log(
            `Iteración ${i} | RAM Controlada: ${memoryUsed} MB`
        );
    }
}

// Mostramos el resultado final.
console.log(`Historial final: ${historialSatelital.length} registros.`);
console.log("[Auditoría] Finalizado. Memoria controlada.");