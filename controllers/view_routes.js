const router = require('express').Router();
const { User, Post, Dashboard } = require('../models');

// Homepage
router.get('/', async (req, res) => {
    try {
        const dashboardData = await Dashboard.findAll({
            include: [{
                model: Post,
                include: [User],
                order: [['createdAt', 'DESC']],
            }],
        });

        // Extract posts from all dashboards
        let posts = [];
        dashboardData.forEach(dashboard => {
            const dashboardPosts = dashboard.get({ plain: true }).posts;
            posts = [...posts, ...dashboardPosts];
        });

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
        const dashboardData = await Dashboard.findOne({
            where: {
                userId: req.session.user_id
            },
            include: [{
                model: Post,
                include: [User],
                order: [['createdAt', 'DESC']],
            }],
        });

        const dashboard = dashboardData.get({ plain: true });

        res.render('dashboard', {
            dashboard,
            isLoggedIn: !!req.session.user_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
