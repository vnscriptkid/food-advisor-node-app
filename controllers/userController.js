const User = require('mongoose').model('User');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.registerForm = (req, res, next) => {
    res.render('register', { title: 'Register' })
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').not().isEmpty();

    req.checkBody('email', 'Email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail();

    req.checkBody('password', 'Password cannot be blank!').not().isEmpty();
    req.checkBody('password-confirm', 'Confirm password cannot be blank!').not().isEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match!').equals(req.body.password);


    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(e => e.msg));
        res.render('register', { title: 'Register', flashes: req.flash(), body: req.body })
        return;
    }
    next();
}

exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    await User.register(user, req.body.password);
    next();
}