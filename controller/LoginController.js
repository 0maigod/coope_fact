const passport = require('passport');
require('./passportLocal')(passport);
require('./googleAuth')(passport);
const user = require('../model/user');
const bcryptjs = require('bcryptjs');

const controller = {};


controller.reg_save = (req, res) => {
    // get all the values 
    const { email, username, password, confirmpassword } = req.body;
    // check if the are empty 
    if (!email || !username || !password || !confirmpassword) {
        res.render("signup", { err: "All Fields Required !", csrfToken: req.csrfToken() });
    } else if (password != confirmpassword) {
        res.render("signup", { err: "Password Don't Match !", csrfToken: req.csrfToken() });
    } else {

        // validate email and username and password 
        // skipping validation
        // check if a user exists
        user.findOne({ $or: [{ email: email }, { username: username }] }, function (err, data) {
            if (err) throw err;
            if (data) {
                res.render("signup", { err: "User Exists, Try Logging In !", csrfToken: req.csrfToken() });
            } else {
                // generate a salt
                bcryptjs.genSalt(12, (err, salt) => {
                    if (err) throw err;
                    // hash the password
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        // save user in db
                        user({
                            username: username,
                            email: email,
                            password: hash,
                            googleId: null,
                            provider: 'email',
                        }).save((err, data) => {
                            if (err) throw err;
                            // login the user
                            // use req.login
                            // redirect , if you don't want to login
                            res.redirect('/login');
                        });
                    })
                });
            }
        });
    }
};

controller.signin_view = (req, res) => {
            if (req.isAuthenticated()) {
                res.redirect('/factura/profile');
            } else {
                res.render("login", { csrfToken: req.csrfToken() });
            }
};

controller.signin_save = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/factura/profile',
        failureFlash: true,
    })(req, res, next);
}

controller.reg_view = (req, res) => {
    res.render("signup", { csrfToken: req.csrfToken() });
};

controller.fail_reg = (req, res) => {
    console.log('No se pudo registrar el usuario');
    res.render('error', { error: 'No se pudo registrar el usuario' });
};

controller.fail_log = (req, res) => {
    console.log('Error no se pudo loguear: ');
    res.render('error', { error: 'No se pudo loguear' });
};

controller.error = (req, res) => {
    console.log('tirrando error')
    res.status(200).render('error');
};

controller.logout = (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}



// .get('*', (req, res) => {
//     let { url, method } = req;
//     loggerWarn.warn('Ruta %s %s no implementada', url, method);
//     res.send(`Ruta ${method} ${url} no está implementada`);
// });


module.exports = controller;