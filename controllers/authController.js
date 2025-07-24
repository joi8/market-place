const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res) => {
    res.render('auth/register');
};

exports.postRegister = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        name,
        email,
        password: hashedPassword,
        role
    });
    await user.save();
    res.redirect('/login');
};

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.redirect('/login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.redirect('/login');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};