const Afip = require('@afipsdk/afip.js');
const afip = new Afip({ CUIT: 20228469735 });

const controller = {};


controller.factura_view = async (req, res) => {
    // const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(1,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
    const voucherInfo = await afip.ElectronicBilling.getVoucherTypes(); //Devuelve la información de los tipos de comprobante

        if(voucherInfo === null){
            console.log('El comprobante no existe');
        }
        else{
            console.log('Esta es la información del comprobante:');
            console.log(voucherInfo);
        }
        res.render('ultima_factura');
};

controller.factura_save = (req, res, next) => {
    res.send('Vamos a crear una factura en breve!!')
}


module.exports = controller;