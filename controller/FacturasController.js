require('dotenv').config()
const Afip = require('@afipsdk/afip.js');

const controller = {};
const config = {
    privateKeyContents: process.env.AFIP_PRIVATE_KEY,
    certContents: process.env.AFIP_CERT,
    CUIT: process.env.CUIT
}

// const afip = new Afip({ CUIT: process.env.CUIT });
const afip = new Afip(config);
            
// controller.factura_view = async (req, res) => {
//     // const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(1,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
//     const voucherInfo = await afip.ElectronicBilling.getLastVoucher(1,6); 
//     // tipo de comprobante 1 (Factura A)
//     // tipo de comprobante 11 (Factura C)
//     // const voucherInfo = await afip.ElectronicBilling.getSalesPoints()
//     // const voucherInfo = await afip.ElectronicBilling.createVoucher(data)
//     // const voucherInfo = await afip.ElectronicBilling.getVoucherTypes(); //Devuelve la información de los tipos de comprobante
//     let users = []
//         if(voucherInfo === null){
//             console.log('El comprobante no existe');
//         }
//         else{
//             console.log('Esta es la información del comprobante:');
//             // console.log(voucherInfo[0].Id);
//             // console.log('Created bill', JSON.stringify(voucherInfo, null, 4));
//             console.log(voucherInfo);
//             // users = voucherInfo
//         }
//         // res.render('ultima_factura', { username: req.user.username, verified : req.user.isVerified, users: users });
//         res.render('ultima_factura', { users: 'Omero' });
// };

controller.factura_view = async (req, res) => {
        
    const tipoFactura = await afip.ElectronicBilling.getVoucherTypes()
    const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
 
    let data = {
        'CantReg' 	: 1,  // Cantidad de comprobantes a registrar
        'PtoVta' 	: 1,  // Punto de venta
        'CbteTipo' 	: 6,  // Tipo de comprobante (ver tipos disponibles) 
        'Concepto' 	: 1,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        'DocTipo' 	: 99, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
        'DocNro' 	: 0,  // Número de documento del comprador (0 consumidor final)
        'CbteDesde' 	: 0,  // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
        'CbteHasta' 	: 0,  // Número de comprobante o numero del último comprobante en caso de ser mas de uno
        'CbteFch' 	: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        'ImpTotal' 	: 121, // Importe total del comprobante
        'ImpTotConc' 	: 0,   // Importe neto no gravado
        'ImpNeto' 	: 100, // Importe neto gravado
        'ImpOpEx' 	: 0,   // Importe exento de IVA
        'ImpIVA' 	: 21,  //Importe total de IVA
        'ImpTrib' 	: 0,   //Importe total de tributos
        'MonId' 	: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
        'MonCotiz' 	: 1,     // Cotización de la moneda usada (1 para pesos argentinos)  
        'Iva' 		: [ // (Opcional) Alícuotas asociadas al comprobante
            {
                'Id' 		: 5, // Id del tipo de IVA (5 para 21%)(ver tipos disponibles) 
                'BaseImp' 	: 100, // Base imponible
                'Importe' 	: 21 // Importe 
            }
        ],
    };

    const respuesta = await afip.ElectronicBilling.createNextVoucher(data);
    console.log(`CAE asignado el comprobante ${respuesta['CAE']} y Fecha de vencimiento del CAE (yyyy-mm-dd) ${respuesta['CAEFchVto']}`)
    res.render('ultima_factura');
};

controller.factura_save = (req, res, next) => {
    res.send('Vamos a crear una factura en breve!!')
}

controller.profile = (req, res) => {
    res.render('profile', { username: req.user.username, verified : req.user.isVerified });
};


module.exports = controller;