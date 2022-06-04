const router = require('express').Router();
// const passport = require('passport');


const facturaController = require('../controller/FacturasController');

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Ingrese para continuar !");
        res.redirect('/login');
    }
}

router.get('/nueva', checkAuth, facturaController.factura_view)
    .post('/nueva', checkAuth, facturaController.factura_save)
    .get('/recibo', checkAuth, facturaController.factura_recibo)
    .get('/talonario', checkAuth, facturaController.factura_view)
    .post('/fac_anterior', checkAuth, facturaController.factura_anteriores)
    .get('/ped_recibo', checkAuth, facturaController.fac_pedidofactura)
    .post('/rec_anterior', checkAuth, facturaController.recibo_anteriores)
    .get('/profile', checkAuth, facturaController.profile)
    get('/download', facturaController.generatePdf);

module.exports = router;
