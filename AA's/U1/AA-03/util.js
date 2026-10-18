const mb = n => (n / 1024 / 1024).toFixed(1);
function mem(etiqueta) {
  const m = process.memoryUsage();
  console.log(`${etiqueta} | heapUsed=${mb(m.heapUsed)} MB | arrayBuffers=${mb(m.arrayBuffers)} MB`);
}
module.exports = { mem };
