const router = require('express').Router();
const User = require('../models/User');

//login existing user
router.post('/login', async (req, res) => {
  try {
    const formIdentifier = req.body.email;
    const formPassword = req.body.password;

    const isEmailFormat = /\S+@\S+\.\S+/.test(formIdentifier);
    let user;
    //confirm email or username
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
    //confirm password
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

//register new user
router.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;

    console.log("Password:", req.body.password);
    console.log("Verify Password:", req.body.verifyPassword);

    if (password !== verifyPassword) {
      return res.redirect('/register');
    };

    // verify email is available for use
    const existingEmail = await User.findOne({ where: { email: req.body.email } });
    if (existingEmail) {
      return res.redirect('/register');
    }

    // verify username is available for use
    const existingUsername = await User.findOne({ where: { username: req.body.username } });
    if (existingUsername) {
      return res.redirect('/register');
    }

    //Proceed with user creation
    const newUser = await User.create(req.body);
    req.session.user_id = newUser.id;
    console.log('Created ID');
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    return res.status(500).json('Internal Server Error');
  }
});

//log out user
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('user_id')
  res.redirect('/');
});

module.exports = router;