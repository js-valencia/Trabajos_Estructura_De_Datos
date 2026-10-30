class NodoGrafo {
  constructor(id) { this.id = id; this.vecinos = []; }
  conectarCon(nodo) { this.vecinos.push(nodo); }
}
let refA;
function construirGrafoCiclico() {
  let nodoA = new NodoGrafo("A");
  let nodoB = new NodoGrafo("B");
  let nodoC = new NodoGrafo("C");
  nodoA.conectarCon(nodoB);
  nodoB.conectarCon(nodoC);
  nodoC.conectarCon(nodoA);
  refA = new WeakRef(nodoA);
  gestorCache.set(nodoA.id, nodoA);
  return nodoA.id;
}
const gestorCache = new Map();
let idRaiz = construirGrafoCiclico();

const DELETE = process.argv[2] !== 'sin-delete';
setTimeout(() => {
  global.gc();
  console.log('Tras retornar (sin delete) + GC:', refA.deref() ? 'vivo' : 'recolectado');
  if (DELETE) gestorCache.delete(idRaiz);
  setTimeout(() => {
    global.gc();
    console.log(`Tras ${DELETE ? 'delete' : 'NO hacer delete'} + GC:`, refA.deref() ? 'vivo' : 'recolectado');
  }, 100);
}, 100);

try { new WeakMap().set("A", 1); } catch (e) { console.log('WeakMap con clave string ->', e.constructor.name + ':', e.message); }
