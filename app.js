const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const path = require('path');
const helpers = require('./helpers');
const routes = require('./routes');
const app = express();
const passport = require('passport');
require('./handlers/passport');

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded || application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// add some methods for validation
app.use(expressValidator());

// session proccessing
app.use(session({
    secret: 'noonenothiscodeexceptme',
    resave: false,
    saveUninitialized: false
}))

// flash messages
app.use(flash())

// passport handle login
app.use(passport.initialize())
app.use(passport.session())

// add global variables for templates
app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// test
// app.use(function(req, res, next) {
//     console.log(req.user && typeof req.user._id);
//     console.log(req.user && req.user._id);
//     console.log(req.user && typeof req.user.id);
//     console.log(req.user && req.user.id);
//     next();
// })

// handle all routes
app.use('/', routes);

module.exports = app;