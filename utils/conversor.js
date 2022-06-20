'use strict'


module.exports = { tipoDoc, tipoRecibo, fechaConvA, fechaConvB, tipoNivel }

function tipoDoc (tipo) {
  let tipoDe = tipo
  if (typeof tipoDe !== 'number') {
    tipoDe = parseInt(tipo)
    // throw new TypeError('el tipo de documento debe ser un numero')
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
  return tipoDoc[tipoDe]
}

function tipoRecibo (tipo) {
  let tipoDe = tipo
  if (typeof tipoDe !== 'number') {
    tipoDe = parseInt(tipo)
    // throw new TypeError('el tipo de documento debe ser un numero')
  }
    const tipoRec = {
        11 : "Factura",
        15 : "Recibo",
    };
  return tipoRec[tipoDe]
}

function tipoNivel (tipo) {
  let tipoDe = tipo
  if (typeof tipoDe !== 'number') {
    tipoDe = parseInt(tipo)
    // throw new TypeError('el tipo de documento debe ser un numero')
  }
    const tipoNiv = {
        1 : "Inicial",
        2 : "Primaria",
        3 : "Secundaria",
        4 : "PEP",
        5 : "IES",
    };
  return tipoNiv[tipoDe]
}

function fechaConvA (fecha) {
  // console.log('esta es la fecha ' + fecha)
  let annio = parseInt(fecha.substring(0, 4));
  let mes = parseInt(fecha.substring(4, 6)) - 1;
  let dia = parseInt(fecha.substring(6, 8));
  // console.log('esta es el ano ' + annio)
  // console.log('esta es el mes ' + mes)
  // console.log('esta es el dia ' + dia)
  // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const convert = new Date(Date.UTC(annio, mes, dia )).toLocaleDateString('es-AR', options)
  console.log('la fecha A ' + convert)
  return convert
}

function fechaConvB (fecha) {
  // console.log('esta es la fecha ' + fecha)
  let annio = parseInt(fecha.substring(0, 4));
  let mes = parseInt(fecha.substring(5, 7)) - 1;
  let dia = parseInt(fecha.substring(8, 10));
  // console.log('esta es el ano ' + annio)
  // console.log('esta es el mes ' + mes)
  // console.log('esta es el dia ' + dia)
  // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const convert = new Date(Date.UTC(annio, mes, dia )).toLocaleDateString('es-AR', options)
  // console.log('la fecha B ' + convert)
  return convert
}

