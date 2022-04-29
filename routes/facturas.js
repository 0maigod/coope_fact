const router = require('express').Router();
const passport = require('passport');


const facturaController = require('../controller/FacturasController');


router.get('/ultima', facturaController.factura_view)
    // .post('/login', passport.authenticate('local', { failureRedirect: '/faillogin' }), loginController.signin_save)
   

module.exports = router;