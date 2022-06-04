let data = {
    'CantReg' 	: 1,  // Cantidad de comprobantes a registrar
    'PtoVta' 	: 1,  // Punto de venta
    'CbteTipo' 	: parseInt(tipoFactura),  // Tipo de comprobante (ver tipos disponibles) 
    'Concepto' 	: 2,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
    'DocTipo' 	: parseInt(tipoDocumento), // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
    'DocNro' 	: parseInt(doc_numero),  // Número de documento del comprador (0 consumidor final)
    'CbteDesde' 	: 0,  // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
    'CbteHasta' 	: 0,  // Número de comprobante o numero del último comprobante en caso de ser mas de uno
    'CbteFch' 	: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
    'FchServDesde' 	: parseInt(dateAyer.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
    'FchServHasta' 	: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
    'FchVtoPago' 	: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
    'ImpTotal' 	: parseInt(importe), // Importe total del comprobante
    'ImpTotConc' 	: 0,   // Importe neto no gravado
    'ImpNeto' 	: parseInt(importe), // Importe neto gravado
    'ImpOpEx' 	: 0,   // Importe exento de IVA
    'ImpIVA' 	: 0,  //Importe total de IVA
    'ImpTrib' 	: 0,   //Importe total de tributos
    'MonId' 	: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
    'MonCotiz' 	: 1,     // Cotización de la moneda usada (1 para pesos argentinos)  
    // 'Iva' 		: [ // (Opcional) Alícuotas asociadas al comprobante
    //     {
    //         'Id' 		: 3, // Id del tipo de IVA (3 para 0%)(ver tipos disponibles) 
    //         'BaseImp' 	: 0, // Base imponible
    //         'Importe' 	: 0 // Importe 
    //     }
    // ],
};

module.exports = data