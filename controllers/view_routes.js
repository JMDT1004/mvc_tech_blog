const router = require('express').Router();
const { User, Post, Dashboard } = require('../models');

// Homepage
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [User],
            order: [['createdAt', 'DESC']],
        });
        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            isHome: true,
            isLoggedIn: !!req.session.user_id,
            posts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
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
router.get('/dashboard', async (req, res) => {
    if (!req.session.user_id) return res.redirect('/login');

    try {
        const dashboardData = await Dashboard.findAll({
            where: {
                userId: req.session.user_id
            },
            include: [{
                model: Post,
                include: [User]
            }]
        });

        const dashboards = dashboardData.map((dashboard) => dashboard.get({ plain: true }));

        res.render('dashboard', {
            dashboards,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
