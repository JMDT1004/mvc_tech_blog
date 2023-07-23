//requirements
const path = require('path');
const express = require('express');
const exhbs = require('express-handlebars');
const hbs = exhbs.create({ extname: '.hbs' })
const session = require('express-session');

const sequelize = require('./config/connection');

const userRoutes = require('./controllers/user_routes');
const viewRoutes = require('./controllers/view_routes');

const app = express();
const PORT = process.env.PORT || 3333;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//coockies
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 10 * 60 * 1000
  }
}));

app.use([userRoutes, viewRoutes]);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
