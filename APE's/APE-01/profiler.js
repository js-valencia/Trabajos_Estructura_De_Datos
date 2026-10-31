function getMemoryUsage() {
    const memoryData = process.memoryUsage();
    // Convertimos de bytes a Megabytes (MB) usando notación matemática estándar
    const heapUsedMB = Math.round(memoryData.heapUsed / 1024 / 1024 * 100) / 100;
    return heapUsedMB;
}
module.exports = { getMemoryUsage };