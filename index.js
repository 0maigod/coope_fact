const express = require('express');
const mongoose = require('mongoose');
const csrf = require('csurf');
const RouterLogin = require('./routes/login');
const RouterFacturas = require('./routes/facturas');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession)
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const fs = require('fs');

require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views',);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = require('./config/mongoKEY');
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, },).then(() => console.log("Connected !"),);

mongoose.connect(mongoURI, { useNewUrlParser: true, 
                            useUnifiedTopology: true,
                            useFindAndModify: false, 
                            useCreateIndex: true, })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log("err No pude conectar con la DB de usuarios"));

app.use(cookieParser('random'));
app.use(csrf({ cookie: true }));

app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new MemoryStore(),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', RouterLogin);
app.use('/factura', RouterFacturas);

// const ceritificado = require('./config/private_key');
// console.log('nuevito..=================' + ceritificado)

// fs.readFile(path.resolve(__dirname, 'node_modules/@afipsdk/afip.js/src/Afip_res/key'), 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log('original =================' + data);
//   });

app.listen(PORT, () => console.log("Server Started At " + PORT));