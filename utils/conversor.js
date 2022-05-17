'use strict'


module.exports = { tipoDoc, tipoRecibo }

function tipoDoc (tipo) {
  if (typeof tipo !== 'number') {
    throw new TypeError('el tipo de documento debe ser un numero')
  }
    const tipoDoc = {
        96 : "DNI",
        80 : "CUIT",
        86 : "CUIL",
        87 : "Cedula",
        89:"LE",
        90:"LC",
        91:"CI Extranjera",
        94:"Pasaporte",
        99:"Doc. (Otro)"
    };
  return tipoDoc[tipo]
}

function tipoRecibo (tipo) {
    const tipoRec = {
        11 : "Factura",
        15 : "Recibo",
    };
  return tipoRec[tipo]
}

