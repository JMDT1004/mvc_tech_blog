const router = require('express').Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const formIdentifier = req.body.email;
        const formPassword = req.body.password;

        const isEmailFormat = /\S+@\S+\.\S+/.test(formIdentifier);
        let user;

        if (isEmailFormat) {
            user = await User.findOne({
                where: {
                    email: formIdentifier
                }
            });
        } else {
            user = await User.findOne({
                where: {
                    username: formIdentifier
                }
            });
        }
        if (!user) {
            console.log('User Does Not Exist')
            return res.redirect('/register');
        }

        const isValidPass = await user.validatePass(formPassword);

        if (!isValidPass) {
            console.log('Invalid Password')
            return res.send({ error: 'Incorrect Password' })
        }

        req.session.user_id = user.id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');

    }
});

router.post('/register', async (req, res) => {
    try {
      const password = req.body.password;
      const verifyPassword = req.body.verifyPassword;
  
      console.log("Password:", req.body.password);
      console.log("Verify Password:", req.body.verifyPassword);
  
      if (password !== verifyPassword) {
        return res.redirect('/register');
      };

      // Check if the email is already taken
      const existingEmail = await User.findOne({ where: { email: req.body.email } });
      if (existingEmail) {
        return res.redirect('/register');
      }
  
      // Check if the username is already taken
      const existingUsername = await User.findOne({ where: { username: req.body.username } });
      if (existingUsername) {
        return res.redirect('/register');
      }
  
      // Passwords match, and email/username are available, proceed with user creation
      const newUser = await User.create(req.body);
      req.session.user_id = newUser.id;
      console.log('Created ID');
      res.redirect('/mood');
  
    } catch (err) {
      // Log the error message to the console
      console.error(err);
  
      // Handle other errors
      return res.status(500).json('Internal Server Error');
    }
  });

module.exports = router;