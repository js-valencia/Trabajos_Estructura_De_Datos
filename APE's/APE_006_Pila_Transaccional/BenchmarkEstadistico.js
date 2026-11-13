const { performance } = require("perf_hooks");
const assert = require("assert");
const GestorOrdenamientoTransaccional =
  require("./GestorOrdenamientoTransaccional");

const N = 100000;
const M_MUTACIONES = 250;
const K_REPLICAS = 30;
const T_CRITICO_95 = 2.045; // t de Student, 29 grados de libertad.
const MAX_DESPLAZAMIENTO_WATTS = 20;

function calcularEstadisticas(muestras) {
  const k = muestras.length;
  const media = muestras.reduce((suma, valor) => suma + valor, 0) / k;
  const varianza = muestras.reduce(
    (suma, valor) => suma + Math.pow(valor - media, 2), 0
  ) / (k - 1);
  const desviacion = Math.sqrt(varianza);
  const cv = media === 0 ? 0 : (desviacion / media) * 100;
  const margen = T_CRITICO_95 * (desviacion / Math.sqrt(k));

  return {
    media, desviacion, cv,
    icInferior: media - margen,
    icSuperior: media + margen
  };
}

function crearDatosBase(n) {
  const datos = Array.from({ length: n }, (_, id) => ({
    id,
    watts: Math.floor(Math.random() * 5000)
  }));
  return datos.sort((a, b) => a.watts - b.watts);
}

function crearPlanMutaciones(datos, cantidad) {
  const operaciones = [];
  for (let i = 0; i < cantidad; i++) {
    const registro = datos[Math.floor(Math.random() * datos.length)];
    // Variación local de telemetría: limita desplazamientos extremos en el arreglo.
    const variacion = Math.floor(
      Math.random() * (2 * MAX_DESPLAZAMIENTO_WATTS + 1)
    ) - MAX_DESPLAZAMIENTO_WATTS;

    operaciones.push({
      id: registro.id,
      nuevoWatts: Math.max(0, Math.min(5000, registro.watts + variacion))
    });
  }
  return operaciones;
}

function crearWattsOriginalesPorId(datos) {
  const originales = new Array(datos.length);
  for (const registro of datos) originales[registro.id] = registro.watts;
  return originales;
}

function mismoEstado(registros, basePorId) {
  if (registros.length !== basePorId.length) return false;
  for (const registro of registros) {
    if (registro.watts !== basePorId[registro.id]) return false;
  }
  return true;
}

function ejecutarBenchmark() {
  const tiemposPila = [];
  const tiemposReprocesamiento = [];

  if (global.gc) global.gc();
  const heapInicial = process.memoryUsage().heapUsed;

  for (let replica = 0; replica < K_REPLICAS; replica++) {
    const datosBase = crearDatosBase(N);
    const wattsOriginales = crearWattsOriginalesPorId(datosBase);
    const plan = crearPlanMutaciones(datosBase, M_MUTACIONES);

    const gestorA = new GestorOrdenamientoTransaccional(datosBase);
    const loteId = `LOTE_ERR_${replica}`;

    for (const operacion of plan) {
      gestorA.actualizarPorId(operacion.id, operacion.nuevoWatts, loteId);
    }

    const inicioA = performance.now();
    gestorA.deshacerLoteTransaccional(loteId);
    const finA = performance.now();
    tiemposPila.push(finA - inicioA);

    assert(mismoEstado(gestorA.registros, wattsOriginales),
      "La estrategia A no restauró el estado original.");
    assert(gestorA.estaOrdenado(),
      "La estrategia A dejó los registros desordenados.");

    const gestorB = new GestorOrdenamientoTransaccional(datosBase);
    for (const operacion of plan) {
      const indice = gestorB.indicePorId.get(operacion.id);
      gestorB.registros[indice].watts = operacion.nuevoWatts;
    }

    const inicioB = performance.now();
    gestorB.reprocesarOrdenamientoCompleto(wattsOriginales);
    const finB = performance.now();
    tiemposReprocesamiento.push(finB - inicioB);

    assert(mismoEstado(gestorB.registros, wattsOriginales),
      "La estrategia B no restauró el estado original.");
    assert(gestorB.estaOrdenado(),
      "La estrategia B dejó los registros desordenados.");
  }

  if (global.gc) global.gc();
  const heapFinal = process.memoryUsage().heapUsed;
  const deltaHeapMB = (heapFinal - heapInicial) / (1024 * 1024);

  const estadisticasA = calcularEstadisticas(tiemposPila);
  const estadisticasB = calcularEstadisticas(tiemposReprocesamiento);
  const ahorro = estadisticasB.media === 0 ? 0 :
    (1 - estadisticasA.media / estadisticasB.media) * 100;

  console.log(
    `\n=== BENCHMARK (N=${N}, m=${M_MUTACIONES}, k=${K_REPLICAS}) ===`
  );
  console.log(
    `Variación local aplicada: ±${MAX_DESPLAZAMIENTO_WATTS} watts por mutación`
  );

  console.table([
    {
      Estrategia: "Pila transaccional LIFO",
      "Media (ms)": estadisticasA.media.toFixed(4),
      "Desv. est. (ms)": estadisticasA.desviacion.toFixed(4),
      "CV (%)": estadisticasA.cv.toFixed(2),
      "IC 95% (ms)": `[${estadisticasA.icInferior.toFixed(4)}, ${estadisticasA.icSuperior.toFixed(4)}]`
    },
    {
      Estrategia: "Restauración y ordenamiento completo",
      "Media (ms)": estadisticasB.media.toFixed(4),
      "Desv. est. (ms)": estadisticasB.desviacion.toFixed(4),
      "CV (%)": estadisticasB.cv.toFixed(2),
      "IC 95% (ms)": `[${estadisticasB.icInferior.toFixed(4)}, ${estadisticasB.icSuperior.toFixed(4)}]`
    }
  ]);

  console.log(`Ahorro temporal de recuperación: ${ahorro.toFixed(2)}%`);
  console.log(
    `Variación neta de Heap después de GC: ${deltaHeapMB.toFixed(3)} MB`
  );
  console.log(
    "Nota: el delta de Heap es una variación neta después del GC; " +
    "no representa el pico máximo de memoria utilizado."
  );
}

ejecutarBenchmark();
