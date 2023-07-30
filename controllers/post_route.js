const router = require('express').Router();
const { Post } = require('../models');
// Route to create a new post
router.post('/post', async (req, res) => {
    // Assume req.body contains { title, content } for the new post
    try {
        const newPost = await Post.create({
            ...req.body,
            userId: req.session.user_id,
            dashboardId: req.session.dashboard_id
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
});

// Route to update an existing post
router.put('/post/:id', async (req, res) => {
    // Assume req.body contains { title, content } for the post
    try {
        const updatedPost = await Post.update(
            { ...req.body },
            {
                where: {
                    id: req.params.id, userId: req.session.user_id
                }
            }
        );

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating post');
    }
});

// Route to delete an existing post
router.delete('/post/:id', async (req, res) => {
    try {
        await Post.destroy({
            where: {
                id: req.params.id, userId: req.session.user_id
            }
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting post');
    }
});

module.exports = router;