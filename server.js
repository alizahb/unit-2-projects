const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

//const isSignedIn = require('./middleware/is-signed-in.js');
//const passUserToView = require('./middleware/pass-user-to-view.js');
//const controllers here

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
  
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  // app.use(morgan('dev'));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use('/assets', express.static('public')); 
  
  app.get('/', (req, res) => {
    res.render('index.ejs', {
      user: req.session.user,
    });
  });
  /*
  app.use(passUserToView);
  app.use('/auth', authController);
  app.use(isSignedIn);
  app.use('/users', usersController);
  //app.use for other controllers 

*/

app.listen(3000, () => console.log('Running on port 3000! ')); 