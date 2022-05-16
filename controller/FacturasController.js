require('dotenv').config()
const Afip = require('@afipsdk/afip.js');

const controller = {};
const config = {
    privateKeyContents: process.env.AFIP_PRIVATE_KEY,
    certContents: process.env.AFIP_CERT,
    CUIT: process.env.CUIT
}

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

controller.factura_save = async (req, res) => {
    const { email, 
            tipoFactura, 
            // conceptoFactura,
            tipoDocumento,
            doc_numero,
            importe
            // detalleFactura 
        } = req.body;
    // const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const hoy = Date.now()
    const ayer = hoy - 86400000
    const date = new Date(hoy - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const dateAyer = new Date(ayer - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

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

    const respuesta = await afip.ElectronicBilling.createNextVoucher(data);
    // console.log(`CAE asignado el comprobante ${respuesta['CAE']} y Fecha de vencimiento del CAE (yyyy-mm-dd) ${respuesta['CAEFchVto']}`)
    req.session.context = Object.assign(req.body , respuesta, {fecha:date});
    res.redirect('recibo', 200, { csrfToken: req.csrfToken() });
    
};

controller.factura_view = (req, res, next) => {
    res.render('nueva_factura', { csrfToken: req.csrfToken(), verified : req.user.isVerified });
}

controller.factura_recibo = (req, res, next) => {
    let context = req.session.context;
    console.log(JSON.stringify(context));
    res.render('recibo', { csrfToken: req.csrfToken(), context: context });
}

controller.profile = (req, res) => {
    console.log("csruf: " + req.csrfToken());
    res.render('profile', { username: req.user.username, verified : req.user.isVerified });
};


module.exports = controller;