const express = require('express');
const router = express.Router();
const passport = require('passport');
// require('./passportLocal')(passport);
require('./googleAuth')(passport);
const userRoutes = require('./accountRoutes');

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Ingrese para continuar !");
        res.redirect('/login');
    }
}

router.get('/', checkAuth, (req, res) => {
        res.render("index", { logged: true });
});

router.get('/index',  checkAuth, (req, res) => {
        console.log(req.user);
        res.render("index", { logged: true });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});

router.get('/profile', checkAuth, (req, res) => {
    // adding a new parameter for checking verification
    res.render('profile', { username: req.user.username, verified : req.user.isVerified });

});


router.use(userRoutes);

module.exports = router;