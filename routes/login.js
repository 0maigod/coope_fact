const router = require('express').Router();
const passport = require('passport');


const loginController = require('../controller/LoginController');



router.get('/', loginController.signin_view)
    .get('/login', loginController.signin_view)
    .get('/signup', loginController.reg_view)
    .post('/login', passport.authenticate('local', { failureRedirect: '/faillogin' }), loginController.signin_save)
    .post('/signup', loginController.reg_save)
    .get('/logout', loginController.logout)
    // .get('/failregister', loginController.fail_reg)
    .get('/faillogin', loginController.fail_log)
    .get('/error', loginController.error)

    

module.exports = router;