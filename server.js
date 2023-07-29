//requirements
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');

const sequelize = require('./config/connection');

const userRoutes = require('./controllers/user_routes');
const viewRoutes = require('./controllers/view_routes');

const app = express();
const PORT = process.env.PORT || 3333;


app.engine('hbs', engine({
  layoutsDir: './views/layouts',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//cookies
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

// error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`));
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});