// Añada esto dentro de su ciclo iterativo, después del push al historial
if (i % 100 === 0) {
// Si global.gc está expuesto, lo forzamos a limpiar
if (global.gc) {
global.gc(); // Ejecutamos el barrido manual
}
const memoryUsed = Math.round(process.memoryUsage().heapUsed / 1024 /
1024);
console.log(`Iteración ${i} | RAM post-GC: ${memoryUsed} MB`);
}
