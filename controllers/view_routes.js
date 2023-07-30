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
            const dashboardPosts = dashboard.get(
                {
                    plain: true
                }
            ).posts;
            posts = [...posts, ...dashboardPosts];
        });

        res.render('homepage', {
            isHome: true,
            isLoggedIn: !!req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Homepage load Error');
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
        let dashboardData = await Dashboard.findOne({
            where: {
                userId: req.session.user_id
            },
            include: [{
                model: Post,
                include: [User],
                order: [['createdAt', 'DESC']],
            }],
        });

        let dashboard = null;

        // If the user has a dashboard, extract its data.
        // Otherwise, use an empty object.
        if (dashboardData) {
            dashboard = dashboardData.get({ plain: true });
        } else {
            dashboard = {};
        }

        res.render('dashboard', {
            dashboard,
            isLoggedIn: !!req.session.user_id,
            canCreatePost: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Dashboard Error');
    }
});


module.exports = router;