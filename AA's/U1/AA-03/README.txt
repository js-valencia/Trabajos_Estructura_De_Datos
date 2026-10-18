Ejecutar desde esta carpeta (todos los archivos juntos):

node --expose-gc --max-old-space-size=512 caso1_fuga.js      (termina con "heap out of memory")
node --expose-gc --max-old-space-size=512 caso1_corregido.js (heapUsed estable)
node --expose-gc caso2.js                                    (con delete)
node --expose-gc caso2.js sin-delete                         (control, sin delete)
node --expose-gc caso3.js                                    (con fuga)
node --expose-gc caso3.js corregido                          (con off() en cerrarSesion)

PD: Anoten node -v y usen SUS mediciones en el informe.