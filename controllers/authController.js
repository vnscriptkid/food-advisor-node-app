const passport = require('passport');
const User = require('mongoose').model('User');
const Store = require('mongoose').model('Store');
const crypto = require('crypto');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
})

exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to log in first!');
        res.redirect('/');
        return;
    }
    next();
}

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
}

exports.account = (req, res) => {
    res.render('account', { title: 'Edit Account' })
}

exports.updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    )

    req.flash('success', 'Updated successfully!');
    res.redirect('back');
}

exports.forgot = async (req, res) => {
    // 1. find if the email provided is existed
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'The email provided does not exist!');
        return res.redirect('/login');
    }
    // 2. Set reset tokens and expiry on the account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // 3. Send the token to the email
    req.flash('success', 'You have been emailed a password reset link!');

    // 4. redirect to login page
    res.redirect('/login');
}

exports.reset = async (req, res) => {
    // 1. find user with given token and within expire time
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired!');
        return res.redirect('/login');
    }
    
    // 2. redirect to reset password page
    res.render('reset', { title: 'Reset your password!', token: req.params.token });
}

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        return next();
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
}

exports.update = async (req, res) => {
    // 1. find user with given token and within expire time
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired!');
        return res.redirect('/login');
    }

    // Reset the password in db and clear token + expire time
    await user.setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Notify success
    req.flash('success', 'Reset password successfully, Login now!');
    res.redirect('/login');
}



