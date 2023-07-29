const router = require('express').Router();
const User = require('../models/User');
const Dashboard = require('../models/Dashboard');
const bcrypt = require('bcrypt')

// Homepage
router.get('/', (req, res) => {
    res.render('', {
        isHome: true,
        isLoggedIn: req.session.user_id
    });
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', {
        isLogin: true
    });
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register', {
        isRegister: true
    });
});

// Dashboard Page
router.get('/dashboard', (req, res) => {
    if (!req.session.user_id) return res.redirect('/login');

    res.render('dashboard');
});

module.exports = router;