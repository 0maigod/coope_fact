require('dotenv').config()
const { tipoDoc, tipoRecibo, fechaConvA, fechaConvB, tipoNivel } = require('../utils/conversor')
const Afip = require('@afipsdk/afip.js');

const controller = {};
const config = {
    // key: 'private_key.js', 
    // cert: 'cert.js',
    // res_folder: './config',
    CUIT: process.env.CUIT
}

const afip = new Afip(config);

controller.factura_save = async (req, res) => {
    const { tipoFactura,
            tipoDocumento,
            doc_numero,
            importe
        } = req.body;
        
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
    try {
        const respuesta = await afip.ElectronicBilling.createNextVoucher(data);
        req.session.context = Object.assign(
            req.body, 
            respuesta, 
            {tipoDocumentoL:tipoDoc(req.body.tipoDocumento)},
            {nivel:tipoNivel(req.body.nivel)},
            {fecha:fechaConvB(date)}, 
            {tipoFacturaL:tipoRecibo(req.body.tipoFactura)},
            {CAEFchVto:fechaConvB(respuesta.CAEFchVto)}
            );
        console.log(req.session.context);
        res.redirect('recibo', 200, { csrfToken: req.csrfToken() });
      }
      catch(e) {
        // console.error(e.message);
        // req.flash('error_messages', "Error al completar la operacion!");
        res.render("nueva_factura", { error: e.message, csrfToken: req.csrfToken() })
    }
    // console.log(`CAE asignado el comprobante ${respuesta['CAE']} y Fecha de vencimiento del CAE (yyyy-mm-dd) ${respuesta['CAEFchVto']}`)
};

controller.factura_recibo = (req, res, next) => {
    let context = req.session.context;
    context.tipoDocumento = tipoDoc(context.tipoDocumento)
    context.tipoFacturaL = tipoRecibo(context.tipoFactura)
    // context.fecha = fechaConvB(context.fecha)
    // console.log("Factura recien Hecha "+JSON.stringify(context));
    res.render('recibo', { csrfToken: req.csrfToken(), context: context });
}

controller.factura_view = (req, res, next) => {
    res.render('nueva_factura', { csrfToken: req.csrfToken(), verified : req.user.isVerified });
}

controller.factura_anteriores = async (req, res, next) => {
    const { numeroFactura } = req.body;
    try {
        const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(numeroFactura,1,11); //Devuelve la información del comprobante "numeroFactura" para el punto de venta 1 y el tipo de comprobante 11 (Factura C)
        voucherInfo.DocTipo = tipoDoc(voucherInfo.DocTipo)
        // voucherInfo.CbteFch = fechaConv(voucherInfo.CbteFch)
        voucherInfo.CbteTipoL = tipoRecibo(voucherInfo.CbteTipo)
        req.session.context = Object.assign(voucherInfo);
        console.log(req.session.context);
        // console.log("Factura Pedida "+JSON.stringify(voucherInfo));
        res.redirect('ped_recibo', 200, { csrfToken: req.csrfToken() });
      }
      catch(e) {
        // console.error(e.message);
        // req.flash('error_messages', "Error al completar la operacion!");
        res.render("profile", { error: `No existe el comprobante solicitado`, csrfToken: req.csrfToken(), username: req.user.username, verified : req.user.isVerified })
    }
}

controller.fac_pedidofactura = (req, res, next) => {
    let context = req.session.context;
    // console.log(JSON.stringify(context));
    res.render('recibo', { csrfToken: req.csrfToken(), context: context });
}

controller.recibo_anteriores = async (req, res, next) => {
    const { numeroRecibo } = req.body;
    try {
        const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(numeroRecibo,1,15); //Devuelve la información del comprobante "numeroRecibo" para el punto de venta 1 y el tipo de comprobante 15 (Recibo C)

        voucherInfo.DocTipo = tipoDoc(voucherInfo.DocTipo)
        // voucherInfo.CbteFch = fechaConv(voucherInfo.CbteFch)
        voucherInfo.CbteTipoL = tipoRecibo(voucherInfo.CbteTipo)
        req.session.context = Object.assign(voucherInfo);
        res.redirect('ped_recibo', 200, { csrfToken: req.csrfToken() });
      }
      catch(e) {
        // console.error(e.message);
        // req.flash('error_messages', "Error al completar la operacion!");
        res.render("profile", { error: `No existe el comprobante solicitado`, csrfToken: req.csrfToken(), username: req.user.username, verified : req.user.isVerified })
    }
}

controller.profile = (req, res) => {
    // console.log("csruf: " + req.csrfToken());
    res.render('profile', { csrfToken: req.csrfToken(), username: req.user.username, verified : req.user.isVerified });
};


module.exports = controller;