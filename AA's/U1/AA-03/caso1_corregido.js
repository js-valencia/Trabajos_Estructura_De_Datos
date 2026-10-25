const { mem } = require('./util');
let ejecutorGlobal = null;
function crearProcesadorResiduos() {
  let datosMasivos = new Array(10 * 1024 * 1024).fill("DATA_CRITICA");
  let copiaAnterior = ejecutorGlobal;
  let funcionRetenida = function () {
    if (datosMasivos) console.log("Referencia activa a datos masivos");
  };
  ejecutorGlobal = function () {
    console.log("Ejecutando proceso liviano...");
    if (copiaAnterior) copiaAnterior();
  };
  datosMasivos = null; // corrección: rompe la retención
}
let n = 0;
const t = setInterval(() => {
  crearProcesadorResiduos();
  if (global.gc) global.gc();
  mem(`Iteración ${++n}`);
  if (n === 12) clearInterval(t);
}, 200);
