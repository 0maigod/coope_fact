const router = require('express').Router();
const passport = require('passport');


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

router.get('/ultima', facturaController.factura_view)
    .get('/profile', checkAuth, facturaController.profile);

module.exports = router;